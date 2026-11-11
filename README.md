# Data Vault Theory

Interactive explainers on Data Vault modelling, published with GitHub Pages.

**Site:** https://kevinstadelmann.github.io/data-vault-theory/

## Pages

- [`index.html`](index.html) — dbt snapshots, PIT tables and bridges
- [`model-types.html`](model-types.html) — Data Vault model types: when to use which
- [`loading.html`](loading.html) — hash keys, hashdiffs and the hub, link and satellite load patterns
- [`time.html`](time.html) — load date, applied date, late-arriving data and computed end dates
- [`marts.html`](marts.html) — building a dimension, a fact and a report from PIT and bridge tables
- [`data-pipeline-performance-tuning.html`](data-pipeline-performance-tuning.html) — data pipeline performance tuning: a click-through guide with a symptom finder, checklist and quiz

`explainer.css` and `explainer.js` hold the styles, sample data and drawing helpers shared by the last three pages.
`site.css` and `site.js` add the shared navigation (sidebar on wide screens, top bar on narrow ones).

## Publishing

The site is plain static HTML with no build step. In the repository go to
**Settings → Pages**, choose **Deploy from a branch**, pick the branch and the
`/ (root)` folder, and save.

To add a page, drop another `.html` file in the repository root, include
`site.css` and `site.js` in its `<head>`, and add it to the `PAGES` list in `site.js`.
