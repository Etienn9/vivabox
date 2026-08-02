// Downloads experience images (Pexels/Unsplash) referenced in the Google Sheet
// into public/images/experiences/ at build time, so the deployed site never
// depends on those third-party hosts being fast/available at request time.
//
// Filename hashing here must stay in sync with resolveExperienceImage()
// in src/services/experiences.ts.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import Papa from "papaparse";

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4Jf6eOcGsbnRYIPVP60JVWDp1KkqZMGdcj3t8ABR9hdaFY9t3bLcvqgVjTVWVtz9GFUDtWADB_iLx/pub?output=csv";

const OUTPUT_DIR = path.join(process.cwd(), "public", "images", "experiences");

function isCacheableImage(url) {
  return typeof url === "string" && (
    url.includes("images.pexels.com") || url.includes("images.unsplash.com")
  );
}

function localFileNameFor(url) {
  const hash = crypto.createHash("sha1").update(url).digest("hex").slice(0, 16);
  const ext = path.extname(new URL(url).pathname) || ".jpg";
  return `${hash}${ext}`;
}

async function main() {
  console.log("[cache-experience-images] fetching sheet...");

  const res = await fetch(SHEET_URL);
  if (!res.ok) throw new Error(`sheet fetch failed: HTTP ${res.status}`);
  const csv = await res.text();

  const { data: rows } = Papa.parse(csv, { header: true, skipEmptyLines: true });
  const urls = [...new Set(rows.map((r) => r.image).filter(isCacheableImage))];

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const url of urls) {
    const filePath = path.join(OUTPUT_DIR, localFileNameFor(url));

    if (fs.existsSync(filePath)) {
      skipped++;
      continue;
    }

    try {
      const imgRes = await fetch(url);
      if (!imgRes.ok) throw new Error(`HTTP ${imgRes.status}`);
      const buffer = Buffer.from(await imgRes.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
      downloaded++;
    } catch (err) {
      failed++;
      console.warn(`[cache-experience-images] failed to cache ${url}:`, err.message);
    }
  }

  console.log(
    `[cache-experience-images] done — downloaded: ${downloaded}, already cached: ${skipped}, failed: ${failed}`
  );
}

main().catch((err) => {
  // Never block the build over a flaky Sheet/image host — the app falls
  // back to hotlinking for anything that isn't cached locally.
  console.warn("[cache-experience-images] skipped (non-fatal):", err.message);
});
