# Data Vault Theory

Interactive explainers on Data Vault modelling, published with GitHub Pages.

**Site:** https://kevinstadelmann.github.io/data-vault-theory/

## Pages

- [`index.html`](index.html) — dbt snapshots, PIT tables and bridges
- [`model-types.html`](model-types.html) — Data Vault model types: when to use which
- [`sakila-model.html`](sakila-model.html) — the film rental (Sakila) schema as a Data Vault 2.1 model

`site.css` and `site.js` add the shared navigation (sidebar on wide screens, top bar on narrow ones).

## Publishing

The site is plain static HTML with no build step. In the repository go to
**Settings → Pages**, choose **Deploy from a branch**, pick the branch and the
`/ (root)` folder, and save.

To add a page, drop another `.html` file in the repository root, include
`site.css` and `site.js` in its `<head>`, and add it to the `PAGES` list in `site.js`.
