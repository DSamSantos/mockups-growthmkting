// ========== LUCIDE ==========
lucide.createIcons();

// ========== SIDEBAR TOGGLE ==========
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ========== NAVIGATION ==========
function navigate(page) {
  document.getElementById('sidebar').classList.remove('open');

  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const navItem = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (navItem) navItem.classList.add('active');

  document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
  const target = document.getElementById(`page-${page}`);
  if (target) target.classList.add('active');

  const titles = {
    home: 'Home',
    'd10-d12': 'D10-D12 — Painel Estratégico',
    d9: 'D9 — Performance Multicanal',
    d13: 'D13 — Detalhamento Campanhas',
    d14: 'D14 — Jornada do Cliente',
    d16: 'D16 — Segmentação & Overlap',
    dc: 'DC — Dash Contratos'
  };
  document.getElementById('pageTitle').textContent = titles[page] || page;
}

// ========== D10-D12 TABS ==========
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', function() {
    const tabId = this.dataset.tab;

    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');

    document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
    const target = document.getElementById(`tab-${tabId}`);
    if (target) {
      target.classList.add('active');
      var tick = 0;
      (function rerender() {
        window.dispatchEvent(new Event('resize'));
        if (++tick < 3) setTimeout(rerender, 80 * (tick + 1));
      })();
    }
  });
});

// ========== ECHARTS INIT ==========
function initChart(id, option) {
  const dom = document.getElementById(id);
  if (!dom) return null;
  const chart = echarts.init(dom);
  chart.setOption(option);
  return chart;
}

// ========== CHARTS ==========

// 3b. IE por Perfil (horizontal loading bars) ---
initChart('chart-ie-perfil', {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: function(p) { return '<b>' + p[0].name + '</b><br/>Engajamento: ' + p[0].value + '%'; } },
  grid: { top: 5, right: 50, bottom: 5, left: 90 },
  xAxis: { type: 'value', max: 100, axisLabel: { fontSize: 10, formatter: '{value}%' }, splitLine: { show: false } },
  yAxis: { type: 'category', data: ['ME/EPP', 'MEI', 'Prod. Rural', 'Informal'], inverse: true, axisLabel: { fontSize: 11 }, axisLine: { show: false }, axisTick: { show: false }, splitLine: { show: false } },
  series: [{
    type: 'bar',
    data: [
      { value: 74, itemStyle: { color: '#00897B', borderRadius: [0, 4, 4, 0] } },
      { value: 58, itemStyle: { color: '#45A1FF', borderRadius: [0, 4, 4, 0] } },
      { value: 45, itemStyle: { color: '#FFB347', borderRadius: [0, 4, 4, 0] } },
      { value: 32, itemStyle: { color: '#78909C', borderRadius: [0, 4, 4, 0] } }
    ],
    barWidth: '65%',
    label: { show: true, position: 'right', fontSize: 11, fontWeight: 600, formatter: '{c}%' }
  }]
});

// === Ranking Tables: ISC, IE, Cobertura (27 UFs) ===
function renderTable(id, cols, data, colorColumn) {
  var el = document.getElementById(id);
  if (!el) return;
  var h = '<table class="compact-table"><thead><tr>';
  for (var i = 0; i < cols.length; i++) { h += '<th>' + cols[i] + '</th>'; }
  h += '</tr></thead><tbody>';
  for (var r = 0; r < data.length; r++) {
    h += '<tr>';
    for (var c = 0; c < data[r].length; c++) {
      var val = data[r][c];
      if (c === colorColumn) {
        var numVal = parseFloat(val.replace(',','.'));
        var cls = numVal > 4 ? 'badge badge-green' : (numVal >= 1 ? 'badge badge-amber' : 'badge badge-red');
        h += '<td><span class="' + cls + '" style="font-weight:600;">' + val + '</span></td>';
      } else {
        h += '<td>' + val + '</td>';
      }
    }
    h += '</tr>';
  }
  h += '</tbody></table>';
  el.innerHTML = h;
}

// ISC — 27 UFs sorted by ISC desc
var iscUfData = [
  ['1','SP','4,8','4,8%','0,3%','97,2%'],['2','MG','4,2','4,2%','0,4%','96,5%'],
  ['3','RJ','3,9','3,9%','0,5%','95,8%'],['4','RS','3,5','3,5%','0,6%','95,1%'],
  ['5','PR','3,2','3,2%','0,7%','94,5%'],['6','SC','3,0','3,0%','0,8%','93,8%'],
  ['7','DF','2,8','2,8%','0,9%','93,0%'],['8','ES','2,6','2,6%','1,0%','92,2%'],
  ['9','GO','2,4','2,4%','1,1%','91,5%'],['10','MS','2,2','2,2%','1,2%','90,8%'],
  ['11','MT','2,0','2,0%','1,3%','90,0%'],['12','BA','1,9','1,9%','1,4%','89,2%'],
  ['13','PE','1,8','1,8%','1,5%','88,5%'],['14','CE','1,7','1,7%','1,5%','87,8%'],
  ['15','RN','1,6','1,6%','1,6%','87,0%'],['16','PB','1,5','1,5%','1,6%','86,2%'],
  ['17','SE','1,4','1,4%','1,7%','85,5%'],['18','AL','1,3','1,3%','1,7%','84,8%'],
  ['19','PI','1,2','1,2%','1,8%','84,0%'],['20','MA','1,1','1,1%','1,8%','83,2%'],
  ['21','PA','1,0','1,0%','1,9%','82,5%'],['22','AM','0,9','0,9%','2,0%','81,8%'],
  ['23','RO','0,8','0,8%','2,2%','80,0%'],['24','TO','0,7','0,7%','2,2%','78,5%'],
  ['25','AP','0,6','0,6%','2,5%','76,0%'],['26','AC','0,5','0,5%','2,8%','72,5%'],
  ['27','RR','0,4','0,4%','2,5%','74,0%']
];
renderTable('table-isc-uf', ['#','BU','ISC','CTRd','Opt-out','Entreg.'], iscUfData, 2);

// IE — 27 UFs sorted by IE desc
var ieUfData = [
  ['1','SP','78,0%'],['2','MG','74,0%'],['3','RJ','70,0%'],['4','RS','67,0%'],
  ['5','PR','64,0%'],['6','SC','62,0%'],['7','DF','60,0%'],['8','ES','58,0%'],
  ['9','GO','56,0%'],['10','MS','54,0%'],['11','MT','52,0%'],['12','BA','50,0%'],
  ['13','PE','49,0%'],['14','CE','48,0%'],['15','RN','47,0%'],['16','PB','46,0%'],
  ['17','SE','45,0%'],['18','AL','44,0%'],['19','PI','43,0%'],['20','MA','42,0%'],
  ['21','PA','41,0%'],['22','AM','40,0%'],['23','RO','39,0%'],['24','TO','44,0%'],
  ['25','AP','38,0%'],['26','AC','40,0%'],['27','RR','42,0%']
];
renderTable('table-ie-uf', ['#','UF','IE'], ieUfData);

// Cobertura — 27 UFs sorted by Cobertura desc
var cobUfData = [
  ['1','SP','55,0%'],['2','MG','50,0%'],['3','RJ','47,0%'],['4','RS','44,0%'],
  ['5','BA','41,0%'],['6','SC','40,0%'],['7','PR','39,0%'],['8','DF','38,0%'],
  ['9','ES','37,0%'],['10','GO','36,0%'],['11','MS','35,0%'],['12','MT','34,0%'],
  ['13','PE','33,0%'],['14','CE','32,0%'],['15','RN','31,0%'],['16','PB','30,0%'],
  ['17','SE','29,0%'],['18','AL','28,0%'],['19','PI','27,0%'],['20','MA','26,0%'],
  ['21','PA','25,0%'],['22','AM','24,0%'],['23','RO','23,0%'],['24','TO','22,0%'],
  ['25','AP','20,0%'],['26','AC','18,0%'],['27','RR','18,0%']
];
renderTable('table-cobertura-uf', ['#','UF','Cobertura'], cobUfData);

// 4a. NPS Evolution (Trimestral) ---
initChart('chart-nps-evolution', {
  tooltip: { trigger: 'axis' },
  grid: { top: 10, right: 20, bottom: 40, left: 50 },
  xAxis: { type: 'category', data: ['Q1/25', 'Q2/25', 'Q3/25', 'Q4/25', 'Q1/26'], axisLabel: { fontSize: 11 } },
  yAxis: { type: 'value', min: 0, max: 100, axisLabel: { fontSize: 11 }, name: 'NPS', nameTextStyle: { fontSize: 10 } },
  series: [{
    name: 'NPS', type: 'bar',
    data: [
      { value: 45, itemStyle: { color: '#45A1FF', borderRadius: [4,4,0,0] } },
      { value: 52, itemStyle: { color: '#45A1FF', borderRadius: [4,4,0,0] } },
      { value: 58, itemStyle: { color: '#45A1FF', borderRadius: [4,4,0,0] } },
      { value: 65, itemStyle: { color: '#45A1FF', borderRadius: [4,4,0,0] } },
      { value: 70, itemStyle: { color: '#0060DF', borderRadius: [4,4,0,0] } }
    ],
    barWidth: '55%',
    label: { show: true, position: 'top', fontSize: 11, fontWeight: 600, color: '#5A5A5A', formatter: '{c}' }
  }]
});

// 4c. CSAT Evolution (Mensal) ---
initChart('chart-csat-evolution', {
  tooltip: { trigger: 'axis' },
  grid: { top: 10, right: 20, bottom: 40, left: 50 },
  xAxis: { type: 'category', data: ['Jan/26', 'Fev/26', 'Mar/26', 'Abr/26', 'Mai/26', 'Jun/26'], axisLabel: { fontSize: 11 } },
  yAxis: { type: 'value', min: 0, max: 5, axisLabel: { fontSize: 11 }, name: 'CSAT', nameTextStyle: { fontSize: 10 } },
  series: [{
    name: 'CSAT', type: 'line',
    data: [3.8, 3.9, 3.9, 4.0, 4.1, 4.2],
    smooth: true, lineStyle: { width: 2.5, color: '#00897B' }, symbol: 'circle', symbolSize: 6, color: '#00897B',
    areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(0,137,123,0.2)' }, { offset: 1, color: 'rgba(0,137,123,0.02)' }]) },
    label: { show: true, position: 'top', fontSize: 10, fontWeight: 600, color: '#5A5A5A', formatter: function(p) { return p.value.toFixed(1); } }
  }]
});

// 4d. CSAT por Região (horizontal bars) ---
initChart('chart-csat-regiao-benchmark', {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: function(p) { const reg = ['Norte','Nordeste','Centro-Oeste','Sul','Sudeste']; const v = [3.7,3.9,4.1,4.3,4.5]; return '<b>' + reg[p[0].dataIndex] + '</b><br/>CSAT: <b>' + v[p[0].dataIndex].toFixed(1) + '</b>'; } },
  grid: { top: 5, right: 55, bottom: 5, left: 85 },
  xAxis: { type: 'value', min: 0, max: 5, axisLabel: { fontSize: 10, formatter: '{value}' } },
  yAxis: { type: 'category', data: ['Norte','Nordeste','Centro-Oeste','Sul','Sudeste'], axisLabel: { fontSize: 10 }, axisLine: { show: false }, axisTick: { show: false }, splitLine: { show: false } },
  series: [{
    type: 'bar',
    data: [
      { value: 3.7, itemStyle: { color: '#E65100' } },
      { value: 3.9, itemStyle: { color: '#FFB347' } },
      { value: 4.1, itemStyle: { color: '#45A1FF' } },
      { value: 4.3, itemStyle: { color: '#0060DF' } },
      { value: 4.5, itemStyle: { color: '#0060DF' } }
    ],
    barWidth: '55%',
    label: { show: true, position: 'right', fontSize: 10, fontWeight: 600, formatter: function(p) { return p.value.toFixed(1); } }
  }]
});

// 4b. NPS por Região ---
initChart('chart-nps-regiao-benchmark', {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: function(p) { const reg = ['Norte','Nordeste','Centro-Oeste','Sul','Sudeste']; const v = [42,48,52,68,72]; return '<b>' + reg[p[0].dataIndex] + '</b><br/>NPS: <b>' + v[p[0].dataIndex] + '</b>'; } },
  grid: { top: 5, right: 65, bottom: 5, left: 85 },
  xAxis: { type: 'value', min: 0, max: 100, axisLabel: { fontSize: 10 } },
  yAxis: { type: 'category', data: ['Norte','Nordeste','Centro-Oeste','Sul','Sudeste'], axisLabel: { fontSize: 10 }, axisLine: { show: false }, axisTick: { show: false }, splitLine: { show: false } },
  series: [{
    type: 'bar',
    data: [
      { value: 42, itemStyle: { color: '#E65100' } },
      { value: 48, itemStyle: { color: '#FFB347' } },
      { value: 52, itemStyle: { color: '#FF9400' } },
      { value: 68, itemStyle: { color: '#0060DF' } },
      { value: 72, itemStyle: { color: '#0060DF' } }
    ],
    barWidth: '55%',
    label: { show: true, position: 'right', fontSize: 10, fontWeight: 600, formatter: '{c}' }
  }]
});

// 4e. NPS por Perfil (horizontal bars) ---
initChart('chart-nps-perfil', {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: function(p) { return '<b>' + p[0].name + '</b><br/>NPS: ' + p[0].value; } },
  grid: { top: 5, right: 50, bottom: 5, left: 90 },
  xAxis: { type: 'value', min: 0, max: 100, axisLabel: { fontSize: 10, formatter: '{value}' }, splitLine: { show: false } },
  yAxis: { type: 'category', data: ['ME/EPP', 'MEI', 'Prod. Rural', 'Informal'], inverse: true, axisLabel: { fontSize: 11 }, axisLine: { show: false }, axisTick: { show: false }, splitLine: { show: false } },
  series: [{
    type: 'bar',
    data: [
      { value: 76, itemStyle: { color: '#0060DF', borderRadius: [0, 4, 4, 0] } },
      { value: 62, itemStyle: { color: '#45A1FF', borderRadius: [0, 4, 4, 0] } },
      { value: 48, itemStyle: { color: '#FFB347', borderRadius: [0, 4, 4, 0] } },
      { value: 35, itemStyle: { color: '#78909C', borderRadius: [0, 4, 4, 0] } }
    ],
    barWidth: '65%',
    label: { show: true, position: 'right', fontSize: 11, fontWeight: 600, formatter: '{c}' }
  }]
});

// 4f. CSAT por Perfil (horizontal bars) ---
initChart('chart-csat-perfil', {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: function(p) { return '<b>' + p[0].name + '</b><br/>CSAT: ' + p[0].value.toFixed(1); } },
  grid: { top: 5, right: 50, bottom: 5, left: 90 },
  xAxis: { type: 'value', min: 1, max: 5, axisLabel: { fontSize: 10, formatter: '{value}' }, splitLine: { show: false } },
  yAxis: { type: 'category', data: ['ME/EPP', 'MEI', 'Prod. Rural', 'Informal'], inverse: true, axisLabel: { fontSize: 11 }, axisLine: { show: false }, axisTick: { show: false }, splitLine: { show: false } },
  series: [{
    type: 'bar',
    data: [
      { value: 4.6, itemStyle: { color: '#00897B', borderRadius: [0, 4, 4, 0] } },
      { value: 4.1, itemStyle: { color: '#45A1FF', borderRadius: [0, 4, 4, 0] } },
      { value: 3.6, itemStyle: { color: '#FFB347', borderRadius: [0, 4, 4, 0] } },
      { value: 3.2, itemStyle: { color: '#78909C', borderRadius: [0, 4, 4, 0] } }
    ],
    barWidth: '65%',
    label: { show: true, position: 'right', fontSize: 11, fontWeight: 600, formatter: function(p) { return p.value.toFixed(1); } }
  }]
});

// --- Share de Voz por Produto ---
initChart('chart-share-voz', {
  tooltip: { trigger: 'item', formatter: '{b}: {c}% ({d}%)' },
  legend: { bottom: 0, textStyle: { fontSize: 10 } },
  series: [{
    type: 'pie',
    radius: ['40%', '70%'],
    center: ['50%', '45%'],
    label: { show: true, formatter: '{b}\n{d}%', fontSize: 9 },
    data: [
      { value: 28, name: 'Crédito', itemStyle: { color: '#0045A3' } },
      { value: 22, name: 'Consultoria', itemStyle: { color: '#0060DF' } },
      { value: 18, name: 'Capacitação', itemStyle: { color: '#45A1FF' } },
      { value: 14, name: 'Cursos', itemStyle: { color: '#80BCFF' } },
      { value: 10, name: 'Sol. Digitais', itemStyle: { color: '#B0B0B0' } },
      { value: 8, name: 'Estruturantes', itemStyle: { color: '#C4C4C4' } }
    ]
  }]
});

// --- ISC por Portfolio ---
initChart('chart-isc-portfolio', {
  tooltip: { trigger: 'axis' },
  grid: { top: 10, right: 55, bottom: 40, left: 50 },
  xAxis: { type: 'category', data: ['Consultoria', 'Capacitação', 'Crédito', 'Cursos', 'Sol. Digitais', 'Estruturantes'], axisLabel: { fontSize: 11 } },
  yAxis: { type: 'value', min: 0, max: 6, axisLabel: { fontSize: 11 }, name: 'ISC', nameTextStyle: { fontSize: 10, color: '#5A5A5A' } },
  series: [{
    name: 'ISC Geral', type: 'bar', data: [3.5, 2.8, 3.8, 2.0, 1.5, 1.2],
    itemStyle: { borderRadius: [4,4,0,0], color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: '#0060DF' },
      { offset: 1, color: '#80BCFF' }
    ]) },
    markLine: { data: [{ yAxis: 2.5, name: 'Threshold', label: { formatter: '{b}: {c}', fontSize: 10, color: '#F9A825', position: 'insideEndTop' }, lineStyle: { color: '#F9A825', type: 'dashed', width: 1.5 } }] }
  }]
});

// --- Cobertura por Produto ---
initChart('chart-cobertura-produto', {
  tooltip: { trigger: 'axis' },
  grid: { top: 10, right: 20, bottom: 40, left: 50 },
  xAxis: { type: 'category', data: ['Consultoria', 'Capacitação', 'Crédito', 'Cursos', 'Sol. Digitais', 'Estruturantes'], axisLabel: { fontSize: 11 } },
  yAxis: { type: 'value', axisLabel: { fontSize: 11, formatter: '{value}%' } },
  series: [{
    type: 'bar',
    data: [48, 52, 38, 45, 28, 22],
    itemStyle: { borderRadius: [4,4,0,0], color: '#00897B' }
  }]
});

// --- Atendimentos por Produto ---
initChart('chart-atendimentos-produto', {
  tooltip: { trigger: 'axis' },
  grid: { top: 10, right: 20, bottom: 40, left: 50 },
  xAxis: { type: 'category', data: ['Capacitação', 'Consultoria', 'Crédito', 'Cursos', 'Sol. Digitais', 'Estruturantes'], axisLabel: { fontSize: 11 } },
  yAxis: { type: 'value', axisLabel: { fontSize: 11, formatter: '{value}k' } },
  series: [{
    type: 'bar',
    data: [45, 38, 28, 22, 12, 8],
    itemStyle: { borderRadius: [4,4,0,0], color: '#FF9400' }
  }]
});

// --- Distribuição por Etapa da Jornada ---
initChart('chart-etapa-jornada', {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { top: 0, textStyle: { fontSize: 11 } },
  grid: { top: 30, right: 55, bottom: 32, left: 85 },
  xAxis: { type: 'value', axisLabel: { fontSize: 11, formatter: '{value}k' } },
  yAxis: { type: 'category', data: ['Pós-Venda', 'Conversão', 'Consideração', 'Interesse', 'Descoberta'], axisLabel: { fontSize: 11 } },
  series: [
    { name: 'MEI', type: 'bar', stack: 'total', data: [12, 18, 28, 45, 62], itemStyle: { color: '#80BCFF' } },
    { name: 'EPP', type: 'bar', stack: 'total', data: [18, 22, 32, 38, 50], itemStyle: { color: '#45A1FF' } },
    { name: 'ME', type: 'bar', stack: 'total', data: [38, 35, 42, 38, 42], itemStyle: { color: '#0080FF' } },
    { name: 'Informal', type: 'bar', stack: 'total', data: [22, 25, 30, 28, 35], itemStyle: { color: '#0060DF' } },
    { name: 'Prod. Rural', type: 'bar', stack: 'total', data: [30, 28, 25, 22, 28], itemStyle: { color: '#0045A3' } }
  ]
});

// --- Distribuição por Etapa — Segmento RFV ---
initChart('chart-etapa-segmento', {
  tooltip: { trigger: 'item', formatter: function(p) { return p.data[3] + '<br/>Etapa: ' + p.data[0] + '<br/>Volume: ' + p.data[2] + 'k leads'; } },
  grid: { top: 10, right: 20, bottom: 55, left: 80 },
  xAxis: { type: 'category', data: ['Descoberta', 'Interesse', 'Consideração', 'Conversão', 'Pós-Venda'], axisLabel: { fontSize: 11 } },
  yAxis: { type: 'category', data: ['Diamante', 'Ouro', 'Prata', 'Bronze', 'Atenção', 'Risco', 'Inativo', 'Novatos'], axisLabel: { fontSize: 10 } },
  series: [{
    type: 'scatter',
    symbolSize: function(v) { return Math.sqrt(v[2]) * 5; },
    data: [
      { value: [0, 7, 4], name: 'Novatos-Desc', itemStyle: { color: '#2E7D32' } },
      { value: [1, 7, 3], name: 'Novatos-Int', itemStyle: { color: '#2E7D32' } },
      { value: [2, 7, 2], name: 'Novatos-Cons', itemStyle: { color: '#2E7D32' } },
      { value: [3, 7, 1], name: 'Novatos-Conv', itemStyle: { color: '#2E7D32' } },
      { value: [4, 7, 1], name: 'Novatos-Pos', itemStyle: { color: '#2E7D32' } },
      { value: [0, 6, 8], name: 'Inativo-Desc', itemStyle: { color: '#C62828' } },
      { value: [1, 6, 5], name: 'Inativo-Int', itemStyle: { color: '#C62828' } },
      { value: [2, 6, 3], name: 'Inativo-Cons', itemStyle: { color: '#C62828' } },
      { value: [3, 6, 2], name: 'Inativo-Conv', itemStyle: { color: '#C62828' } },
      { value: [4, 6, 2], name: 'Inativo-Pos', itemStyle: { color: '#C62828' } },
      { value: [0, 5, 6], name: 'Risco-Desc', itemStyle: { color: '#E65100' } },
      { value: [1, 5, 5], name: 'Risco-Int', itemStyle: { color: '#E65100' } },
      { value: [2, 5, 4], name: 'Risco-Cons', itemStyle: { color: '#E65100' } },
      { value: [3, 5, 3], name: 'Risco-Conv', itemStyle: { color: '#E65100' } },
      { value: [4, 5, 3], name: 'Risco-Pos', itemStyle: { color: '#E65100' } },
      { value: [0, 4, 10], name: 'Atenção-Desc', itemStyle: { color: '#F9A825' } },
      { value: [1, 4, 8], name: 'Atenção-Int', itemStyle: { color: '#F9A825' } },
      { value: [2, 4, 6], name: 'Atenção-Cons', itemStyle: { color: '#F9A825' } },
      { value: [3, 4, 4], name: 'Atenção-Conv', itemStyle: { color: '#F9A825' } },
      { value: [4, 4, 3], name: 'Atenção-Pos', itemStyle: { color: '#F9A825' } },
      { value: [0, 3, 12], name: 'Bronze-Desc', itemStyle: { color: '#B0B0B0' } },
      { value: [1, 3, 10], name: 'Bronze-Int', itemStyle: { color: '#B0B0B0' } },
      { value: [2, 3, 8], name: 'Bronze-Cons', itemStyle: { color: '#B0B0B0' } },
      { value: [3, 3, 7], name: 'Bronze-Conv', itemStyle: { color: '#B0B0B0' } },
      { value: [4, 3, 5], name: 'Bronze-Pos', itemStyle: { color: '#B0B0B0' } },
      { value: [0, 2, 16], name: 'Prata-Desc', itemStyle: { color: '#80BCFF' } },
      { value: [1, 2, 14], name: 'Prata-Int', itemStyle: { color: '#80BCFF' } },
      { value: [2, 2, 12], name: 'Prata-Cons', itemStyle: { color: '#80BCFF' } },
      { value: [3, 2, 10], name: 'Prata-Conv', itemStyle: { color: '#80BCFF' } },
      { value: [4, 2, 8], name: 'Prata-Pos', itemStyle: { color: '#80BCFF' } },
      { value: [0, 1, 22], name: 'Ouro-Desc', itemStyle: { color: '#0060DF' } },
      { value: [1, 1, 20], name: 'Ouro-Int', itemStyle: { color: '#0060DF' } },
      { value: [2, 1, 18], name: 'Ouro-Cons', itemStyle: { color: '#0060DF' } },
      { value: [3, 1, 15], name: 'Ouro-Conv', itemStyle: { color: '#0060DF' } },
      { value: [4, 1, 12], name: 'Ouro-Pos', itemStyle: { color: '#0060DF' } },
      { value: [0, 0, 28], name: 'Diamante-Desc', itemStyle: { color: '#0045A3' } },
      { value: [1, 0, 25], name: 'Diamante-Int', itemStyle: { color: '#0045A3' } },
      { value: [2, 0, 22], name: 'Diamante-Cons', itemStyle: { color: '#0045A3' } },
      { value: [3, 0, 18], name: 'Diamante-Conv', itemStyle: { color: '#0045A3' } },
      { value: [4, 0, 14], name: 'Diamante-Pos', itemStyle: { color: '#0045A3' } }
    ],
    label: { show: false },
    emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.3)' } }
  }]
});

// --- Matriz ISC x Cobertura (Scatter) ---
initChart('chart-receita-portfolio', {
  tooltip: { trigger: 'item', formatter: function(p) { return p.name + '<br/>ISC: ' + p.value[1] + '<br/>Cobertura: ' + p.value[0] + '%<br/>Esforço: ' + p.value[2] + 'k disparos'; } },
  grid: { top: 10, right: 20, bottom: 40, left: 55 },
  xAxis: { type: 'value', name: 'Cobertura (%)', nameLocation: 'middle', nameGap: 25, axisLabel: { fontSize: 11, formatter: '{value}%' } },
  yAxis: { type: 'value', name: 'ISC', nameLocation: 'middle', nameGap: 35, axisLabel: { fontSize: 11 } },
  series: [{
    type: 'scatter',
    symbolSize: function(v) { return Math.sqrt(v[2]) * 8; },
    data: [
      { value: [48, 3.5, 2.3], name: 'Consultoria', itemStyle: { color: '#0060DF' } },
      { value: [52, 2.8, 1.8], name: 'Capacitação', itemStyle: { color: '#45A1FF' } },
      { value: [38, 3.8, 2.8], name: 'Crédito', itemStyle: { color: '#0045A3' } },
      { value: [45, 2.0, 1.4], name: 'Cursos', itemStyle: { color: '#80BCFF' } },
      { value: [28, 1.5, 0.9], name: 'Sol. Digitais', itemStyle: { color: '#B0B0B0' } },
      { value: [22, 1.2, 0.6], name: 'Estruturantes', itemStyle: { color: '#C4C4C4' } }
    ],
    label: { show: true, formatter: function(p) { return p.name; }, fontSize: 9, position: 'right' },
    emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.2)' } }
  }]
});

// --- CPL Evolution ---
initChart('chart-ticket-portfolio', {
  tooltip: { trigger: 'axis' },
  legend: { bottom: 0, textStyle: { fontSize: 11 } },
  grid: { top: 10, right: 20, bottom: 55, left: 55 },
  xAxis: { type: 'category', data: ['Jan/26', 'Fev/26', 'Mar/26', 'Abr/26', 'Mai/26', 'Jun/26'], axisLabel: { fontSize: 11 } },
  yAxis: { type: 'value', axisLabel: { fontSize: 11, formatter: 'R${value}' } },
  series: [
    { name: 'CPL', type: 'line', data: [5.2, 5.4, 5.0, 5.6, 5.8, 5.5], smooth: true, lineStyle: { width: 2.5 }, symbol: 'circle', symbolSize: 6, color: '#0060DF', areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(0,96,223,0.3)' }, { offset: 1, color: 'rgba(0,96,223,0.05)' }] } } },
    { name: 'Meta', type: 'line', data: [5, 5, 5, 5, 5, 5], lineStyle: { width: 1.5, type: 'dashed', color: '#2E7D32' }, symbol: 'none', silent: true }
  ]
});

// --- Ticket Médio por Perfil ---
initChart('chart-ticket-perfil', {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { top: 10, right: 20, bottom: 40, left: 60 },
  xAxis: { type: 'value', axisLabel: { fontSize: 11, formatter: 'R${value}' } },
  yAxis: { type: 'category', data: ['ME', 'EPP', 'MEI', 'Prod. Rural', 'Informal'], axisLabel: { fontSize: 11 }, inverse: true },
  series: [{
    type: 'bar', data: [8250, 5800, 2400, 1800, 950],
    itemStyle: { borderRadius: [0, 4, 4, 0], color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
      { offset: 0, color: '#80BCFF' },
      { offset: 1, color: '#0045A3' }
    ]) },
    label: { show: true, position: 'right', fontSize: 10, formatter: 'R${c}' }
  }]
});

// --- Ticket Médio por Produto ---
initChart('chart-ticket-produto', {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { top: 10, right: 20, bottom: 40, left: 70 },
  xAxis: { type: 'value', axisLabel: { fontSize: 11, formatter: 'R${value}' } },
  yAxis: { type: 'category', data: ['Crédito', 'Consultoria', 'Capacitação', 'Sol. Digitais', 'Cursos', 'Estruturantes'], axisLabel: { fontSize: 11 }, inverse: true },
  series: [{
    type: 'bar', data: [9200, 4800, 3200, 2100, 1500, 1100],
    itemStyle: { borderRadius: [0, 4, 4, 0], color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
      { offset: 0, color: '#C8E6C9' },
      { offset: 0.5, color: '#45A1FF' },
      { offset: 1, color: '#0045A3' }
    ]) },
    label: { show: true, position: 'right', fontSize: 10, formatter: 'R${c}' }
  }]
});

// --- Atendimentos x Cobertura (Scatter) ---
initChart('chart-atendimentos-cobertura', {
  tooltip: { trigger: 'item', formatter: function(p) { return p.name + '<br/>Atendimentos: ' + p.value[1] + 'k leads<br/>Cobertura: ' + p.value[0] + '%<br/>ROI: ' + p.value[2] + '%'; } },
  grid: { top: 10, right: 20, bottom: 40, left: 55 },
  xAxis: { type: 'value', name: 'Cobertura (%)', nameLocation: 'middle', nameGap: 25, axisLabel: { fontSize: 11, formatter: '{value}%' } },
  yAxis: { type: 'value', name: 'Atendimentos (k)', nameLocation: 'middle', nameGap: 40, axisLabel: { fontSize: 11, formatter: '{value}k' } },
  series: [{
    type: 'scatter',
    symbolSize: function(v) { return Math.sqrt(v[2]) * 1.2; },
    data: [
      { value: [48, 38, 320], name: 'Consultoria', itemStyle: { color: '#0060DF' } },
      { value: [52, 45, 290], name: 'Capacitação', itemStyle: { color: '#45A1FF' } },
      { value: [38, 28, 480], name: 'Crédito', itemStyle: { color: '#0045A3' } },
      { value: [45, 22, 210], name: 'Cursos', itemStyle: { color: '#80BCFF' } },
      { value: [28, 12, 390], name: 'Sol. Digitais', itemStyle: { color: '#B0B0B0' } },
      { value: [22, 8, 190], name: 'Estruturantes', itemStyle: { color: '#C4C4C4' } }
    ],
    label: { show: true, formatter: function(p) { return p.name; }, fontSize: 9, position: 'right' },
    emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.2)' } }
  }]
});

// --- RFV Distribution (Pizza) ---
initChart('chart-rfv-distribution', {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: function(p) { var total = 13400; return p[0].name + '<br/>Base: ' + p[0].value + 'k<br/>Participação: ' + (p[0].value / total * 100).toFixed(1) + '%'; } },
  grid: { top: 10, right: 100, bottom: 10, left: 70 },
  xAxis: { type: 'value', axisLabel: { show: false } },
  yAxis: { type: 'category', data: ['Diamante', 'Ouro', 'Prata', 'Bronze', 'Atenção', 'Risco', 'Inativo', 'Novatos'], axisLabel: { fontSize: 11 }, inverse: true },
  series: [{
    type: 'bar',
    data: [
      { value: 1200, itemStyle: { color: '#0045A3' } },
      { value: 1800, itemStyle: { color: '#0060DF' } },
      { value: 2400, itemStyle: { color: '#80BCFF' } },
      { value: 1800, itemStyle: { color: '#B0B0B0' } },
      { value: 1400, itemStyle: { color: '#F9A825' } },
      { value: 1100, itemStyle: { color: '#E65100' } },
      { value: 3100, itemStyle: { color: '#C62828' } },
      { value: 600, itemStyle: { color: '#2E7D32' } }
    ],
    label: { show: true, position: 'right', fontSize: 11, formatter: function(p) { return p.value + 'k'; } },
    itemStyle: { borderRadius: [0, 4, 4, 0] },
    emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.2)' } }
  }]
});

// --- Score RFV Composto — Perfil ---
initChart('chart-score-perfil', {
  tooltip: { trigger: 'axis', formatter: function(p) { return '<strong>' + p[0].name + '</strong><br/>Score composto: ' + p[0].value.toFixed(1) + '/5'; } },
  grid: { top: 10, right: 50, bottom: 10, left: 95 },
  yAxis: { type: 'category', data: ['Informal', 'Prod. Rural', 'MEI', 'EPP', 'ME'], axisLabel: { fontSize: 11 } },
  xAxis: { type: 'value', min: 0, max: 5, axisLabel: { fontSize: 11, formatter: '{value}/5' } },
  series: [{ type: 'bar', barWidth: '60%', data: [2.1, 2.5, 3.2, 3.8, 4.2], itemStyle: { borderRadius: [0,4,4,0], color: '#00897B' }, label: { show: true, position: 'right', formatter: '{c}/5', fontSize: 10, fontWeight: 'bold', color: '#2D2D2D' } }]
});

// --- Score RFV Composto — Segmento ---
initChart('chart-score-segmento', {
  tooltip: { trigger: 'axis', formatter: function(p) { return '<strong>' + p[0].name + '</strong><br/>Score composto: ' + p[0].value.toFixed(1) + '/5'; } },
  grid: { top: 10, right: 50, bottom: 10, left: 95 },
  yAxis: { type: 'category', data: ['Turismo', 'Agronegócio', 'Comércio', 'Serviço', 'Indústria'], axisLabel: { fontSize: 11 } },
  xAxis: { type: 'value', min: 0, max: 5, axisLabel: { fontSize: 11, formatter: '{value}/5' } },
  series: [{ type: 'bar', barWidth: '60%', data: [2.8, 3.2, 3.5, 3.8, 4.0], itemStyle: { borderRadius: [0,4,4,0], color: '#F57C00' }, label: { show: true, position: 'right', formatter: '{c}/5', fontSize: 10, fontWeight: 'bold', color: '#2D2D2D' } }]
});

// --- Score RFV Composto — Produto ---
initChart('chart-score-produto', {
  tooltip: { trigger: 'axis', formatter: function(p) { return '<strong>' + p[0].name + '</strong><br/>Score composto: ' + p[0].value.toFixed(1) + '/5'; } },
  grid: { top: 10, right: 50, bottom: 10, left: 105 },
  yAxis: { type: 'category', data: ['Estruturantes', 'Sol. Digitais', 'Cursos', 'Crédito', 'Consultoria', 'Capacitação'], axisLabel: { fontSize: 11 } },
  xAxis: { type: 'value', min: 0, max: 5, axisLabel: { fontSize: 11, formatter: '{value}/5' } },
  series: [{ type: 'bar', barWidth: '60%', data: [2.5, 3.0, 3.2, 3.5, 3.8, 4.2], itemStyle: { borderRadius: [0,4,4,0], color: '#1565C0' }, label: { show: true, position: 'right', formatter: '{c}/5', fontSize: 10, fontWeight: 'bold', color: '#2D2D2D' } }]
});

// --- Taxa de Avanço entre Etapas ---
initChart('chart-taxa-avanco', {
  tooltip: { trigger: 'item', formatter: function(p) { return p.data.source + ' → ' + p.data.target + '<br/>' + p.value.toLocaleString() + ' empreendedores' + '<br/>Taxa: ' + (p.data.percent || '') + '%'; } },
  series: [{
    type: 'sankey',
    layout: 'none',
    layoutIterations: 0,
    emphasis: { focus: 'adjacency' },
    nodeAlign: 'left',
    nodeWidth: 20,
    nodeGap: 12,
    label: {
      show: true, fontSize: 11, fontWeight: 'bold',
      formatter: function(p) { return p.name + '\n' + p.value.toLocaleString(); }
    },
    lineStyle: { color: 'gradient', curveness: 0.5 },
    data: [
      { name: 'Descoberta', value: 12400, itemStyle: { color: '#80BCFF' } },
      { name: 'Interesse', value: 8200, itemStyle: { color: '#45A1FF' } },
      { name: 'Consideração', value: 5400, itemStyle: { color: '#0080FF' } },
      { name: 'Conversão', value: 3600, itemStyle: { color: '#0060DF' } },
      { name: 'Pós-Venda', value: 2100, itemStyle: { color: '#0045A3' } }
    ],
    links: [
      { source: 'Descoberta', target: 'Interesse', value: 8200, percent: 66 },
      { source: 'Interesse', target: 'Consideração', value: 5400, percent: 55 },
      { source: 'Consideração', target: 'Conversão', value: 3600, percent: 67 },
      { source: 'Conversão', target: 'Pós-Venda', value: 2100, percent: 58 }
    ]
  }]
});

// --- Canais: Share de Disparos (Donut) ---
initChart('chart-canais-volume-share', {
  tooltip: { trigger: 'item', formatter: function(p) { return p.name + '<br/>Volume: ' + p.value.toLocaleString() + ' disparos<br/>Share: ' + p.percent + '%'; } },
  series: [{
    type: 'pie', radius: ['42%', '70%'], center: ['50%', '50%'],
    data: [
      { name: 'WhatsApp', value: 5760000, itemStyle: { color: '#2E7D32' } },
      { name: 'Email', value: 4480000, itemStyle: { color: '#0060DF' } },
      { name: 'SMS', value: 2560000, itemStyle: { color: '#C62828' } }
    ],
    label: { show: true, formatter: '{b}\n{d}%', fontSize: 11, color: '#2D2D2D' },
    emphasis: { itemStyle: { shadowBlur: 6, shadowColor: 'rgba(0,0,0,0.15)' } }
  }]
});

// --- Canais: Evolução Mensal (Stacked Bar) ---
initChart('chart-canais-volume-evol', {
  tooltip: { trigger: 'axis' },
  legend: { bottom: 0, textStyle: { fontSize: 11 } },
  grid: { top: 10, right: 20, bottom: 55, left: 55 },
  xAxis: { type: 'category', data: ['Jan/26', 'Fev/26', 'Mar/26', 'Abr/26', 'Mai/26', 'Jun/26'], axisLabel: { fontSize: 11 } },
  yAxis: { type: 'value', axisLabel: { fontSize: 11, formatter: '{value}K' }, name: 'Disparos (milhares)', nameTextStyle: { fontSize: 10, color: '#5A5A5A' } },
  series: [
    { name: 'WhatsApp', type: 'bar', stack: 'total', data: [1480, 1620, 1750, 1830, 1950, 2100], color: '#2E7D32' },
    { name: 'Email', type: 'bar', stack: 'total', data: [1520, 1480, 1550, 1620, 1580, 1640], color: '#0060DF' },
    { name: 'SMS', type: 'bar', stack: 'total', data: [920, 880, 840, 790, 750, 720], color: '#C62828' }
  ]
});

// --- Canais: Entrega vs Rejeição (Grouped Bar) ---
initChart('chart-canais-entregabilidade', {
  tooltip: { trigger: 'axis' },
  legend: { bottom: 0, textStyle: { fontSize: 11 } },
  grid: { top: 10, right: 20, bottom: 55, left: 55 },
  xAxis: { type: 'category', data: ['Email', 'SMS', 'WhatsApp'], axisLabel: { fontSize: 12 } },
  yAxis: { type: 'value', axisLabel: { fontSize: 11, formatter: '{value}%' }, max: 100 },
  series: [
    { name: 'Taxa de Entrega', type: 'bar', data: [95.2, 88.1, 97.5], color: '#2E7D32' },
    { name: 'Taxa de Rejeição', type: 'bar', data: [4.8, 11.9, 2.5], color: '#C62828' }
  ]
});

// --- Canais: Série Temporal Engajamento (Multi-line) ---
initChart('chart-canais-responsividade', {
  tooltip: { trigger: 'axis' },
  legend: { bottom: 0, textStyle: { fontSize: 11 } },
  grid: { top: 10, right: 20, bottom: 55, left: 50 },
  xAxis: { type: 'category', data: ['Jan/26', 'Fev/26', 'Mar/26', 'Abr/26', 'Mai/26', 'Jun/26'], axisLabel: { fontSize: 11 } },
  yAxis: { type: 'value', axisLabel: { fontSize: 11, formatter: '{value}%' } },
  series: [
    { name: 'Abertura', type: 'line', data: [35.2, 36.8, 36.1, 37.5, 39.0, 38.5], smooth: true, lineStyle: { width: 2.5 }, symbol: 'circle', symbolSize: 6, color: '#0060DF' },
    { name: 'CTR', type: 'line', data: [3.5, 3.8, 3.6, 4.0, 4.5, 4.3], smooth: true, lineStyle: { width: 2.5 }, symbol: 'diamond', symbolSize: 7, color: '#2E7D32' },
    { name: 'CTOR', type: 'line', data: [9.9, 10.3, 10.0, 10.7, 11.5, 11.2], smooth: true, lineStyle: { width: 2.5 }, symbol: 'triangle', symbolSize: 7, color: '#F9A825' }
  ]
});

// --- Canais: Responsividade por Canal (Grouped Bar) ---
initChart('chart-canais-responsividade-canal', {
  tooltip: { trigger: 'axis' },
  legend: { bottom: 0, textStyle: { fontSize: 11 } },
  grid: { top: 10, right: 20, bottom: 55, left: 50 },
  xAxis: { type: 'category', data: ['Email', 'SMS', 'WhatsApp'], axisLabel: { fontSize: 12 } },
  yAxis: { type: 'value', axisLabel: { fontSize: 11, formatter: '{value}%' } },
  series: [
    { name: 'Abertura', type: 'bar', data: [32.1, 18.5, 62.0], color: '#0060DF' },
    { name: 'CTR', type: 'bar', data: [3.2, 1.2, 8.5], color: '#2E7D32' },
    { name: 'CTOR', type: 'bar', data: [10.0, 6.5, 13.7], color: '#F9A825' }
  ]
});

// --- Canais: Funil de Conversão (Stacked Bar / Funnel) ---
initChart('chart-canais-conversao', {
  tooltip: { trigger: 'axis', formatter: function(p) { return p[0].name + ': ' + p[0].value.toLocaleString() + ' (' + (p[0].value / 12800000 * 100).toFixed(1) + '%)'; } },
  grid: { top: 10, right: 20, bottom: 30, left: 100 },
  xAxis: { type: 'value', axisLabel: { fontSize: 11 } },
  yAxis: { type: 'category', data: ['Convertidos', 'Cliques', 'Abertos', 'Entregues', 'Enviados'], axisLabel: { fontSize: 11 }, inverse: true },
  series: [{
    type: 'bar',
    data: [
      { value: 281600, itemStyle: { color: '#2E7D32' } },
      { value: 550400, itemStyle: { color: '#43A047' } },
      { value: 4928000, itemStyle: { color: '#F9A825' } },
      { value: 11878400, itemStyle: { color: '#FB8C00' } },
      { value: 12800000, itemStyle: { color: '#0060DF' } }
    ],
    barWidth: '50%',
    label: { show: true, position: 'right', formatter: function(p) { return p.value.toLocaleString(); }, fontSize: 10, color: '#5A5A5A' }
  }]
});

// --- Canais: Opt-Out por Canal (Bar) ---
initChart('chart-canais-optout', {
  tooltip: { trigger: 'axis', formatter: function(p) { return p[0].name + '<br/>Taxa Opt-Out: ' + p[0].value + '%'; } },
  grid: { top: 10, right: 20, bottom: 30, left: 55 },
  xAxis: { type: 'category', data: ['Jan/26', 'Fev/26', 'Mar/26', 'Abr/26', 'Mai/26', 'Jun/26'], axisLabel: { fontSize: 11 } },
  yAxis: { type: 'value', axisLabel: { fontSize: 11, formatter: '{value}%' } },
  series: [
    { name: 'SMS', type: 'bar', data: [1.4, 1.3, 1.5, 1.2, 1.1, 1.0], color: '#C62828' },
    { name: 'Email', type: 'bar', data: [0.15, 0.12, 0.18, 0.10, 0.14, 0.12], color: '#0060DF' },
    { name: 'WhatsApp', type: 'bar', data: [0.10, 0.08, 0.12, 0.07, 0.09, 0.08], color: '#2E7D32' }
  ]
});

// --- Matriz R×F — Perfil ---
initChart('chart-scatter-perfil', {
  tooltip: { formatter: function(p) { return '<strong>' + p.data[3] + '</strong><br/>R (Recência): ' + p.data[0] + '/5<br/>F (Atividade): ' + p.data[1] + 'x/mês<br/>V (Atendimentos): ' + p.data[2] + '/5'; } },
  grid: { top: 25, right: 30, bottom: 55, left: 55 },
  xAxis: { type: 'value', min: 1, max: 5, axisLabel: { fontSize: 10, formatter: '{value}/5' }, name: 'R — Recência', nameTextStyle: { fontSize: 9, color: '#5A5A5A' } },
  yAxis: { type: 'value', min: 0, max: 8, axisLabel: { fontSize: 10, formatter: '{value}x/mês' }, name: 'F', nameTextStyle: { fontSize: 9, color: '#5A5A5A' } },
  visualMap: { min: 1, max: 5, dimension: 2, orient: 'horizontal', left: 'center', bottom: 0, inRange: { color: ['#E3F0FF', '#80BCFF', '#0080FF', '#0060DF', '#0045A3'] }, text: ['V Alto', 'V Baixo'], textStyle: { fontSize: 8, color: '#5A5A5A' }, itemWidth: 10, itemHeight: 80 },
  series: [{ type: 'scatter', data: [ [4.5, 6.5, 4.2, 'ME'],[3.8, 5.8, 3.8, 'EPP'],[3.2, 4.2, 3.2, 'MEI'],[3.0, 3.5, 2.5, 'Prod. Rural'],[2.5, 2.1, 2.0, 'Informal'] ], encode: { x: [0], y: [1] }, symbolSize: function(d) { return Math.max(12, d[2] * 7); }, label: { show: true, formatter: function(p) { return p.data[3]; }, fontSize: 9, fontWeight: 'bold', color: '#2D2D2D', position: 'right', padding: [0,4] } }]
});

// --- Matriz R×F — Segmento ---
initChart('chart-scatter-segmento', {
  tooltip: { formatter: function(p) { return '<strong>' + p.data[3] + '</strong><br/>R (Recência): ' + p.data[0] + '/5<br/>F (Atividade): ' + p.data[1] + 'x/mês<br/>V (Atendimentos): ' + p.data[2] + '/5'; } },
  grid: { top: 25, right: 30, bottom: 55, left: 55 },
  xAxis: { type: 'value', min: 1, max: 5, axisLabel: { fontSize: 10, formatter: '{value}/5' }, name: 'R — Recência', nameTextStyle: { fontSize: 9, color: '#5A5A5A' } },
  yAxis: { type: 'value', min: 0, max: 8, axisLabel: { fontSize: 10, formatter: '{value}x/mês' }, name: 'F', nameTextStyle: { fontSize: 9, color: '#5A5A5A' } },
  visualMap: { min: 1, max: 5, dimension: 2, orient: 'horizontal', left: 'center', bottom: 0, inRange: { color: ['#E3F0FF', '#80BCFF', '#0080FF', '#0060DF', '#0045A3'] }, text: ['V Alto', 'V Baixo'], textStyle: { fontSize: 8, color: '#5A5A5A' }, itemWidth: 10, itemHeight: 80 },
  series: [{ type: 'scatter', data: [ [4.0, 5.5, 4.2, 'Indústria'],[3.8, 4.5, 3.8, 'Serviço'],[3.5, 3.5, 3.5, 'Comércio'],[3.0, 2.5, 3.0, 'Agronegócio'],[2.5, 2.0, 2.5, 'Turismo'] ], encode: { x: [0], y: [1] }, symbolSize: function(d) { return Math.max(12, d[2] * 7); }, label: { show: true, formatter: function(p) { return p.data[3]; }, fontSize: 9, fontWeight: 'bold', color: '#2D2D2D', position: 'right', padding: [0,4] } }]
});

// --- Matriz R×F — Produto ---
initChart('chart-scatter-produto', {
  tooltip: { formatter: function(p) { return '<strong>' + p.data[3] + '</strong><br/>R (Recência): ' + p.data[0] + '/5<br/>F (Atividade): ' + p.data[1] + 'x/mês<br/>V (Atendimentos): ' + p.data[2] + '/5'; } },
  grid: { top: 25, right: 30, bottom: 55, left: 55 },
  xAxis: { type: 'value', min: 1, max: 5, axisLabel: { fontSize: 10, formatter: '{value}/5' }, name: 'R — Recência', nameTextStyle: { fontSize: 9, color: '#5A5A5A' } },
  yAxis: { type: 'value', min: 0, max: 8, axisLabel: { fontSize: 10, formatter: '{value}x/mês' }, name: 'F', nameTextStyle: { fontSize: 9, color: '#5A5A5A' } },
  visualMap: { min: 1, max: 5, dimension: 2, orient: 'horizontal', left: 'center', bottom: 0, inRange: { color: ['#E3F0FF', '#80BCFF', '#0080FF', '#0060DF', '#0045A3'] }, text: ['V Alto', 'V Baixo'], textStyle: { fontSize: 8, color: '#5A5A5A' }, itemWidth: 10, itemHeight: 80 },
  series: [{ type: 'scatter', data: [ [4.2, 4.8, 4.2, 'Capacitação'],[3.8, 4.2, 3.8, 'Consultoria'],[3.4, 3.5, 3.5, 'Crédito'],[3.0, 3.0, 3.2, 'Cursos'],[2.6, 2.5, 3.0, 'Sol. Digitais'],[2.2, 2.0, 2.5, 'Estruturantes'] ], encode: { x: [0], y: [1] }, symbolSize: function(d) { return Math.max(12, d[2] * 7); }, label: { show: true, formatter: function(p) { return p.data[3]; }, fontSize: 9, fontWeight: 'bold', color: '#2D2D2D', position: 'right', padding: [0,4] } }]
});

// ========== ACCORDION TOGGLE ==========
function toggleAccordion(header) {
  var body = header.nextElementSibling;
  if (!body) return;
  header.classList.toggle('collapsed');
  body.classList.toggle('collapsed');
}

// ========== RESPONSIVE RESIZE ==========
window.addEventListener('resize', function() {
  document.querySelectorAll('.chart-container, .chart-container-sm, .chart-container-lg').forEach(el => {
    const instance = echarts.getInstanceByDom(el);
    if (instance) instance.resize();
  });
});

// ResizeObserver — responsive chart containers
const ro = new ResizeObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.contentRect.width === 0 || entry.contentRect.height === 0) return;
    const instance = echarts.getInstanceByDom(entry.target);
    if (instance) instance.resize();
  });
});
document.querySelectorAll('.chart-container, .chart-container-sm, .chart-container-lg').forEach(function(el) { ro.observe(el); });

// Force resize after load
window.addEventListener('load', function() {
  setTimeout(function() {
    window.dispatchEvent(new Event('resize'));
  }, 200);
});
