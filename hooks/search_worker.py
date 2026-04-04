from pathlib import Path
import shutil


def on_post_build(config, **kwargs):
    root = Path(__file__).resolve().parent.parent
    worker_source = root / "scripts" / "custom_search_worker.js"
    site_dir = Path(config["site_dir"])
    worker_files = sorted(site_dir.glob("assets/javascripts/workers/search*.js"))

    if not worker_files:
        print("[search-worker] No generated search worker found to replace.")
        return

    for worker_file in worker_files:
        shutil.copyfile(worker_source, worker_file)
        print(f"[search-worker] Replaced {worker_file.relative_to(site_dir)}")
