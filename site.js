// Shared site navigation. To add a page: create the .html file, include site.css and
// site.js in its <head>, and add one entry to PAGES below.
(function () {
  const PAGES = [
    { href: "index.html", title: "Snapshots, PITs & Bridges" },
    { href: "model-types.html", title: "Model types" },
    { href: "loading.html", title: "Hashing & loading" },
    { href: "time.html", title: "Time" },
    { href: "marts.html", title: "Mart delivery" }
  ];
  const here = location.pathname.split("/").pop() || "index.html";
  const nav = document.createElement("nav");
  nav.className = "site-nav";
  nav.setAttribute("aria-label", "Site");
  const brand = document.createElement("div");
  brand.className = "brand";
  brand.innerHTML = "Data Vault Theory<small>Interactive explainers</small>";
  const ul = document.createElement("ul");
  PAGES.forEach(function (p) {
    const li = document.createElement("li"), a = document.createElement("a");
    a.href = p.href;
    a.textContent = p.title;
    if (p.href === here) a.setAttribute("aria-current", "page");
    li.appendChild(a);
    ul.appendChild(li);
  });
  nav.append(brand, ul);
  document.body.prepend(nav);
})();
