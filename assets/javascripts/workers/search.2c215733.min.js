(function () {
  "use strict";

  var SearchMessageType = {
    SETUP: 0,
    READY: 1,
    QUERY: 2,
    RESULT: 3,
  };

  function decodeEntities(input) {
    if (!input) {
      return "";
    }

    return String(input)
      .replace(/&#(\d+);/g, function (_, code) {
        return String.fromCharCode(Number(code));
      })
      .replace(/&#x([0-9a-f]+);/gi, function (_, code) {
        return String.fromCharCode(parseInt(code, 16));
      })
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&nbsp;/g, " ");
  }

  function collapseWhitespace(input) {
    return String(input || "").replace(/\s+/g, " ").trim();
  }

  function stripHtml(input) {
    return collapseWhitespace(
      decodeEntities(String(input || "").replace(/<[^>]+>/g, " "))
    );
  }

  function normalize(input) {
    return collapseWhitespace(decodeEntities(input || ""))
      .normalize("NFKC")
      .toLowerCase();
  }

  function escapeRegExp(input) {
    return String(input).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function buildTerms(query) {
    return normalize(query)
      .split(" ")
      .map(function (term) {
        return term.trim();
      })
      .filter(Boolean);
  }

  function scoreField(term, fieldValue, baseScore) {
    if (!term || !fieldValue) {
      return 0;
    }

    var index = fieldValue.indexOf(term);
    if (index === -1) {
      return 0;
    }

    return baseScore + Math.max(0, 20 - Math.min(index, 20));
  }

  function firstMatchIndex(query, terms, doc) {
    var lookups = [];
    if (query) {
      lookups.push(query);
    }

    for (var i = 0; i < terms.length; i += 1) {
      if (lookups.indexOf(terms[i]) === -1) {
        lookups.push(terms[i]);
      }
    }

    var fields = [
      doc.textNormalized,
      doc.titleNormalized,
      doc.tagsNormalized,
      doc.locationNormalized,
    ];

    for (var lookupIndex = 0; lookupIndex < lookups.length; lookupIndex += 1) {
      var lookup = lookups[lookupIndex];
      for (var fieldIndex = 0; fieldIndex < fields.length; fieldIndex += 1) {
        var position = fields[fieldIndex].indexOf(lookup);
        if (position !== -1) {
          return {
            field: fieldIndex,
            index: position,
            length: lookup.length,
          };
        }
      }
    }

    return {
      field: 0,
      index: -1,
      length: query.length || (terms[0] || "").length,
    };
  }

  function createSnippet(doc, query, terms) {
    var source = doc.text || doc.title || "";
    var normalizedSource = doc.text ? doc.textNormalized : doc.titleNormalized;
    var match = firstMatchIndex(query, terms, doc);

    if (!source) {
      return "";
    }

    if (source.length <= 200) {
      return source;
    }

    if (match.index === -1 || !normalizedSource) {
      return source.slice(0, 200).trim() + "...";
    }

    var start = Math.max(0, match.index - 60);
    var end = Math.min(source.length, match.index + match.length + 120);

    while (start > 0 && source.charAt(start) !== " ") {
      start -= 1;
    }

    while (end < source.length && source.charAt(end) !== " ") {
      end += 1;
    }

    return (
      (start > 0 ? "..." : "") +
      source.slice(start, end).trim() +
      (end < source.length ? "..." : "")
    );
  }

  function cloneTerms(terms, value) {
    var result = {};

    for (var i = 0; i < terms.length; i += 1) {
      result[terms[i]] = value;
    }

    return result;
  }

  function buildDocuments(docs) {
    var processed = [];
    var articles = new Map();

    for (var i = 0; i < docs.length; i += 1) {
      var doc = docs[i];
      var location = doc.location || "";
      var articleLocation = location.split("#")[0];
      var isArticle = location === articleLocation;
      var title = collapseWhitespace(decodeEntities(doc.title || ""));
      var text = stripHtml(doc.text || "");
      var tags = Array.isArray(doc.tags)
        ? doc.tags
            .map(function (tag) {
              return collapseWhitespace(decodeEntities(tag));
            })
            .filter(Boolean)
        : [];
      var tagsText = tags.join(" ");
      var entry = {
        location: location,
        articleLocation: articleLocation,
        isArticle: isArticle,
        title: title,
        text: text,
        tags: tags,
        titleNormalized: normalize(title),
        textNormalized: normalize(text),
        tagsNormalized: normalize(tagsText),
        locationNormalized: normalize(location),
        combinedNormalized: normalize([title, tagsText, text, location].join(" ")),
      };

      processed.push(entry);

      if (isArticle && !articles.has(articleLocation)) {
        articles.set(articleLocation, entry);
      }
    }

    return {
      documents: processed,
      articles: articles,
    };
  }

  function toSearchItem(doc, score, terms, query) {
    return {
      location: doc.location,
      title: doc.title,
      text: createSnippet(doc, query, Object.keys(terms)),
      tags: doc.tags.length ? doc.tags.slice() : undefined,
      score: score,
      terms: terms,
    };
  }

  function createSearchEngine(indexData) {
    var state = buildDocuments(indexData.docs || []);

    return {
      search: function (rawQuery) {
        var query = normalize(rawQuery);
        var terms = buildTerms(rawQuery);

        if (!query || !terms.length) {
          return { items: [] };
        }

        var matches = [];

        for (var i = 0; i < state.documents.length; i += 1) {
          var doc = state.documents[i];
          var matchedTerms = {};
          var hasAllTerms = true;
          var score = 0;

          score += scoreField(query, doc.titleNormalized, 160);
          score += scoreField(query, doc.tagsNormalized, 120);
          score += scoreField(query, doc.textNormalized, 90);
          score += scoreField(query, doc.locationNormalized, 40);

          for (var termIndex = 0; termIndex < terms.length; termIndex += 1) {
            var term = terms[termIndex];
            var termScore = 0;

            termScore += scoreField(term, doc.titleNormalized, 45);
            termScore += scoreField(term, doc.tagsNormalized, 30);
            termScore += scoreField(term, doc.textNormalized, 18);
            termScore += scoreField(term, doc.locationNormalized, 8);

            matchedTerms[term] = termScore > 0;
            if (!matchedTerms[term]) {
              hasAllTerms = false;
              break;
            }

            score += termScore;
          }

          if (!hasAllTerms) {
            continue;
          }

          if (doc.isArticle) {
            score += 4;
          }

          if (doc.titleNormalized.indexOf(query) === 0) {
            score += 20;
          }

          matches.push({
            articleLocation: doc.articleLocation,
            item: toSearchItem(doc, score, matchedTerms, query),
          });
        }

        matches.sort(function (left, right) {
          if (right.item.score !== left.item.score) {
            return right.item.score - left.item.score;
          }

          return left.item.location.localeCompare(right.item.location);
        });

        var groups = new Map();

        for (var matchIndex = 0; matchIndex < matches.length; matchIndex += 1) {
          var match = matches[matchIndex];

          if (!groups.has(match.articleLocation)) {
            groups.set(match.articleLocation, []);
          }

          groups.get(match.articleLocation).push(match.item);
        }

        groups.forEach(function (items, articleLocation) {
          var hasArticle = items.some(function (item) {
            return item.location === articleLocation;
          });

          if (hasArticle) {
            return;
          }

          var article = state.articles.get(articleLocation);
          if (!article) {
            return;
          }

          items.push(
            toSearchItem(
              article,
              0,
              cloneTerms(terms, false),
              query
            )
          );
        });

        var groupedItems = Array.from(groups.values())
          .map(function (items) {
            return items.sort(function (left, right) {
              if (right.score !== left.score) {
                return right.score - left.score;
              }

              return left.location.localeCompare(right.location);
            });
          })
          .sort(function (left, right) {
            return right[0].score - left[0].score;
          });

        return {
          items: groupedItems,
        };
      },
    };
  }

  var engine = null;

  function handleMessage(message) {
    switch (message.type) {
      case SearchMessageType.SETUP:
        engine = createSearchEngine(message.data || {});
        return {
          type: SearchMessageType.READY,
        };

      case SearchMessageType.QUERY:
        return {
          type: SearchMessageType.RESULT,
          data: engine ? engine.search(message.data || "") : { items: [] },
        };

      default:
        throw new TypeError("Invalid message type");
    }
  }

  if (typeof self !== "undefined" && typeof addEventListener === "function") {
    addEventListener("message", function (event) {
      postMessage(handleMessage(event.data));
    });
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      SearchMessageType: SearchMessageType,
      buildDocuments: buildDocuments,
      createSearchEngine: createSearchEngine,
      handleMessage: handleMessage,
      normalize: normalize,
    };
  }
})();
