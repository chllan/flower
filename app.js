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
const renameInput = $('rename-friend');
const managementStatus = $('friend-management-status');
let managedFriend = '';

function flowerAlias(name, renames = sharedData.flowerRenames) {
  const seen = new Set();
  name = exact(name);
  if (key(name) === '粉木槿花' && !renames.has(name)) name = '粉紅木槿花';
  while (renames.has(name) && !seen.has(name)) {
    seen.add(name);
    name = renames.get(name);
  }
  return name;
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
const friendFilterSearch = $('friend-filter-search');

function refreshFriendFilter() {
  const query = key(friendFilterSearch.value);
  const current = filter.value;
  const matches = friends.filter(name => key(name).includes(query));
  selectOptions(filter, friends.filter(name => name === current || matches.includes(name)));
  $('friend-filter-status').textContent = query && !matches.length ? '找不到符合的好友' : '';
  return matches;
}

function chooseFriendFilter(name) {
  friendFilterSearch.value = '';
  refreshFriendFilter();
  filter.value = name;
}

function initializeGradeButtons(id) {
  const select = $(id);
  const group = select.parentElement.querySelector('.grade-options');
  for (const option of select.options) {
    const button = make('button', option.textContent === '普通' ? '普品' : option.textContent);
    button.type = 'button';
    button.dataset.grade = option.value;
    button.onclick = () => {
      select.value = option.value;
      select.dispatchEvent(new Event('change'));
    };
    group.append(button);
  }
  const updateSelection = () => {
    for (const button of group.children) {
      button.setAttribute('aria-pressed', String(button.dataset.grade === select.value));
    }
  };
  select.addEventListener('change', updateSelection);
  updateSelection();
  select.hidden = true;
  group.hidden = false;
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
  for (const name of sharedData.flowerRenames.keys()) {
    if (!nameLookup.has(key(name))) nameLookup.set(key(name), flowerAlias(name));
  }
  $('rename-flower-options').replaceChildren(...[...flowers.keys()].map(name => new Option(name)));
  $('friend-count').textContent = friends.length;
  $('flower-count').textContent = flowers.size;
  $('record-count').textContent = [...flowers.values()].reduce((sum,f) => sum + f.owners.size, 0).toLocaleString('zh-TW');
  selectOptions(friendSelect, friends);
  refreshFriendFilter();
  updateFriendManagement();
  render();
}
function show(next) {
  view = next === 'editor' && !adminToken ? 'catalog' : next;
  if (!ready) return;
  for (const tab of document.querySelectorAll('[data-view]')) {
    if (tab.dataset.view === view) tab.setAttribute('aria-current','page');
    else tab.removeAttribute('aria-current');
  }
  $('catalog').hidden = view !== 'catalog';
  $('editor').hidden = view !== 'editor';
  $('gallery').hidden = view !== 'gallery';
  document.dispatchEvent(new Event('flower-catalog-updated'));
}
function flowerMatches(name, term) {
  return key(name).includes(term) || [...sharedData.flowerRenames.keys()]
    .some(old => flowerAlias(old) === name && key(old).includes(term));
}
let catalogPage = [];
function render() {
  const selected = filter.value;
  const term = key(search.value);
  const mode = $('layout').value;
  const matrix = mode === 'matrix';
  const grade = $('catalog-grade').value;
  const owned = mode === 'cards' && $('catalog-owned').checked;
  const people = selected ? [selected] : friends;
  const matches = [...flowers].filter(([name,f]) => flowerMatches(name, term) &&
      (!selected || f.owners.has(selected)) && (!owned || f.owners.size) &&
      (!grade || (f.grade || 'ungraded') === grade));
  if (term) matches.sort(([a],[b]) => Number(key(b) === term)-Number(key(a) === term) || byName(a,b));
  const last = Math.max(1, Math.ceil(matches.length / size));
  page = Math.min(page,last);
  $('prev').disabled = page <= 1;
  $('next').disabled = page >= last;
  $('page-number').textContent = page + ' / ' + last;
  $('summary').textContent = (selected ? selected + ' · ' : '') + matches.length + ' 個花種';
  const table = $('inventory');
  catalogPage = matches.slice((page-1)*size,page*size);
  table.closest('.table-frame').hidden = mode === 'cards';
  $('catalog-cards').hidden = mode !== 'cards';
  $('catalog-owned').closest('label').hidden = mode !== 'cards';
  document.dispatchEvent(new Event('flower-collection-updated'));
  if (mode === 'cards') return;
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
  for (const [name,f] of catalogPage) {
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
        button.onclick = () => { chooseFriendFilter(person); search.value = ''; updateFilter(); };
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
  return split(text).flatMap(line => {
    const match = nameLookup.get(key(line));
    return match ? [match] : [];
  });
}
async function screenshotLabels(file) {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const ratio = image.naturalWidth / image.naturalHeight;
    if (ratio < 0.44 || ratio > 0.48) return null;
    // Find the lower edge of the brown sort selector to align both layouts.
    const guide = document.createElement('canvas');
    guide.width = 1;
    guide.height = 120;
    const guideCtx = guide.getContext('2d');
    guideCtx.drawImage(image, 622/706*image.naturalWidth, 420/1536*image.naturalHeight,
      6/706*image.naturalWidth, 120/1536*image.naturalHeight, 0, 0, 1, 120);
    const guidePixels = guideCtx.getImageData(0,0,1,120).data;
    let run = 0;
    let bestRun = 0;
    let selectorBottom = 516;
    for (let row = 0; row < 120; row++) {
      const offset = row * 4;
      const red = guidePixels[offset], green = guidePixels[offset+1], blue = guidePixels[offset+2];
      const brown = red >= 126 && red <= 182 && red-green >= 6 && red-green <= 38 &&
        green-blue >= 4 && green-blue <= 36;
      run = brown ? run+1 : 0;
      if (run > bestRun) {
        bestRun = run;
        selectorBottom = 420 + row;
      }
    }
    const shift = bestRun >= 18 ? selectorBottom - 516 : 0;
    const labels = [];
    const sample = document.createElement('canvas');
    sample.width = 176;
    sample.height = 19;
    const ctx = sample.getContext('2d', {willReadFrequently:true});
    for (const baseY of [755,1025,1295]) {
      const y = baseY + shift;
      for (const x of [48,266,485]) {
        ctx.drawImage(image, x/706*image.naturalWidth, y/1536*image.naturalHeight,
          176/706*image.naturalWidth, 19/1536*image.naturalHeight, 0, 0, 176, 19);
        const pixels = ctx.getImageData(0,0,176,19).data;
        const luminance = offset => .2126*pixels[offset]+.7152*pixels[offset+1]+.0722*pixels[offset+2];
        const sides = [3, 9, 165, 171].map(column => luminance((9*176+column)*4));
        if (sides.reduce((sum,n) => sum+n,0)/sides.length < 145) continue;
        const label = document.createElement('canvas');
        label.width = 742;
        label.height = 116;
        const output = label.getContext('2d');
        output.fillStyle = '#fff';
        output.fillRect(0,0,label.width,label.height);
        output.drawImage(image, x/706*image.naturalWidth, (y-3)/1536*image.naturalHeight,
          176/706*image.naturalWidth, 25/1536*image.naturalHeight, 19, 8, 704, 100);
        const crop = output.getImageData(19,8,704,100);
        const rgb = crop.data;
        const base = sides.reduce((sum,n) => sum+n,0)/sides.length;
        const cutoff = base + (255-base)*0.32;
        for (let offset = 0; offset < rgb.length; offset += 4) {
          const luminance = .2126*rgb[offset]+.7152*rgb[offset+1]+.0722*rgb[offset+2];
          const value = luminance > cutoff ? 0 : 255;
          rgb[offset] = rgb[offset+1] = rgb[offset+2] = value;
        }
        output.putImageData(crop,19,8);
        labels.push(label);
      }
    }
    return labels;
  } finally {
    URL.revokeObjectURL(url);
  }
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
    for (const [i,file] of files.entries()) {
      $('progress').textContent = '正在辨識第 ' + (i+1) + ' / ' + files.length + ' 張截圖…';
      try {
        const labels = await screenshotLabels(file);
        await worker.setParameters({tessedit_pageseg_mode:labels ? '7' : '11'});
        for (const input of labels || [file]) {
          const {data} = await worker.recognize(input);
          results.push(data.text);
        }
      } catch {failed++;}
    }
    return {text:results.join('\n'), failed};
  } finally {
    clearTimeout(timeout);
    if (!cancelled && worker) await worker.terminate();
  }
}
document.querySelectorAll('[data-view]').forEach(btn => btn.onclick = () => show(btn.dataset.view));
search.oninput = filter.onchange = $('layout').onchange = $('catalog-grade').onchange = $('catalog-owned').onchange = updateFilter;
friendFilterSearch.oninput = refreshFriendFilter;
friendFilterSearch.onkeydown = event => {
  if (event.key !== 'Enter' || event.isComposing) return;
  const query = key(friendFilterSearch.value);
  if (!query) return;
  const matches = refreshFriendFilter();
  const match = matches.find(name => key(name) === query) || (matches.length === 1 ? matches[0] : '');
  if (!match) return;
  filter.value = match;
  updateFilter();
};
initializeGradeButtons('catalog-grade');
initializeGradeButtons('gallery-grade');
$('prev').onclick = () => {page--; render(); document.querySelector('.table-frame').scrollTop = 0;};
$('next').onclick = () => {page++; render(); document.querySelector('.table-frame').scrollTop = 0;};
function updateFriendManagement() {
  const friend = friendSelect.value;
  $('new-field').hidden = Boolean(friend);
  $('friend-management').hidden = !friend;
  if (friend !== managedFriend) {
    managedFriend = friend;
    renameInput.value = friend;
    managementStatus.textContent = '';
  }
  const list = $('friend-flowers');
  list.replaceChildren();
  for (const [name, flower] of flowers) {
    if (!friend || !flower.owners.has(friend)) continue;
    const item = make('li');
    const button = make('button', '刪除這朵', 'danger');
    button.type = 'button';
    button.setAttribute('aria-label', '刪除「' + name + '」的持有紀錄');
    button.onclick = () => {
      if (confirm('確定從「' + friend + '」的花冊刪除「' + name + '」？')) {
        editFriend({friend, flower:name});
      }
    };
    item.append(make('span', name), button);
    list.append(item);
  }
  $('friend-flower-empty').hidden = Boolean(list.children.length);
}
friendSelect.onchange = updateFriendManagement;

$('save-friend-name').onclick = () => {
  const friend = friendSelect.value;
  const newName = exact(renameInput.value);
  if (!newName) {
    managementStatus.textContent = '請輸入好友名稱。';
    renameInput.focus();
    return;
  }
  if (friend && newName !== friend) editFriend({friend, newName});
};
renameInput.onkeydown = event => {
  if (event.key === 'Enter' && !event.isComposing) {
    event.preventDefault();
    $('save-friend-name').click();
  }
};
$('delete-friend').onclick = () => {
  const friend = friendSelect.value;
  if (friend && confirm('確定刪除「' + friend + '」和這位好友的所有持有紀錄？')) {
    editFriend({friend});
  }
};

async function editFriend(edit) {
  if (saving || $('review-button').disabled) return;
  const {friend, newName, flower} = edit;
  const fields = $('friend-management-fields');
  saving = fields.disabled = friendSelect.disabled = $('review-button').disabled = true;
  managementStatus.textContent = '正在儲存…';
  try {
    await publishRecords([], edit);
    const selectedFilter = filter.value;
    load();
    if (selectedFilter === friend) {
      chooseFriendFilter(newName || (flower ? friend : ''));
      updateFilter();
    }
    if (newName || flower) {
      friendSelect.value = newName || friend;
      updateFriendManagement();
      managementStatus.textContent = newName ? '已更新好友名稱。' : '已刪除這筆持有紀錄。';
    } else {
      $('new-friend').value = '';
      $('new-friend').focus();
      connection.textContent = '已刪除「' + friend + '」。可以重新輸入好友資料。';
    }
  } catch (error) {
    managementStatus.textContent = error.message || '儲存失敗，請重試。';
  } finally {
    saving = fields.disabled = friendSelect.disabled = $('review-button').disabled = false;
  }
}
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
      else if (!candidates(raw).length) message = '沒有辨識到與圖鑑相符的花名，請參照原圖手動輸入。';
      else message = '已列出與圖鑑相符的花名。請確認好友確實擁有，漏掉或全新的花可以手動新增。';
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
    const records = [{friend:target,flower:''}, ...additions.map(flower => ({friend:target,flower}))];
    await publishRecords(records);
    try { saveRecords(records); } catch { /* The shared copy was saved. */ }
    $('entry').reset();
    imageURLs.forEach(URL.revokeObjectURL);
    imageURLs = [];
    renderImages('previews');
    renderImages('review-images');
    $('review').hidden = true;
    $('entry').hidden = false;
    load();
    friendSelect.value = target;
    friendSelect.onchange();
    chooseFriendFilter(target);
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
  friends = [];
  flowers = new Map();
  for (const [name, data] of Object.entries(seed.flowers)) {
    const corrected = flowerAlias(name);
    const existing = flowers.get(corrected);
    if (!existing || name === corrected || !existing.grade) {
      flowers.set(corrected, {grade:data.grade, owners:new Set()});
    }
  }
  for (const name of sharedData.flowerRenames.values()) {
    const corrected = flowerAlias(name);
    if (!flowers.has(corrected)) flowers.set(corrected, {grade:'', owners:new Set()});
  }
  try {
    for (const {friend,flower} of effectiveRecords(sharedData, readRecords())) merge(friend,[flower]);
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
    const file = new Blob([JSON.stringify({version:1,records:effectiveRecords(sharedData,readRecords())})],{type:'application/json'});
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
  if (!file || !adminToken) return;
  try {
    const data = JSON.parse(await file.text());
    if (!adminToken) return;
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

let adminToken = '';
function updateAdminView() {
  for (const field of document.querySelectorAll('[data-admin]')) field.hidden = !adminToken;
  $('admin-login').hidden = Boolean(adminToken);
  if (view === 'editor' && !adminToken) show('catalog');
  document.dispatchEvent(new Event('flower-admin-updated'));
}
$('admin-login').onsubmit = async (event) => {
  event.preventDefault();
  const token = $('shared-token').value.trim();
  if (!token) return;
  const button = $('admin-login-button');
  button.disabled = true;
  const status = $('admin-login-status');
  status.textContent = '驗證權杖中…';
  try {
    const headers = {Authorization:'Bearer ' + token, Accept:'application/vnd.github+json'};
    const request = {headers,cache:'no-store',signal:AbortSignal.timeout(12000)};
    const account = await fetch('https://api.github.com/user',request);
    if (!account.ok) throw new Error('權杖驗證失敗，請確認是否有效。');
    const repository = await fetch('https://api.github.com/repos/chllan/flower',request);
    if (!repository.ok || (await repository.json()).permissions?.push === false) {
      throw new Error('這組權杖無法管理 chllan/flower，請確認專案授權。');
    }
    adminToken = token;
    $('shared-token').value = '';
    status.textContent = '已登入管理模式。';
    updateAdminView();
  } catch (error) {
    status.textContent = error.message || '無法驗證權杖，請稍後再試。';
  } finally {
    button.disabled = false;
  }
};
$('admin-logout').onclick = () => {
  adminToken = '';
  $('shared-token').value = '';
  $('admin-login-status').textContent = '已登出。';
  updateAdminView();
};

const sharedApi = 'https://api.github.com/repos/chllan/flower/contents/flower-shared-data.json';
const emptyShared = () => ({version:1, records:[], replacedFriends:[], flowerRenames:new Map()});
let sharedData = emptyShared();
const seedRecords = [
  ...seed.friends.map(friend => ({friend, flower:''})),
  ...Object.entries(seed.flowers).flatMap(([flower, data]) =>
    data.owners.map(friend => ({friend, flower}))),
];

function effectiveRecords(data, local, extra = []) {
  const replaced = new Set(data.replacedFriends);
  const fallback = (row) => !replaced.has(exact(row.friend));
  const records = combinedRecords(seedRecords.filter(fallback), data.records, local.filter(fallback), extra);
  return combinedRecords(records.map(row => ({...row, flower:flowerAlias(row.flower, data.flowerRenames)})));
}

function applyFlowerRename(data, records, {oldName, newName}) {
  if (flowerAlias(oldName, data.flowerRenames) !== oldName ||
      (!Object.keys(seed.flowers).some(name => flowerAlias(name, data.flowerRenames) === oldName) &&
       !records.some(row => row.flower === oldName) &&
       ![...data.flowerRenames.values()].some(name => flowerAlias(name, data.flowerRenames) === oldName))) {
    throw new Error('原花名已變更，請重新查詢。');
  }
  const target = flowerAlias(newName, data.flowerRenames);
  const renames = new Map(data.flowerRenames);
  if (target === oldName) renames.delete(newName);
  renames.set(oldName, target === oldName ? newName : target);
  return renames;
}

function applyFriendEdit(records, replacedFriends, {friend, newName, flower}) {
  if (!records.some(row => row.friend === friend)) {
    throw new Error('這位好友已被移除或改名，請重新選擇。');
  }
  if (newName && records.some(row => row.friend === newName)) {
    throw new Error('這個名字已經有人使用，請換一個名稱。');
  }
  replacedFriends.add(friend);
  if (newName) {
    replacedFriends.add(newName);
    return records.map(row => row.friend === friend ? {...row, friend:newName} : row);
  }
  if (flower) {
    return combinedRecords(records.filter(row => row.friend !== friend || row.flower !== flower),
      [{friend, flower:''}]);
  }
  return records.filter(row => row.friend !== friend);
}
let sharedRevision = 0;
let sharedWriting = false;

function combinedRecords(...sources) {
  const records = new Map();
  for (const source of sources) {
    for (const row of source) {
      const normalized = {friend:exact(row.friend),flower:exact(row.flower)};
      records.set(JSON.stringify([normalized.friend,normalized.flower]),normalized);
    }
  }
  return [...records.values()];
}

function parseShared(data) {
  if (data?.version !== 1 || !Array.isArray(data.records) ||
      data.records.some(row => typeof row?.friend !== 'string' ||
        !row.friend.trim() || row.friend.length > 80 ||
        typeof row.flower !== 'string' || row.flower.length > 80)) {
    throw new Error('共用資料的格式有誤。');
  }
  const replacedFriends = data.replacedFriends ?? [];
  if (!Array.isArray(replacedFriends) ||
      replacedFriends.some(name => typeof name !== 'string' || !name.trim() || name.length > 80)) {
    throw new Error('共用資料的格式有誤。');
  }
  const entries = data.flowerRenames ?? [];
  if (!Array.isArray(entries) || entries.some(pair => !Array.isArray(pair) || pair.length !== 2 ||
      pair.some(name => typeof name !== 'string' || !name.trim() || name.length > 80))) {
    throw new Error('共用花名的格式有誤。');
  }
  const flowerRenames = new Map(entries.map(pair => pair.map(exact)));
  return {version:1, records:data.records, replacedFriends:replacedFriends.map(exact), flowerRenames};
}

async function refreshShared() {
  if (sharedWriting) return;
  const revision = sharedRevision;
  try {
    const response = await fetch('https://raw.githubusercontent.com/chllan/flower/main/flower-shared-data.json?t=' + Math.floor(Date.now() / 60000),
      {cache:'no-store', signal:AbortSignal.timeout(12000)});
    if (revision !== sharedRevision || sharedWriting) return;
    if (response.status === 404) {
      $('shared-status').textContent = '共用花冊等待管理者首次發布。';
      return;
    }
    if (!response.ok) throw new Error();
    const data = parseShared(await response.json());
    if (revision !== sharedRevision || sharedWriting) return;
    if (serializeShared(data) !== serializeShared(sharedData)) {
      sharedData = data;
      load();
      if (!$('review').hidden) classify();
    }
    $('shared-status').textContent = '已載入共用花冊。';
  } catch {
    $('shared-status').textContent = '暫時無法讀取共用花冊，稍後會再試。';
  }
}

function serializeShared(data) {
  return JSON.stringify({...data, flowerRenames:[...data.flowerRenames]});
}
function encodeShared(data) {
  const bytes = new TextEncoder().encode(serializeShared(data));
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

async function publishRecords(extra = [], edit) {
  const token = adminToken;
  if (!token) throw new Error('請先使用 GitHub 更新權杖登入。');
  if (sharedWriting) throw new Error('正在發布，請稍候。');
  sharedWriting = true;
  const publishButton = $('publish-shared');
  publishButton.disabled = true;
  const headers = {Authorization:'Bearer ' + token, Accept:'application/vnd.github+json'};
  try {
    for (let attempt = 0; attempt < 2; attempt++) {
      const current = await fetch(sharedApi + '?ref=main', {headers,cache:'no-store',signal:AbortSignal.timeout(15000)});
      let remote = emptyShared();
      let sha;
      if (current.ok) {
        const file = await current.json();
        sha = file.sha;
        const binary = atob(file.content);
        remote = parseShared(JSON.parse(new TextDecoder().decode(Uint8Array.from(binary,c => c.charCodeAt(0)))));
      } else if (current.status !== 404) {
        throw new Error('無法讀取 GitHub 資料，請確認權杖和 repo 權限。');
      }
      const replacedFriends = new Set(remote.replacedFriends);
      let records = effectiveRecords(remote, readRecords(), extra);
      const flowerRenames = edit?.oldName ? applyFlowerRename(remote, records, edit) : remote.flowerRenames;
      if (edit?.friend) {
        records = applyFriendEdit(records, replacedFriends,
          {...edit, flower:edit.flower && flowerAlias(edit.flower, flowerRenames)});
      }
      const data = {version:1, records, replacedFriends:[...replacedFriends], flowerRenames};
      if (edit?.oldName) data.records = effectiveRecords(data, []);
      const response = await fetch(sharedApi, {
        method:'PUT',
        headers:{...headers,'Content-Type':'application/json'},
        signal:AbortSignal.timeout(20000),
        body:JSON.stringify({message:'Update shared flower inventory',branch:'main',sha,content:encodeShared(data)}),
      });
      if (response.ok) {
        sharedRevision++;
        sharedData = data;
        $('shared-status').textContent = '已發布共用花冊。';
        return;
      }
      if (attempt === 0 && [409,422].includes(response.status)) continue;
      throw new Error('GitHub 儲存失敗（' + response.status + '）。請確認權杖有 Contents 的 Read and write 權限。');
    }
  } finally {
    sharedWriting = false;
    publishButton.disabled = false;
  }
}

$('rename-flower-form').onsubmit = async event => {
  event.preventDefault();
  if (!adminToken) return;
  const oldName = canonical($('old-flower-name').value);
  const newName = exact($('new-flower-name').value);
  const status = $('rename-flower-status');
  if (!flowers.has(oldName) || !newName || oldName === newName) {
    status.textContent = '請輸入現有花名和不同的正確花名。';
    return;
  }
  if (!confirm('確定將共用花冊中的「' + oldName + '」更正為「' + newName + '」？')) return;
  const button = $('save-flower-name');
  button.disabled = true;
  status.textContent = '正在儲存…';
  try {
    await publishRecords([], {oldName, newName});
    search.value = flowerAlias(oldName);
    page = 1;
    load();
    if (!$('review').hidden) classify();
    event.target.reset();
    status.textContent = '已更正為「' + flowerAlias(oldName) + '」，並更新所有好友的持有紀錄。';
  } catch (error) {
    status.textContent = error.message || '儲存失敗，請重試。';
  } finally {
    button.disabled = false;
  }
};

$('publish-shared').onclick = async () => {
  const status = $('shared-admin-status');
  status.textContent = '正在發布…';
  try {
    await publishRecords();
    load('已發布目前的好友資料。');
    if (!$('review').hidden) classify();
    status.textContent = '發布完成。';
  } catch (error) {
    status.textContent = error.message || '發布失敗，請重試。';
  }
};
load();
refreshShared();
setInterval(() => { if (!document.hidden) refreshShared(); }, 60000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshShared(); });
