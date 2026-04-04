const fs = require("fs");
const path = require("path");

function loadEngine(workerPath, indexPath) {
  delete require.cache[require.resolve(workerPath)];
  const worker = require(workerPath);
  const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  return worker.createSearchEngine(index);
}

function findTopLocation(result) {
  if (!result.items.length || !result.items[0].length) {
    return "";
  }

  return result.items[0][0].location;
}

function verify(engine, cases) {
  const failures = [];

  for (const testCase of cases) {
    const result = engine.search(testCase.query);
    const topLocations = result.items
      .flat()
      .slice(0, 5)
      .map((item) => item.location);

    const passed = result.items.length > 0 && topLocations.some((location) => {
      return location.indexOf(testCase.expectIncludes) !== -1;
    });

    if (!passed) {
      failures.push({
        query: testCase.query,
        expectIncludes: testCase.expectIncludes,
        topLocations,
      });
    }
  }

  return failures;
}

function runSuite(label, workerPath, indexPath, cases) {
  const engine = loadEngine(workerPath, indexPath);
  const failures = verify(engine, cases);

  console.log(`\\n[${label}] worker: ${workerPath}`);
  for (const testCase of cases) {
    const result = engine.search(testCase.query);
    console.log(
      `- ${testCase.query} -> ${findTopLocation(result) || "(no result)"}`
    );
  }

  if (failures.length) {
    console.error(`\\n[${label}] failures:`);
    for (const failure of failures) {
      console.error(
        `  query="${failure.query}" expected~="${failure.expectIncludes}" actual=${failure.topLocations.join(", ")}`
      );
    }
    process.exitCode = 1;
    return;
  }

  console.log(`\\n[${label}] ${cases.length} queries passed.`);
}

const root = __dirname ? path.resolve(__dirname, "..") : process.cwd();
const cases = [
  { query: "作者", expectIncludes: "about/author/" },
  { query: "关于作者", expectIncludes: "about/author/" },
  { query: "Bridge", expectIncludes: "about/author/" },
  { query: "Z", expectIncludes: "about/author/" },
  { query: "王芳佳", expectIncludes: "about/acknowledgements/" },
  { query: "建站说明", expectIncludes: "about/site-building/" },
  { query: "协作说明", expectIncludes: "about/collaboration/" },
  { query: "命名标准", expectIncludes: "modeling/naming-standards/" },
  { query: "STEP", expectIncludes: "modeling/naming-standards/" },
  { query: "quality control", expectIncludes: "measurement/quality-control/" },
];

runSuite(
  "repo-site",
  path.join(root, "site/assets/javascripts/workers/search.2c215733.min.js"),
  path.join(root, "site/search/search_index.json"),
  cases
);

const builtSiteDir = process.env.BUILT_SITE_DIR;
if (builtSiteDir) {
  const workersDir = path.join(
    builtSiteDir,
    "assets/javascripts/workers"
  );
  const workerFile = fs
    .readdirSync(workersDir)
    .find((name) => /^search.*\.js$/.test(name));

  if (!workerFile) {
    console.error(`[built-site] no worker found in ${workersDir}`);
    process.exitCode = 1;
  } else {
    runSuite(
      "built-site",
      path.join(workersDir, workerFile),
      path.join(builtSiteDir, "search/search_index.json"),
      cases
    );
  }
}
