'use strict';
const $ = id => document.getElementById(id);
const make = (tag, text, className) => {
  const el = document.createElement(tag);
  if (text !== undefined) el.textContent = text;
  if (className) el.className = className;
  return el;
};
const exact = value => value.normalize('NFC').trim();
const key = value => value.normalize('NFKC').toLowerCase().replace(/[\s·・‧．]/gu, '');
const byName = new Intl.Collator('zh-Hant').compare;
const split = text => text.split(/[\n、，,；;]+/u).map(exact).filter(Boolean);
const size = 35;
let friends = [], flowers = new Map(), nameLookup = new Map(), imageURLs = [], view = 'catalog', page = 1, target = '', saving = false;
let ocrLibrary, ready = false;
const connection = $('connection');
const friendSelect = $('friend');
const filter = $('filter');
const search = $('search');
const rows = $('review-rows');

function flowerAlias(name) {
  return key(name) === '粉木槿花' ? '粉紅木槿花' : name;
}
function canonical(name) {
  name = flowerAlias(name);
  return nameLookup.get(key(name)) || exact(name);
}
function selectOptions(select, options) {
  const current = select.value;
  select.replaceChildren(select.options[0], ...options.map(name => new Option(name, name)));
  if (options.includes(current)) select.value = current;
}
function merge(friend, names) {
  if (!friends.includes(friend)) friends.push(friend);
  for (const name of names) {
    if (!name) continue;
    if (!flowers.has(name)) flowers.set(name, {grade:'', owners:new Set()});
    flowers.get(name).owners.add(friend);
  }
}
function refresh() {
  nameLookup = new Map([...flowers.keys()].map(name => [key(name), name]));
  $('friend-count').textContent = friends.length;
  $('flower-count').textContent = flowers.size;
  $('record-count').textContent = [...flowers.values()].reduce((sum,f) => sum + f.owners.size, 0).toLocaleString('zh-TW');
  selectOptions(friendSelect, friends);
  selectOptions(filter, friends);
  $('new-field').hidden = Boolean(friendSelect.value);
  render();
}
function show(next) {
  view = next;
  if (!ready) return;
  for (const tab of document.querySelectorAll('[data-view]')) {
    if (tab.dataset.view === view) tab.setAttribute('aria-current','page');
    else tab.removeAttribute('aria-current');
  }
  $('catalog').hidden = view !== 'catalog';
  $('editor').hidden = view !== 'editor';
}
function render() {
  const selected = filter.value;
  const term = key(search.value);
  const matrix = $('layout').value === 'matrix';
  const people = selected ? [selected] : friends;
  const matches = [...flowers].filter(([name,f]) => key(name).includes(term) && (!selected || f.owners.has(selected)));
  if (term) matches.sort(([a],[b]) => Number(key(b) === term)-Number(key(a) === term) || byName(a,b));
  const last = Math.max(1, Math.ceil(matches.length / size));
  page = Math.min(page,last);
  $('prev').disabled = page <= 1;
  $('next').disabled = page >= last;
  $('page-number').textContent = page + ' / ' + last;
  $('summary').textContent = (selected ? selected + ' · ' : '') + matches.length + ' 個花種';
  const table = $('inventory');
  table.className = matrix ? 'matrix' : '';
  const head = make('thead'), header = make('tr'), body = make('tbody');
  const columns = ['花名','品項',...(matrix ? people : ['持有人數','擁有的好友'])];
  for (const title of columns) {
    const col = make('th',title);
    col.scope = 'col';
    header.append(col);
  }
  head.append(header);
  if (!matches.length) {
    const tr = make('tr'), td = make('td','沒有符合的花種。');
    td.colSpan = columns.length;
    tr.append(td);
    body.append(tr);
  }
  for (const [name,f] of matches.slice((page-1)*size,page*size)) {
    const tr = make('tr'), label = make('th',name);
    label.scope = 'row';
    tr.append(label, make('td',f.grade || '—'));
    if (matrix) {
      for (const person of people) tr.append(make('td', f.owners.has(person) ? '✓' : '—', 'check'));
    } else {
      const ownership = make('td');
      for (const person of friends.filter(p => f.owners.has(p))) {
        const button = make('button',person,'owner');
        button.type = 'button';
        button.onclick = () => { filter.value = person; search.value = ''; updateFilter(); };
        ownership.append(button);
      }
      if (!f.owners.size) ownership.textContent = '—';
      tr.append(make('td',f.owners.size),ownership);
    }
    body.append(tr);
  }
  table.replaceChildren(head,body);
}
function updateFilter() {
  page = 1;
  render();
  document.querySelector('.table-frame').scrollTop = 0;
}
function renderImages(id) {
  $(id).replaceChildren(...imageURLs.map((src,i) => {
    const image = make('img');
    image.src = src;
    image.alt = '遊戲截圖 ' + (i+1);
    return image;
  }));
}
function classify() {
  const seen = new Set();
  for (const row of rows.children) {
    const name = canonical(row.querySelector('input').value);
    const known = flowers.get(name);
    const status = row.querySelector('.badge');
    const [label, kind] = !name ? ['待輸入','skip'] : seen.has(name) ? ['重複列','skip'] :
      known?.owners.has(target) ? ['好友已擁有','skip'] : known ? ['加入好友清單','add'] : ['全新花種','new'];
    status.textContent = label;
    status.dataset.kind = kind;
    if (name) seen.add(name);
  }
}
function addRow(name = '') {
  const row = make('div',undefined,'review-row');
  const input = make('input');
  input.value = name;
  input.maxLength = 80;
  input.placeholder = '輸入或修改花名';
  input.setAttribute('aria-label','花名');
  input.setAttribute('list','known-flowers');
  input.oninput = classify;
  const status = make('span',undefined,'badge');
  const remove = make('button','移除');
  remove.type = 'button';
  remove.onclick = () => {row.remove(); classify();};
  row.append(input,status,remove);
  rows.append(row);
  return input;
}
function loadOCR() {
  if (window.Tesseract) return Promise.resolve(window.Tesseract);
  if (!ocrLibrary) ocrLibrary = new Promise((resolve,reject) => {
    const script = make('script');
    const timeout = setTimeout(() => script.onerror(),25000);
    script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';
    script.onload = () => { clearTimeout(timeout); resolve(window.Tesseract); };
    script.onerror = () => { clearTimeout(timeout); script.remove(); reject(new Error('OCR 載入失敗')); };
    document.head.append(script);
  }).catch(error => {ocrLibrary = null; throw error;});
  return ocrLibrary;
}
function candidates(text) {
  const known = [...nameLookup].filter(([name]) => name.length >= 2).sort((a,b) => b[0].length-a[0].length);
  return split(text).flatMap(line => {
    let remaining = key(line);
    const matches = [];
    for (const [name, original] of known) {
      if (remaining.includes(name)) {
        matches.push(original);
        remaining = remaining.replaceAll(name,'|');
      }
    }
    for (const piece of remaining.split('|')) {
      const cleaned = piece.replace(/[^\p{Script=Han}]/gu,'');
      if (cleaned.length >= 2 && cleaned.length <= 24) matches.push(matches.length === 0 ? line.trim().slice(0,80) : cleaned);
    }
    return matches;
  });
}
async function recognize(files) {
  const api = await loadOCR();
  let worker;
  let cancelled = false;
  const results = [];
  let failed = 0;
  let timeout;
  try {
    await Promise.race([(async () => {
      worker = await api.createWorker('chi_tra+eng', 1, {
        workerPath:'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/worker.min.js',
      });
      if (cancelled) await worker.terminate();
    })(), new Promise((_,reject) => {timeout = setTimeout(() => { cancelled = true; reject(new Error('OCR 逾時')); },90000);})]);
    await worker.setParameters({tessedit_pageseg_mode:'11'});
    for (const [i,file] of files.entries()) {
      $('progress').textContent = '正在辨識第 ' + (i+1) + ' / ' + files.length + ' 張截圖…';
      try {
        const {data} = await worker.recognize(file);
        results.push(data.text);
      } catch {failed++;}
    }
    return {text:results.join('\n'), failed};
  } finally {
    clearTimeout(timeout);
    if (!cancelled && worker) await worker.terminate();
  }
}
document.querySelectorAll('[data-view]').forEach(btn => btn.onclick = () => show(btn.dataset.view));
search.oninput = filter.onchange = $('layout').onchange = updateFilter;
$('prev').onclick = () => {page--; render(); document.querySelector('.table-frame').scrollTop = 0;};
$('next').onclick = () => {page++; render(); document.querySelector('.table-frame').scrollTop = 0;};
friendSelect.onchange = () => {$('new-field').hidden = Boolean(friendSelect.value);};
$('screenshots').onchange = () => {
  imageURLs.forEach(URL.revokeObjectURL);
  imageURLs = Array.from($('screenshots').files, file => URL.createObjectURL(file));
  renderImages('previews');
};
$('entry').onsubmit = async event => {
  event.preventDefault();
  target = exact(friendSelect.value || $('new-friend').value);
  if (!target) { $('progress').textContent = '請選擇好友或輸入新好友名稱。'; return; }
  const button = $('review-button');
  button.disabled = true;
  let raw = '', message = '';
  const files = Array.from($('screenshots').files);
  const manual = split($('manual').value);
  if (files.length) {
    $('progress').textContent = '正在載入截圖文字辨識…';
    try {
      const result = await recognize(files);
      raw = result.text;
      if (result.failed) message = result.failed + ' 張截圖辨識失敗，請參照原圖補上。';
      else if (!candidates(raw).length) message = '沒有辨識到可用的花名，請參照原圖手動輸入。';
    } catch { message = '這次無法辨識截圖，請參照原圖手動輸入，或返回重試。'; }
  }
  const names = [...new Set([...manual,...candidates(raw)].map(canonical))];
  rows.replaceChildren();
  names.forEach(addRow);
  if (!names.length) addRow();
  const hints = make('datalist');
  hints.id = 'known-flowers';
  hints.append(...[...flowers.keys()].map(name => new Option(name)));
  $('known-flowers')?.remove();
  $('review').append(hints);
  $('target').textContent = '更新好友「' + target + '」。請對照截圖，修改或移除辨識有誤的花名。';
  $('ocr-raw').textContent = raw;
  $('ocr-details').hidden = !raw.trim();
  $('review-message').textContent = message;
  renderImages('review-images');
  classify();
  $('entry').hidden = true;
  $('review').hidden = false;
  $('review').scrollIntoView({block:'start'});
  $('progress').textContent = '';
  button.disabled = false;
};
$('add-row').onclick = () => {const input = addRow(); classify(); input.focus();};
$('back').onclick = () => { $('review').hidden = true; $('entry').hidden = false; };
$('save').onclick = async () => {
  if (saving) return;
  const names = [...new Set([...rows.querySelectorAll('input')].map(input => canonical(input.value)).filter(Boolean))];
  const additions = names.filter(name => !flowers.get(name)?.owners.has(target));
  if (!additions.length && friends.includes(target)) {
    $('review-message').textContent = '這位好友的清單沒有新的花種。';
    return;
  }
  saving = true;
  $('save').disabled = $('back').disabled = true;
  $('review-message').textContent = '正在儲存…';
  try {
    saveRecords([{friend:target,flower:''}, ...additions.map(flower => ({friend:target,flower}))]);
    merge(target,additions);
    $('entry').reset();
    imageURLs.forEach(URL.revokeObjectURL);
    imageURLs = [];
    renderImages('previews');
    renderImages('review-images');
    $('review').hidden = true;
    $('entry').hidden = false;
    refresh();
    friendSelect.value = target;
    friendSelect.onchange();
    filter.value = target;
    search.value = '';
    updateFilter();
    show('catalog');
    connection.textContent = '已儲存「' + target + '」的花冊，新增 ' + additions.length + ' 個持有紀錄。';
  } catch (error) {
    $('review-message').textContent = error.message || '儲存失敗，請重試。';
  } finally {
    saving = false;
    $('save').disabled = $('back').disabled = false;
  }
};
const storageKey = 'flower-inventory:v1:' + location.pathname.replace(/index\.html$/, '');
function readRecords() {
  return JSON.parse(localStorage.getItem(storageKey) || '[]');
}
function saveRecords(records) {
  const combined = new Map();
  for (const row of [...readRecords(), ...records]) {
    combined.set(JSON.stringify([row.friend,row.flower]), row);
  }
  localStorage.setItem(storageKey, JSON.stringify([...combined.values()]));
}
function load(message = '') {
  friends = [...seed.friends];
  flowers = new Map(Object.entries(seed.flowers).map(([name,f]) => [name,{grade:f.grade,owners:new Set(f.owners)}]));
  try {
    for (const {friend,flower} of readRecords()) merge(friend,[flowerAlias(flower)]);
    connection.textContent = message || (friends.length ? '' : '第一次使用時，可以匯入好友備份或新增好友。');
  } catch {
    connection.textContent = '目前無法讀取瀏覽器的花冊資料。';
  }
  ready = true;
  refresh();
  show(view);
}
$('export-backup').onclick = () => {
  try {
    const file = new Blob([JSON.stringify({version:1,records:readRecords()})],{type:'application/json'});
    const url = URL.createObjectURL(file);
    const link = make('a');
    link.href = url;
    link.download = 'flower-inventory-backup.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch { connection.textContent = '無法匯出好友備份。'; }
};
$('import-backup').onclick = () => $('backup-file').click();
$('backup-file').onchange = async () => {
  const file = $('backup-file').files[0];
  $('backup-file').value = '';
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (data?.version !== 1 || !Array.isArray(data.records) ||
        data.records.some(r => !r || typeof r.friend !== 'string' || !r.friend.trim() ||
          r.friend.length > 80 || typeof r.flower !== 'string' || r.flower.length > 80)) {
      throw new Error('備份格式有誤。');
    }
    saveRecords(data.records.map(({friend,flower}) => ({friend:exact(friend),flower:canonical(flower)})));
    load('已合併好友備份與目前的持有紀錄。');
    if (!$('review').hidden) classify();
  } catch (error) {
    connection.textContent = '匯入失敗。' + (error.message || '');
  }
};
window.addEventListener('storage', event => {
  if (event.key !== storageKey) return;
  load();
  if (!$('review').hidden) classify();
});
load();
function candidates(text) {
  return split(text).flatMap(line => {
    const match = nameLookup.get(key(line));
    return match ? [match] : [];
  });
}
async function recognize(files) {
  const api = await loadOCR();
  const worker = await api.createWorker('chi_tra+eng', 1, {
    workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/worker.min.js',
  });

  const results = [];
  let failed = 0;

  try {
    await worker.setParameters({ tessedit_pageseg_mode: '7' });

    for (const [index, file] of files.entries()) {
      $('progress').textContent =
        '正在辨識第 ' + (index + 1) + ' / ' + files.length + ' 張截圖…';

      const url = URL.createObjectURL(file);

      try {
        const photo = new Image();
        photo.src = url;
        await photo.decode();

        const scaleX = photo.naturalWidth / 706;
        const scaleY = photo.naturalHeight / 1536;

        const canvas = document.createElement('canvas');
        canvas.width = 720;
        canvas.height = 120;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        for (const y of [750, 1020, 1290]) {
          for (const x of [47, 265, 484]) {
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, 720, 120);

            ctx.drawImage(
              photo,
              x * scaleX, y * scaleY, 174 * scaleX, 29 * scaleY,
              12, 2, 696, 116
            );

            const pixels = ctx.getImageData(0, 0, 720, 120);
            const data = pixels.data;
            const brightness = i =>
              0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];

            const samples = [20, 32, 687, 699].map(column =>
              brightness((60 * 720 + column) * 4)
            );
            const background = samples.reduce((sum, n) => sum + n, 0) / samples.length;

            // 灰暗的卡片通常是尚未解鎖的花。
            if (background < 145) continue;

            const cutoff = background + (255 - background) * 0.45;
            for (let i = 0; i < data.length; i += 4) {
              const value = brightness(i) > cutoff ? 0 : 255;
              data[i] = data[i + 1] = data[i + 2] = value;
            }
            ctx.putImageData(pixels, 0, 0);

            const { data: recognized } = await worker.recognize(canvas);
            if (recognized.text.trim()) results.push(recognized.text.trim());
          }
        }
      } catch {
        failed++;
      } finally {
        URL.revokeObjectURL(url);
      }
    }
  } finally {
    await worker.terminate();
  }

  return { text: results.join('\n'), failed };
}
