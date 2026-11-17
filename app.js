/* Dailies — your own list of daily web games, with streaks and recommendations. */
(function () {
  'use strict';
  var KEY = 'dailies.v1';
  var CATS = window.CATS, BUILTIN = window.GAMES;

  // ── state ─────────────────────────────────────────────
  function blank() { return { saved: [], hidden: [], custom: [], plays: {}, tried: {} }; }
  function load() {
    try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && s.saved) return tidy(Object.assign(blank(), s)); } catch (e) {}
    return blank();
  }
  function uniq(a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }); }
  function tidy(s) { s.saved = uniq(s.saved); s.hidden = uniq(s.hidden); return s; }
  var S = load();
  var memoryOnly = false;
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); memoryOnly = false; }
    catch (e) { memoryOnly = true; }
  }

  function allGames() { return BUILTIN.concat(S.custom); }
  function byId(id) { return allGames().find(function (g) { return g.id === id; }); }

  // ── dates ─────────────────────────────────────────────
  function dkey(d) { d = d || new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function daysAgo(n) { var d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() - n); return dkey(d); }
  function playedOn(id, k) { return (S.plays[id] || []).indexOf(k) !== -1; }
  function doneToday(id) { return playedOn(id, dkey()); }
  function streakOf(fn) {
    var n = 0, i = fn(daysAgo(0)) ? 0 : 1; // today not done yet doesn't break it
    while (fn(daysAgo(i))) { n++; i++; }
    return n;
  }
  function gameStreak(id) { return streakOf(function (k) { return playedOn(id, k); }); }
  function anyStreak() { return streakOf(function (k) { return S.saved.some(function (id) { return playedOn(id, k); }); }); }

  function markPlayed(id, on) {
    var k = dkey(), arr = S.plays[id] || (S.plays[id] = []);
    var i = arr.indexOf(k);
    if (on && i === -1) arr.push(k);
    if (!on && i !== -1) arr.splice(i, 1);
    if (arr.length > 400) arr.splice(0, arr.length - 400);
    save();
  }

  // ── recommendations ───────────────────────────────────
  // Your taste = categories + tags of games you saved and play, minus ones you said "not for me" to.
  function hash(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967295; }
  function taste() {
    var cat = {}, tag = {}, why = {};
    function add(g, w) {
      cat[g.cat] = (cat[g.cat] || 0) + w * 2;
      (g.tags || []).forEach(function (t) { tag[t] = (tag[t] || 0) + w * 1.5; (why[t] = why[t] || []).push(g); });
    }
    S.saved.forEach(function (id) {
      var g = byId(id); if (!g) return;
      var recent = (S.plays[id] || []).filter(function (k) { return k >= daysAgo(30); }).length;
      add(g, 1 + Math.min(recent, 20) * 0.08); // the ones you actually play count more
    });
    S.hidden.forEach(function (id) { var g = byId(id); if (g) { cat[g.cat] = (cat[g.cat] || 0) - 1; (g.tags || []).forEach(function (t) { tag[t] = (tag[t] || 0) - 1.5; }); } });
    return { cat: cat, tag: tag, why: why };
  }
  function scoreOf(g, T) {
    var s = T.cat[g.cat] || 0, ts = 0;
    (g.tags || []).forEach(function (t) { ts += T.tag[t] || 0; });
    s += ts / Math.sqrt(Math.max(1, (g.tags || []).length));
    return s + hash(dkey() + g.id) * 1.2; // a little daily shuffle so it's not frozen
  }
  function reasonFor(g, T) {
    var best = null, n = 0, cnt = {};
    (g.tags || []).forEach(function (t) { (T.why[t] || []).forEach(function (o) { if (o.id !== g.id && S.saved.indexOf(o.id) !== -1) { cnt[o.id] = (cnt[o.id] || 0) + 1; if (cnt[o.id] > n) { n = cnt[o.id]; best = o; } } }); });
    if (best) return 'Because you saved ' + best.name;
    if ((T.cat[g.cat] || 0) > 0) return 'More ' + CATS[g.cat].name.toLowerCase();
    return '';
  }
  function candidates() { return BUILTIN.filter(function (g) { return S.saved.indexOf(g.id) === -1 && S.hidden.indexOf(g.id) === -1; }); }
  function recommend() {
    var C = candidates(), T = taste();
    if (!S.saved.length) {
      // Cold start: one from each kind, different every day.
      return { picks: Object.keys(CATS).map(function (c) {
        var pool = C.filter(function (g) { return g.cat === c; });
        pool.sort(function (a, b) { return hash(dkey() + a.id) - hash(dkey() + b.id); });
        return pool[0] && { g: pool[0], why: 'Try a bit of everything' };
      }).filter(Boolean), wild: null };
    }
    var ranked = C.map(function (g) { return { g: g, s: scoreOf(g, T) }; }).sort(function (a, b) { return b.s - a.s; });
    var perCat = {}; // max 3 of one kind, so it's never a wall of the same thing
    ranked = ranked.filter(function (r) { perCat[r.g.cat] = (perCat[r.g.cat] || 0) + 1; return perCat[r.g.cat] <= 3; });
    var picks = ranked.slice(0, 5).map(function (r) { return { g: r.g, why: reasonFor(r.g, T) }; });
    // Something different: from the kind you engage with least.
    var taken = picks.map(function (p) { return p.g.id; });
    var cats = Object.keys(CATS).sort(function (a, b) { return ((T.cat[a] || 0) - (T.cat[b] || 0)) || (hash(dkey() + a) - hash(dkey() + b)); });
    var wild = null;
    for (var i = 0; i < cats.length && !wild; i++) {
      var pool = C.filter(function (g) { return g.cat === cats[i] && taken.indexOf(g.id) === -1; });
      pool.sort(function (a, b) { return hash(dkey() + 'w' + a.id) - hash(dkey() + 'w' + b.id); });
      if (pool[0]) wild = { g: pool[0], why: 'Something different — you rarely play ' + CATS[cats[i]].name.toLowerCase() };
    }
    return { picks: picks, wild: wild };
  }

  // ── rendering ─────────────────────────────────────────
  var $ = function (s) { return document.querySelector(s); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function safeUrl(u) { return /^https?:\/\//i.test(u) ? u : '#'; }

  function week(id) {
    var h = '';
    for (var i = 6; i >= 0; i--) h += '<i class="' + (playedOn(id, daysAgo(i)) ? 'on' : '') + '"></i>';
    return '<span class="week" aria-label="last 7 days">' + h + '</span>';
  }

  function todayCard(g) {
    var done = doneToday(g.id), st = gameStreak(g.id);
    return '<li class="card today' + (done ? ' done' : '') + '" style="--cat:' + CATS[g.cat].color + '">' +
      '<button class="tick" data-act="tick" data-id="' + g.id + '" aria-pressed="' + done + '" aria-label="' + (done ? 'Mark not played' : 'Mark played') + '">' +
        '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></button>' +
      '<div class="body"><div class="name">' + esc(g.name) + '</div>' +
        '<div class="meta">' + week(g.id) + (st ? '<span class="streak">' + st + '-day streak</span>' : '<span class="muted">' + esc(g.by || CATS[g.cat].name) + '</span>') + '</div></div>' +
      '<a class="play" href="' + esc(safeUrl(g.url)) + '" target="_blank" rel="noopener" data-act="play" data-id="' + g.id + '">' + (done ? 'Again' : 'Play') + '</a>' +
      '<button class="more" data-act="menu" data-id="' + g.id + '" aria-label="Options for ' + esc(g.name) + '">⋯</button>' +
    '</li>';
  }

  function browseCard(g, why, wild) {
    var saved = S.saved.indexOf(g.id) !== -1, tried = !!S.tried[g.id];
    return '<li class="card browse' + (wild ? ' wild' : '') + '" style="--cat:' + CATS[g.cat].color + '">' +
      (why ? '<div class="why">' + esc(why) + '</div>' : '') +
      '<div class="row"><div class="body"><div class="name">' + esc(g.name) + ' <span class="by">' + esc(g.by || '') + '</span></div>' +
      '<div class="desc">' + esc(g.desc || '') + '</div>' +
      '<div class="chips"><span class="chip cat">' + CATS[g.cat].name + '</span>' + (g.min ? '<span class="chip">~' + g.min + ' min</span>' : '') + '</div></div></div>' +
      '<div class="actions">' +
        '<a class="btn ghost" href="' + esc(safeUrl(g.url)) + '" target="_blank" rel="noopener" data-act="try" data-id="' + g.id + '">Try it</a>' +
        (saved ? '<button class="btn saved" data-act="unsave" data-id="' + g.id + '">✓ On my list</button>'
               : '<button class="btn primary" data-act="save" data-id="' + g.id + '">' + (tried ? 'Liked it? Add' : 'Add to my list') + '</button>') +
        (!saved ? '<button class="btn nope" data-act="hide" data-id="' + g.id + '" aria-label="Not for me">Not for me</button>' : '') +
      '</div></li>';
  }

  function renderToday() {
    var list = S.saved.map(byId).filter(Boolean);
    var done = list.filter(function (g) { return doneToday(g.id); }).length;
    var d = new Date();
    $('#date').textContent = d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    var st = anyStreak();
    $('#summary').innerHTML = list.length
      ? '<div class="ring" style="--p:' + (done / list.length) + '"><span>' + done + '<small>/' + list.length + '</small></span></div>' +
        '<div><div class="big">' + (done === list.length ? 'All done for today' : (list.length - done) + ' left today') + '</div>' +
        '<div class="muted">' + (st ? st + '-day playing streak' : 'Play one to start a streak') + '</div></div>'
      : '';
    if (!list.length) {
      $('#todayList').innerHTML = '';
      $('#todayEmpty').hidden = false; return;
    }
    $('#todayEmpty').hidden = true;
    var order = list.slice().sort(function (a, b) { return doneToday(a.id) - doneToday(b.id); });
    $('#todayList').innerHTML = order.map(todayCard).join('');
  }

  function renderForYou() {
    var R = recommend();
    $('#fyIntro').textContent = S.saved.length
      ? 'Picked from what you save and play. Tap "Not for me" on misses — it learns.'
      : 'You haven\'t saved anything yet, so here\'s one of each kind. Try a few and add the ones you like.';
    var h = R.picks.map(function (p) { return browseCard(p.g, p.why); }).join('');
    if (R.wild) h += browseCard(R.wild.g, R.wild.why, true);
    $('#fyList').innerHTML = h || '<li class="empty">You\'ve seen everything in the catalog! Add your own under All games.</li>';
  }

  var filter = 'all';
  function renderAll() {
    var chips = [['all', 'All']].concat(Object.keys(CATS).map(function (c) { return [c, CATS[c].name]; }));
    $('#filters').innerHTML = chips.map(function (c) { return '<button class="fchip' + (filter === c[0] ? ' on' : '') + '" data-filter="' + c[0] + '">' + c[1] + '</button>'; }).join('');
    var list = allGames().filter(function (g) { return (filter === 'all' || g.cat === filter) && S.hidden.indexOf(g.id) === -1; });
    $('#allList').innerHTML = list.map(function (g) { return browseCard(g); }).join('');
    var hid = S.hidden.map(byId).filter(Boolean);
    $('#hiddenBox').hidden = !hid.length;
    $('#hiddenList').innerHTML = hid.map(function (g) { return '<button class="fchip" data-act="unhide" data-id="' + g.id + '">' + esc(g.name) + ' ↺</button>'; }).join('');
    $('#addCat').innerHTML = Object.keys(CATS).map(function (c) { return '<option value="' + c + '">' + CATS[c].name + '</option>'; }).join('');
  }

  function render() { renderToday(); renderForYou(); renderAll(); $('#warn').hidden = !memoryOnly; }

  // ── tabs ──────────────────────────────────────────────
  function show(tab) {
    document.querySelectorAll('.view').forEach(function (v) { v.hidden = v.id !== 'v-' + tab; });
    document.querySelectorAll('.tabs button').forEach(function (b) { b.setAttribute('aria-current', b.dataset.tab === tab ? 'page' : 'false'); });
    try { sessionStorage.setItem('dailies.tab', tab); } catch (e) {}
    window.scrollTo(0, 0);
  }

  // ── menu sheet ────────────────────────────────────────
  function openMenu(id) {
    var g = byId(id), i = S.saved.indexOf(id);
    $('#sheetTitle').textContent = g.name;
    $('#sheetBody').innerHTML =
      '<button data-act="up" data-id="' + id + '"' + (i === 0 ? ' disabled' : '') + '>Move up</button>' +
      '<button data-act="down" data-id="' + id + '"' + (i === S.saved.length - 1 ? ' disabled' : '') + '>Move down</button>' +
      '<button data-act="unsave" data-id="' + id + '">Remove from my list</button>' +
      (g.custom ? '<button class="danger" data-act="delcustom" data-id="' + id + '">Delete this game</button>' : '');
    $('#sheet').showModal();
  }

  var toastT;
  function toast(msg, undo) {
    var t = $('#toast');
    t.innerHTML = esc(msg) + (undo ? ' <button id="undo">Undo</button>' : '');
    t.hidden = false;
    if (undo) $('#undo').onclick = function () { undo(); t.hidden = true; render(); };
    clearTimeout(toastT); toastT = setTimeout(function () { t.hidden = true; }, 4000);
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act],[data-tab],[data-filter]');
    if (!el) return;
    if (el.dataset.tab) { show(el.dataset.tab); return; }
    if (el.dataset.filter) { filter = el.dataset.filter; renderAll(); return; }
    var id = el.dataset.id, act = el.dataset.act;
    switch (act) {
      case 'tick': markPlayed(id, !doneToday(id)); break;
      case 'play': markPlayed(id, true); setTimeout(render, 50); return; // let the link open
      case 'try': S.tried[id] = dkey(); save(); setTimeout(render, 50); return;
      case 'save': if (S.saved.indexOf(id) === -1) S.saved.push(id); save(); toast(byId(id).name + ' added to your list'); break;
      case 'unsave':
        var at = S.saved.indexOf(id); if (at === -1) break;
        S.saved.splice(at, 1); save(); $('#sheet').close();
        toast('Removed ' + byId(id).name, function () { S.saved.splice(at, 0, id); save(); });
        break;
      case 'hide': S.hidden.push(id); save(); toast('Got it — fewer like ' + byId(id).name, function () { S.hidden.splice(S.hidden.indexOf(id), 1); save(); }); break;
      case 'unhide': S.hidden.splice(S.hidden.indexOf(id), 1); save(); break;
      case 'menu': openMenu(id); return;
      case 'up': case 'down':
        var j = S.saved.indexOf(id), k = j + (act === 'up' ? -1 : 1);
        if (k < 0 || k >= S.saved.length) return;
        S.saved[j] = S.saved[k]; S.saved[k] = id; save(); render(); openMenu(id); return;
      case 'delcustom':
        S.custom = S.custom.filter(function (g) { return g.id !== id; });
        S.saved = S.saved.filter(function (x) { return x !== id; }); delete S.plays[id];
        save(); $('#sheet').close(); break;
      case 'closesheet': $('#sheet').close(); return;
      case 'backup': openBackup(); return;
      default: return;
    }
    render();
  });

  // ── add your own ──────────────────────────────────────
  $('#addForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('#addName').value.trim(), url = $('#addUrl').value.trim();
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
    try { new URL(url); } catch (err) { toast('That link doesn\'t look right'); return; }
    if (!name) return;
    var g = { id: 'c' + Date.now().toString(36), name: name, url: url, cat: $('#addCat').value, by: new URL(url).hostname.replace(/^www\./, ''), desc: 'Added by you', tags: [], custom: true };
    S.custom.push(g); S.saved.push(g.id); save();
    e.target.reset(); toast(name + ' added to your list'); render();
  });

  // ── backup ────────────────────────────────────────────
  function openBackup() {
    $('#backupText').value = JSON.stringify(S);
    $('#backup').showModal();
  }
  $('#copyBackup').onclick = function () {
    var t = $('#backupText'); t.select();
    (navigator.clipboard ? navigator.clipboard.writeText(t.value) : Promise.reject()).then(function () { toast('Backup copied'); }, function () { document.execCommand('copy'); toast('Backup copied'); });
  };
  $('#loadBackup').onclick = function () {
    try {
      var s = JSON.parse($('#backupText').value);
      if (!s || !Array.isArray(s.saved)) throw 0;
      S = tidy(Object.assign(blank(), s)); save(); $('#backup').close(); render(); toast('Backup loaded');
    } catch (e) { toast('That isn\'t a Dailies backup'); }
  };

  // Refresh when you come back from a game tab, and at midnight.
  var lastDay = dkey();
  document.addEventListener('visibilitychange', function () { if (!document.hidden) { lastDay = dkey(); render(); } });
  setInterval(function () { if (dkey() !== lastDay) { lastDay = dkey(); render(); } }, 60000);

  var startTab = 'today';
  try { startTab = sessionStorage.getItem('dailies.tab') || (S.saved.length ? 'today' : 'foryou'); } catch (e) {}
  render(); show(startTab);

  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js');
  window.__dailies = { get state() { return S; }, recommend: recommend, render: render };
})();
