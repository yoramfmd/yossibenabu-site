# Yossi Ben Abu: artist review website

A work-in-progress portfolio of contemporary paper art, prepared for review by the artist. Titles, dimensions, image quality, and final selections remain subject to confirmation.

## Website

The canonical authored website is in `site/`. Static HTML, CSS, and JavaScript; no build dependencies. GitHub Actions publishes only `site/` to GitHub Pages when main is updated. Internal links support a GitHub Pages project path.

Run locally with `python3 -m http.server 8767 --directory site`.

## Review scope

Five rows of three artist-selected post entries, in confirmed order, with independent original-image view controls and a real close-up crop for every entry. Complete additional rows can be added through `curation.json`. The hero selects a main image once per visit using deterministic three-hour time buckets. `ASSET-MANIFEST.json` records source URLs, original hashes, crop boxes, missing photographs, ambiguous source dimensions, and the possible Flowers Field duplicate. Background-removal candidates remain outside the website because generated interior fidelity could not be assured. Previous designs retain the original groups. Every page remains noindex for review; nothing has been published from this branch.

Artwork and gallery logos remain the property of their respective owners. This repository is for the authorized artist website project. No production-domain change is included.
