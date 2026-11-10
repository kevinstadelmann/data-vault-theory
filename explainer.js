// Shared data and drawing helpers for the explainer pages (loading, time, marts).
// The data is the same seven days used on the snapshots page.
const DV = (function () {
  const D = d => d ? ('2026-01-0' + d) : '1900-01-01';
  const crm = [{c:'C-1',d:1,v:'Bronze'},{c:'C-1',d:3,v:'Silver'},{c:'C-1',d:7,v:'Gold'},{c:'C-2',d:2,v:'Bronze'}];
  const addr = [{c:'C-1',d:1,v:'Graz'},{c:'C-1',d:5,v:'Wien'},{c:'C-2',d:3,v:'Linz'},{c:'C-2',d:6,v:'Salzburg'}];
  const orders = [{o:'O-100',c:'C-1',p:'P-7',d:2,amt:40},{o:'O-101',c:'C-2',p:'P-7',d:4,amt:25},{o:'O-102',c:'C-1',p:'P-9',d:6,amt:60}];
  const hub = [{c:'C-1',d:1},{c:'C-2',d:2}];
  const DAYS = [1,2,3,4,5,6,7];
  const latest = (a,c,d) => a.filter(r => r.c===c && r.d<=d).sort((x,y) => y.d-x.d)[0] || null;
  const next = (a,r) => { const n = a.filter(x => x.c===r.c && x.d>r.d).sort((x,y) => x.d-y.d)[0]; return n ? n.d : null; };

  // One row per version of a customer (segment + city): the type-2 view of the data.
  const versions = [];
  hub.forEach(h => {
    const ds = [...new Set(crm.concat(addr).filter(r => r.c===h.c).map(r => r.d))].sort((a,b) => a-b);
    ds.forEach((d,i) => { const s = latest(crm,h.c,d), a = latest(addr,h.c,d);
      versions.push({c:h.c, seg:s?s.v:null, city:a?a.v:null, from:d, to:ds[i+1]||null, key:h.c+'@0'+d}); });
  });
  const versionAt = (c,d) => versions.find(v => v.c===c && v.from<=d && (!v.to || v.to>d)) || null;

  /* ---------- charts ---------- */
  const L=150, W=78, R=30, VW=L+7*W+R, TOP=28;
  const x0 = d => L+(d-1)*W, xe = to => to ? x0(to) : VW;
  const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  function frame(h, asof, label, body, bold) {
    let s = `<svg viewBox="0 0 ${VW} ${h}" role="img" aria-label="${label}">`;
    if (asof) s += `<rect class="band" x="${x0(asof)}" y="0" width="${W}" height="${h}"/>`;
    const on = bold || [asof];
    DAYS.forEach(d => { s += `<line class="grid" x1="${x0(d)}" y1="${TOP-6}" x2="${x0(d)}" y2="${h}"/>` +
      `<text class="t-day${on.includes(d)?' on':''}" x="${x0(d)+W/2}" y="16" text-anchor="middle">Jan 0${d}</text>`; });
    s += `<line class="grid" x1="${x0(8)}" y1="${TOP-6}" x2="${x0(8)}" y2="${h}"/>`;
    return s + body + '</svg>';
  }
  const lane = (y,t) => `<text class="t-lane" x="12" y="${y+4}">${esc(t)}</text>`;
  function bar(y, from, to, text, on, extra) {
    const x = x0(from)+2, w = xe(to)-x0(from)-4;
    return `<rect class="bar${on?' on':''}${extra||''}" x="${x}" y="${y-10}" width="${w}" height="20" rx="3"/>` +
           `<text class="t-val" x="${x+6}" y="${y+4}">${esc(text)}</text>`;
  }

  /* ---------- tables ---------- */
  const cell = v => v===null ? '<span class="nul">null</span>' : (v && v.h!==undefined ? v.h : esc(v));
  function tbl(cap, cols, rows, onFn) {
    if (!rows.length) return '<p class="empty">0 rows</p>';
    let s = '<table>' + (cap ? `<caption>${cap}</caption>` : '') + '<thead><tr>' + cols.map(c => `<th>${c}</th>`).join('') + '</tr></thead><tbody>';
    rows.forEach(r => { s += `<tr${onFn && onFn(r.$) ? ' class="on"' : ''}>` + r.v.map(v => `<td>${cell(v)}</td>`).join('') + '</tr>'; });
    return s + '</tbody></table>';
  }

  /* ---------- SQL highlighting: keywords muted, «dates» in the section colour ---------- */
  const KW = /\b(insert into|create view|left join|not exists|group by|order by|partition by|is null|select|distinct|from|where|join|qualify|with|over|desc|and|or|on|as)\b/g;
  function sql(src) {
    return src.split('\n').map(line => {
      const i = line.indexOf('--');
      const code = i<0 ? line : line.slice(0,i), cm = i<0 ? '' : line.slice(i);
      return esc(code).replace(KW,'<span class="k">$1</span>').replace(/«(.*?)»/g,`<span class="d">'$1'</span>`) +
             (cm ? `<span class="cm">${esc(cm)}</span>` : '');
    }).join('\n');
  }

  /* ---------- SHA-256, so the hash keys shown on the pages are real ---------- */
  const K = [], H0 = [];
  (function () {
    const fr = x => ((x - Math.floor(x)) * 4294967296) | 0;
    for (let n = 2, c = 0; c < 64; n++) {
      let p = true;
      for (let i = 2; i*i <= n; i++) if (n % i === 0) { p = false; break; }
      if (p) { if (c < 8) H0.push(fr(Math.sqrt(n))); K.push(fr(Math.cbrt(n))); c++; }
    }
  })();
  function sha256(str) {
    const b = new TextEncoder().encode(str), l = b.length, n = ((l+8)>>6)+1, w = new Uint32Array(n*16);
    for (let i = 0; i < l; i++) w[i>>2] |= b[i] << (24-(i%4)*8);
    w[l>>2] |= 0x80 << (24-(l%4)*8); w[n*16-1] = l*8;
    const r = (x,k) => (x>>>k) | (x<<(32-k));
    let h = H0.slice();
    for (let j = 0; j < n; j++) {
      const m = new Int32Array(64);
      for (let i = 0; i < 16; i++) m[i] = w[j*16+i];
      for (let i = 16; i < 64; i++) { const a = m[i-15], e = m[i-2];
        m[i] = (m[i-16] + (r(a,7)^r(a,18)^(a>>>3)) + m[i-7] + (r(e,17)^r(e,19)^(e>>>10))) | 0; }
      let [a,b2,c,d,e,f,g,hh] = h;
      for (let i = 0; i < 64; i++) {
        const t1 = (hh + (r(e,6)^r(e,11)^r(e,25)) + ((e&f)^(~e&g)) + K[i] + m[i]) | 0;
        const t2 = ((r(a,2)^r(a,13)^r(a,22)) + ((a&b2)^(a&c)^(b2&c))) | 0;
        hh = g; g = f; f = e; e = (d+t1)|0; d = c; c = b2; b2 = a; a = (t1+t2)|0;
      }
      h = [a,b2,c,d,e,f,g,hh].map((v,i) => (v+h[i])|0);
    }
    return h.map(v => (v>>>0).toString(16).padStart(8,'0')).join('');
  }

  const $ = id => document.getElementById(id);
  return {D, crm, addr, orders, hub, DAYS, latest, next, versions, versionAt,
          L, W, VW, TOP, x0, xe, esc, frame, lane, bar, tbl, sql, sha256, $};
})();
