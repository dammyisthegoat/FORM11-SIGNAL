/* FORM11 SIGNAL · Self-contained demo dashboard · Fictional sample data */
'use strict';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const pageContent = $('#page-content');
function money(value, decimals = 0) { let currency = 'USD'; try { currency = JSON.parse(localStorage.getItem('signalPrefs') || '{}').currency || 'USD'; } catch (_) {} return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value); }
const number = value => new Intl.NumberFormat('en-US').format(value);
const percent = value => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
const selectedCurrency = () => loadPrefs().currency || 'USD';
const today = new Date('2026-10-17T12:00:00');

const icons = {
  grid: '<rect x="3" y="3" width="7" height="7" rx=".5"/><rect x="14" y="3" width="7" height="7" rx=".5"/><rect x="3" y="14" width="7" height="7" rx=".5"/><rect x="14" y="14" width="7" height="7" rx=".5"/>',
  chart: '<path d="M3 3v18h18"/><path d="m7 14 4-4 3 2 6-7"/><path d="M16 5h4v4"/>',
  receipt: '<path d="M5 3h14v18l-3-2-4 2-4-2-3 2z"/><path d="M8 8h8M8 12h8M8 16h4"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  box: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="M3 8v9l9 5 9-5V8M12 13v9"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.6.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.6-.9l-1.7.6-1.4-2.4L7.5 15a8 8 0 0 1 0-1.9L6.1 12l1.4-2.4 1.7.6a8 8 0 0 1 1.6-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.6.9l1.7-.6 1.4 2.4-1.4 1.1a8 8 0 0 1-.1 1.9Z" transform="translate(-1 -1) scale(1.08)"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="1"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  arrow: '<path d="M7 17 17 7M7 7h10v10"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  filter: '<path d="M4 6h16M7 12h10m-7 6h4"/>',
  close: '<path d="m18 6-12 12M6 6l12 12"/>',
  check: '<path d="m5 12 4 4L19 6"/>'
};
function svgIcon(name, cls = '') { return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.grid}</svg>`; }
function hydrateIcons(root = document) {
  $$('[data-icon]', root).forEach(el => { const name = el.dataset.icon; el.innerHTML = svgIcon(name); });
}

const revenueRanges = {
  '7d': {
    label: 'Last 7 days', dates: ['Oct 11','Oct 12','Oct 13','Oct 14','Oct 15','Oct 16','Oct 17'],
    revenue: [1280, 1540, 1390, 1880, 1735, 2150, 2380], compare: [1190, 1360, 1392, 1583, 1678, 1795, 1922], total: 12355, prior: 10920, orders: 148, avg: 83.48
  },
  '30d': {
    label: 'Last 30 days', dates: ['Sep 18','Sep 21','Sep 24','Sep 27','Sep 30','Oct 3','Oct 6','Oct 9','Oct 12','Oct 15','Oct 17'],
    revenue: [2135,3148,2546,4189,3504,4928,3887,5913,5065,6789,6516], compare: [1987,2747,3010,3419,3185,4179,3741,4588,4822,5202,5290], total: 48620, prior: 42170, orders: 584, avg: 83.25
  },
  '90d': {
    label: 'Last 90 days', dates: ['Jul 20','Jul 29','Aug 7','Aug 16','Aug 25','Sep 3','Sep 12','Sep 21','Sep 30','Oct 9','Oct 17'],
    revenue: [8048,9705,8995,11126,12783,11481,14322,13730,16452,17399,18819], compare: [7838,8866,9251,9893,10536,11307,11692,12977,13748,14776,15546], total: 142860, prior: 126430, orders: 1726, avg: 82.77
  },
  '12m': {
    label: 'Last 12 months', dates: ['Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct'],
    revenue: [29096,31723,29804,34047,36573,35259,40210,43039,42331,46777,45261,49120], compare: [26193,28507,27981,29980,31768,32504,34398,36922,38290,39763,41235,44359], total: 463240, prior: 411900, orders: 5562, avg: 83.29
  }
};
const activeRange = () => $('#range-select')?.value || loadPrefs().period || '30d';

const orders = [
  {id:'SG-10842', customer:'Olivia Bennett', initials:'OB', email:'olivia.b@example.test', date:'17 Oct 2026', iso:'2026-10-17', product:'The Field Notes Set', items:2, amount:86, status:'Processing', channel:'Online store'},
  {id:'SG-10841', customer:'Noah Williams', initials:'NW', email:'noah.w@example.test', date:'17 Oct 2026', iso:'2026-10-17', product:'Studio Ceramic Vessel', items:1, amount:124, status:'Paid', channel:'Direct'},
  {id:'SG-10840', customer:'Amara Johnson', initials:'AJ', email:'amara.j@example.test', date:'16 Oct 2026', iso:'2026-10-16', product:'Everyday Carry Tote', items:3, amount:147, status:'Paid', channel:'Online store'},
  {id:'SG-10839', customer:'Ethan Brooks', initials:'EB', email:'ethan.b@example.test', date:'16 Oct 2026', iso:'2026-10-16', product:'The Field Notes Set', items:1, amount:43, status:'Shipped', channel:'Online store'},
  {id:'SG-10838', customer:'Isla Carter', initials:'IC', email:'isla.c@example.test', date:'15 Oct 2026', iso:'2026-10-15', product:'Soft Form Lamp', items:1, amount:218, status:'Paid', channel:'Partner'},
  {id:'SG-10837', customer:'Liam Foster', initials:'LF', email:'liam.f@example.test', date:'15 Oct 2026', iso:'2026-10-15', product:'Studio Ceramic Vessel', items:2, amount:248, status:'Pending', channel:'Online store'},
  {id:'SG-10836', customer:'Mia Reynolds', initials:'MR', email:'mia.r@example.test', date:'14 Oct 2026', iso:'2026-10-14', product:'Everyday Carry Tote', items:1, amount:49, status:'Refunded', channel:'Direct'},
  {id:'SG-10835', customer:'Lucas Mitchell', initials:'LM', email:'lucas.m@example.test', date:'14 Oct 2026', iso:'2026-10-14', product:'The Field Notes Set', items:4, amount:172, status:'Shipped', channel:'Online store'},
  {id:'SG-10834', customer:'Zara Edwards', initials:'ZE', email:'zara.e@example.test', date:'13 Oct 2026', iso:'2026-10-13', product:'Soft Form Lamp', items:1, amount:218, status:'Paid', channel:'Partner'},
  {id:'SG-10833', customer:'Theo Cooper', initials:'TC', email:'theo.c@example.test', date:'12 Oct 2026', iso:'2026-10-12', product:'Studio Ceramic Vessel', items:1, amount:124, status:'Cancelled', channel:'Online store'},
  {id:'SG-10832', customer:'Grace Parker', initials:'GP', email:'grace.p@example.test', date:'11 Oct 2026', iso:'2026-10-11', product:'Everyday Carry Tote', items:2, amount:98, status:'Shipped', channel:'Direct'},
  {id:'SG-10831', customer:'Aiden Murphy', initials:'AM', email:'aiden.m@example.test', date:'10 Oct 2026', iso:'2026-10-10', product:'The Field Notes Set', items:1, amount:43, status:'Paid', channel:'Online store'}
];
const customers = [
 {name:'Olivia Bennett', initials:'OB', email:'olivia.b@example.test', joined:'12 Feb 2026', orders:12, spend:1248, segment:'Returning'},
 {name:'Noah Williams', initials:'NW', email:'noah.w@example.test', joined:'08 Mar 2026', orders:7, spend:864, segment:'Returning'},
 {name:'Amara Johnson', initials:'AJ', email:'amara.j@example.test', joined:'17 Oct 2026', orders:1, spend:147, segment:'New'},
 {name:'Ethan Brooks', initials:'EB', email:'ethan.b@example.test', joined:'04 Apr 2026', orders:5, spend:512, segment:'Returning'},
 {name:'Isla Carter', initials:'IC', email:'isla.c@example.test', joined:'22 Jan 2026', orders:14, spend:2190, segment:'VIP'},
 {name:'Liam Foster', initials:'LF', email:'liam.f@example.test', joined:'19 Jun 2026', orders:3, spend:366, segment:'Returning'},
 {name:'Mia Reynolds', initials:'MR', email:'mia.r@example.test', joined:'29 Sep 2026', orders:1, spend:49, segment:'New'},
 {name:'Lucas Mitchell', initials:'LM', email:'lucas.m@example.test', joined:'15 Mar 2026', orders:9, spend:1088, segment:'Returning'},
 {name:'Zara Edwards', initials:'ZE', email:'zara.e@example.test', joined:'30 Jul 2026', orders:2, spend:436, segment:'Returning'},
 {name:'Theo Cooper', initials:'TC', email:'theo.c@example.test', joined:'11 Aug 2026', orders:4, spend:341, segment:'Returning'},
 {name:'Grace Parker', initials:'GP', email:'grace.p@example.test', joined:'06 Feb 2026', orders:11, spend:1321, segment:'VIP'},
 {name:'Aiden Murphy', initials:'AM', email:'aiden.m@example.test', joined:'01 Oct 2026', orders:1, spend:43, segment:'New'}
];
const products = [
 {name:'The Field Notes Set', sku:'FN-001', category:'Stationery', price:43, sold:486, stock:82, revenue:20898, tint:'', trend:'+18%'},
 {name:'Studio Ceramic Vessel', sku:'SC-014', category:'Home objects', price:124, sold:293, stock:24, revenue:36332, tint:'clay', trend:'+12%'},
 {name:'Everyday Carry Tote', sku:'ET-006', category:'Accessories', price:49, sold:276, stock:108, revenue:13524, tint:'ink', trend:'+9%'},
 {name:'Soft Form Lamp', sku:'SL-022', category:'Lighting', price:218, sold:141, stock:9, revenue:30738, tint:'clay', trend:'+6%'},
 {name:'Ridge Desk Tray', sku:'RT-009', category:'Home objects', price:68, sold:118, stock:41, revenue:8024, tint:'', trend:'+4%'},
 {name:'Daily Planner, Olive', sku:'DP-003', category:'Stationery', price:32, sold:94, stock:17, revenue:3008, tint:'ink', trend:'−2%'}
];

function pageHeading({eyebrow='BUSINESS INTELLIGENCE', title, desc, actions=''}) {
 return `<div class="page-heading"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p class="page-description">${desc}</p></div><div class="heading-actions">${actions}</div></div>`;
}
function rangeSelect(current = '30d') {
 return `<label class="sr-only" for="range-select">Date range</label><select class="range-select" id="range-select" aria-label="Select date range"><option value="7d" ${current==='7d'?'selected':''}>Last 7 days</option><option value="30d" ${current==='30d'?'selected':''}>Last 30 days</option><option value="90d" ${current==='90d'?'selected':''}>Last 90 days</option><option value="12m" ${current==='12m'?'selected':''}>Last 12 months</option></select>`;
}
function exportButton(label='Export data', extra='') { return `<button class="button-secondary" data-action="${extra || 'export-csv'}">${svgIcon('download')}${label}</button>`; }
function sparkline(values, clay=false) {
 const min=Math.min(...values), max=Math.max(...values), range=max-min || 1;
 const pts=values.map((v,i)=>`${i/(values.length-1)*46},${17-(v-min)/range*14}`).join(' ');
 return `<svg class="kpi-spark" viewBox="0 0 46 19" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="${clay?'var(--clay)':'var(--olive)'}" stroke-width="1.4"/></svg>`;
}
function kpi(label, value, delta, foot, idx, points, negative=false) {
 return `<article class="kpi"><div class="kpi-top"><span>${label}</span><span class="kpi-index">0${idx}</span></div><div class="kpi-value">${value}</div><div class="kpi-meta"><span class="delta ${negative?'negative':''}">${delta}</span><span>${foot}</span>${sparkline(points, negative)}</div></article>`;
}
function makeChartSvg(rangeKey='30d', height=210) {
 const d = revenueRanges[rangeKey] || revenueRanges['30d'];
 const w=710, h=height, left=39, right=8, top=8, bottom=25;
 const plotW=w-left-right, plotH=h-top-bottom;
 const max=Math.ceil(Math.max(...d.revenue,...d.compare)/500)*500;
 const axisSymbol = ({NGN:'₦',GBP:'£',EUR:'€',USD:'$'}[selectedCurrency()] || selectedCurrency()+' ');
 const x=i=>left+(i/(d.revenue.length-1))*plotW;
 const y=v=>top+plotH-(v/max)*plotH;
 const line=arr=>arr.map((v,i)=>`${i===0?'M':'L'} ${x(i).toFixed(2)} ${y(v).toFixed(2)}`).join(' ');
 const area=`${line(d.revenue)} L ${x(d.revenue.length-1)} ${top+plotH} L ${x(0)} ${top+plotH} Z`;
 const ticks=[0,.25,.5,.75,1];
 const grid=ticks.map(t=>{let yy=top+plotH-plotH*t; return `<line class="chart-gridline" x1="${left}" y1="${yy}" x2="${w-right}" y2="${yy}"/><text class="chart-axis-label" x="0" y="${yy+3}">${t===0?`${axisSymbol}0`:`${axisSymbol}${Math.round(max*t/1000*10)/10}k`}</text>`}).join('');
 const stride=d.dates.length>8?Math.ceil(d.dates.length/6):1;
 const labels=d.dates.map((date,i)=> (i%stride===0||i===d.dates.length-1) ? `<text class="chart-axis-label" text-anchor="${i===0?'start':i===d.dates.length-1?'end':'middle'}" x="${x(i)}" y="${h-5}">${date}</text>` : '').join('');
 const points=d.revenue.map((v,i)=>`<circle class="chart-point" tabindex="0" role="img" aria-label="${d.dates[i]} revenue ${money(v)}" data-index="${i}" data-revenue="${v}" data-compare="${d.compare[i]}" data-date="${d.dates[i]}" cx="${x(i)}" cy="${y(v)}" r="2.8"/>`).join('');
 return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img" aria-label="Revenue line chart for ${d.label}"><defs><linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#7e8a67" stop-opacity=".19"/><stop offset="100%" stop-color="#7e8a67" stop-opacity="0"/></linearGradient></defs>${grid}<line class="chart-guide" x1="0" y1="${top}" x2="0" y2="${top+plotH}"/><path class="chart-area" d="${area}"/><path class="chart-line secondary" d="${line(d.compare)}"/><path class="chart-line" d="${line(d.revenue)}"/>${points}${labels}</svg>`;
}
function chartBlock(rangeKey, compact=false) {
 const d=revenueRanges[rangeKey]||revenueRanges['30d'];
 return `<div class="chart-frame" data-chart-frame>${makeChartSvg(rangeKey, compact?190:207)}<div class="chart-tooltip" data-chart-tooltip><small></small><b></b><span></span></div></div>`;
}
function wireCharts() {
 $$('[data-chart-frame]').forEach(frame => {
   const tooltip=$('[data-chart-tooltip]',frame); const svg=$('svg',frame);
   if (!tooltip || !svg) return;
   const show = point => {
     const d = point.dataset; const rect=frame.getBoundingClientRect();
     const vb=svg.viewBox.baseVal; const sx=svg.getBoundingClientRect().width/vb.width; const sy=svg.getBoundingClientRect().height/vb.height;
     const cx=Number(point.getAttribute('cx'))*sx + svg.getBoundingClientRect().left - rect.left;
     const cy=Number(point.getAttribute('cy'))*sy + svg.getBoundingClientRect().top - rect.top;
     tooltip.style.left=`${Math.max(65,Math.min(rect.width-65,cx))}px`; tooltip.style.top=`${Math.max(40,cy-2)}px`; tooltip.style.opacity='1';
     $('small',tooltip).textContent=d.date; $('b',tooltip).textContent=money(Number(d.revenue)); $('span',tooltip).textContent=`Prior period ${money(Number(d.compare))}`;
   };
   $$('[data-index]',svg).forEach(point=>{
     point.addEventListener('pointerenter',()=>show(point)); point.addEventListener('focus',()=>show(point));
     point.addEventListener('pointerleave',()=>tooltip.style.opacity='0'); point.addEventListener('blur',()=>tooltip.style.opacity='0');
   });
 });
}
function statusClass(status) { return status.toLowerCase().replace(/\s+/g,'-'); }
function renderOrderRows(list) {
 if(!list.length) return `<tr><td colspan="7"><div class="table-empty">No orders match this search. Try another name or filter.</div></td></tr>`;
 return list.map(o=>`<tr data-order-id="${o.id}" tabindex="0"><td><span class="order-id">${o.id}</span></td><td>${o.customer}</td><td>${o.date}</td><td>${o.items} item${o.items!==1?'s':''}</td><td class="amount">${money(o.amount)}</td><td><span class="status ${statusClass(o.status)}">${o.status}</span></td><td>${o.channel}</td></tr>`).join('');
}
function overviewPage() {
 const range=activeRange(), d=revenueRanges[range];
 const orderSlice=orders.slice(0,4);
 return `${pageHeading({eyebrow:'SATURDAY, 17 OCTOBER 2026  /  OVERVIEW',title:'A clearer view of <em>business.</em>',desc:'The numbers behind the work. A considered snapshot of how your store is moving.',actions:`${rangeSelect(range)}<button class="button-primary" data-action="export-summary">${svgIcon('download')} Download snapshot</button>`})}
 <div class="kpi-grid">${kpi('Gross revenue',money(d.total),percent((d.total/d.prior-1)*100),'vs previous period',1,[3,5,4,8,6,9,10])}${kpi('Orders placed',number(d.orders),'+12.8%','vs previous period',2,[2,3,5,4,7,8,9])}${kpi('Average order value',money(d.avg,2),'+3.4%','vs previous period',3,[3,3,4,5,4,6,7])}${kpi('Returning customers','38.6%','+4.2 pts','of all customers',4,[2,5,4,5,7,7,9])}</div>
 <div class="dashboard-grid">
   <section class="panel chart-panel"><div class="panel-topline"><div><div class="section-kicker">PERFORMANCE / 01</div><h2>Revenue, at a glance</h2><p class="panel-subtext">A steady read on the numbers that move the business.</p></div><button class="text-link" data-navigate="analytics">Full analysis ↗</button></div>
    <div class="chart-metrics"><strong class="chart-total">${money(d.total)}</strong><span class="chart-comparison">${percent((d.total/d.prior-1)*100)} <span style="color:var(--muted)">against prior period</span></span><div class="chart-legend"><span class="legend-item"><i class="legend-dot"></i>Current</span><span class="legend-item previous"><i class="legend-dot clay"></i>Previous</span></div></div>
    ${chartBlock(range)}<div class="chart-foot"><span>PERIOD <b>${d.label.toUpperCase()}</b></span><span>VALUES IN <b>${selectedCurrency()}</b></span><span>FICTIONAL SAMPLE <b>·</b> STATIC DEMO</span></div>
   </section>
   <aside class="right-stack"><div class="insight-heading"><div><div class="section-kicker">SIGNAL / 01</div><h2>What stands out</h2></div><span class="insight-mark">✳</span></div>
    <p class="insight-lead">Revenue is moving in the right direction. <em>Repeat customers</em> are doing more of the heavy lifting.</p>
    <div class="insight-data"><span class="insight-glyph">↗</span><div class="insight-data-copy"><b>Returning customer share</b><small>Up 4.2 percentage points</small></div><span class="insight-data-value">38.6%</span></div>
    <div class="insight-data"><span class="insight-glyph clay-glyph">↗</span><div class="insight-data-copy"><b>Best-performing category</b><small>Home objects · sample store</small></div><span class="insight-data-value">+16%</span></div>
    <div class="insight-data"><span class="insight-glyph">↘</span><div class="insight-data-copy"><b>Inventory to watch</b><small>Soft Form Lamp</small></div><span class="insight-data-value">9 left</span></div>
    <div class="insight-bottom"><p><strong>Keep the picture in focus.</strong>Explore the full revenue breakdown and its contributing channels.</p><button class="icon-button insight-arrow" data-navigate="analytics" aria-label="Open analytics">↗</button></div>
   </aside>
 </div>
 <div class="lower-grid"><section class="panel"><div class="table-head"><div><div class="section-kicker">RECENT ACTIVITY / 02</div><h2>Latest orders</h2></div><button class="text-link" data-navigate="orders">All orders ↗</button></div><div class="order-table-wrap"><table class="data-table"><thead><tr><th>ORDER</th><th>CUSTOMER</th><th>DATE</th><th>ITEMS</th><th>TOTAL</th><th>STATUS</th></tr></thead><tbody>${orderSlice.map(o=>`<tr data-order-id="${o.id}" tabindex="0"><td><span class="order-id">${o.id}</span></td><td>${o.customer}</td><td>${o.date.replace(' 2026','')}</td><td>${o.items}</td><td class="amount">${money(o.amount)}</td><td><span class="status ${statusClass(o.status)}">${o.status}</span></td></tr>`).join('')}</tbody></table></div><div class="page-endline"><span>Showing 4 of 584 sample orders</span><span>Sample snapshot <b>·</b> Oct 2026</span></div></section>
 <section class="panel product-insights"><div class="section-kicker">PRODUCT NOTES / 03</div><h2>Quiet bestsellers</h2><p class="panel-subtext">Products earning their shelf space.</p>
 ${products.slice(0,3).map(p=>`<div class="product-row"><span class="product-art ${p.tint==='clay'?'art-clay':p.tint==='ink'?'art-ink':''}"></span><div class="product-row-copy"><b>${p.name}</b><small>${number(p.sold)} units sold</small></div><div class="product-row-value">${money(p.revenue)}<small>${p.trend}</small></div></div>`).join('')}
 <div class="page-endline"><span>Top 3 by revenue</span><button class="text-link" data-navigate="products">All products ↗</button></div></section></div>`;
}
function analyticsPage() {
 const range=activeRange(), d=revenueRanges[range];
 return `${pageHeading({eyebrow:'ANALYSIS / REVENUE',title:'Follow the <em>signal.</em>',desc:'See where revenue is coming from, how it compares, and what deserves a closer look.',actions:`${rangeSelect(range)}${exportButton('Export report','export-revenue')}`})}
 <div class="metric-strip"><div class="metric"><label>Revenue in period</label><strong>${money(d.total)}</strong><small><span class="delta">${percent((d.total/d.prior-1)*100)}</span> versus previous period</small></div><div class="metric"><label>Orders completed</label><strong>${number(d.orders)}</strong><small>Across 3 fictional sales channels</small></div><div class="metric"><label>Average order value</label><strong>${money(d.avg,2)}</strong><small>+3.4% against previous period</small></div></div>
 <div class="analytics-grid"><section class="analytics-main-chart"><div class="panel-topline"><div><div class="section-kicker">REVENUE TREND / 01</div><h2>Revenue over time</h2><p class="panel-subtext">Current period set against the period before it.</p></div><div class="chart-legend"><span class="legend-item"><i class="legend-dot"></i>Current</span><span class="legend-item previous"><i class="legend-dot clay"></i>Previous</span></div></div><div class="chart-metrics"><strong class="chart-total">${money(d.total)}</strong><span class="chart-comparison">${percent((d.total/d.prior-1)*100)} <span style="color:var(--muted)">period-on-period</span></span></div>${chartBlock(range)}<div class="chart-foot"><span>RANGE <b>${d.label.toUpperCase()}</b></span><span>DISPLAY <b>${selectedCurrency()}</b></span></div></section>
 <aside class="source-panel"><div class="section-kicker">REVENUE MIX / 02</div><h2>Where it comes from</h2><p class="panel-subtext">Contribution by attributed sales channel.</p><div class="donut-wrap"><div class="donut"><div class="donut-label"><strong>${money(d.total)}</strong><small>total revenue</small></div></div></div><div class="source-row"><i class="source-swatch"></i><span>Online store</span><strong>42%</strong></div><div class="source-row"><i class="source-swatch s2"></i><span>Direct sales</span><strong>25%</strong></div><div class="source-row"><i class="source-swatch s3"></i><span>Partners</span><strong>17%</strong></div><div class="source-row"><i class="source-swatch s4"></i><span>Other</span><strong>16%</strong></div></aside></div>
 <section class="content-section"><div class="section-title-row"><div><div class="section-kicker">READOUT / 03</div><h2>Three things worth knowing</h2><p>Interpretation for this fictional sample period, not a forecast.</p></div></div><div class="report-grid"><article class="report-card" style="min-height:190px"><div class="report-card-top"><span>01 / MOMENTUM</span><span class="report-icon">↗</span></div><h2>Revenue is up</h2><p>Gross revenue is ${percent((d.total/d.prior-1)*100)} compared with the previous period. Keep an eye on whether order volume sustains the lift.</p></article><article class="report-card" style="min-height:190px"><div class="report-card-top"><span>02 / VALUE</span><span class="report-icon">◎</span></div><h2>Baskets are growing</h2><p>Average order value is ${money(d.avg,2)}. Product pairing and merchandising could be useful things to examine next.</p></article><article class="report-card" style="min-height:190px"><div class="report-card-top"><span>03 / MIX</span><span class="report-icon">⌁</span></div><h2>One main channel</h2><p>Online store accounts for 42% of attributed revenue in this example. Diversification may help reduce dependence on one channel.</p></article></div></section>`;
}
function ordersPage() {
 return `${pageHeading({eyebrow:'OPERATIONS / ORDERS',title:'Every order has <em>a story.</em>',desc:'Keep fulfilment moving and follow each purchase from the first click to the front door.',actions:`${exportButton('Export CSV')}`})}
 <div class="metric-strip"><div class="metric"><label>Total orders in sample</label><strong>584</strong><small>Last 30 days</small></div><div class="metric"><label>Awaiting action</label><strong>08</strong><small>Pending or processing</small></div><div class="metric"><label>Average order value</label><strong>${money(83.25,2)}</strong><small>Across all sample orders</small></div></div>
 <section class="content-section" style="margin-top:0"><div class="section-title-row"><div><div class="section-kicker">ORDER REGISTER / 01</div><h2>All orders</h2><p>Fictional transactions for interface demonstration.</p></div><div class="toolbar"><label class="search-field">${svgIcon('search')}<input id="table-search" type="search" placeholder="Search orders or customers…" aria-label="Search orders" /></label><label class="sr-only" for="status-filter">Filter status</label><select class="filter-select" id="status-filter"><option value="all">All statuses</option><option>Paid</option><option>Processing</option><option>Pending</option><option>Shipped</option><option>Refunded</option><option>Cancelled</option></select></div></div><div class="table-shell"><table class="data-table"><thead><tr><th>ORDER ID</th><th>CUSTOMER</th><th>DATE</th><th>ITEMS</th><th>TOTAL</th><th>STATUS</th><th>CHANNEL</th></tr></thead><tbody id="orders-tbody">${renderOrderRows(orders)}</tbody></table><div class="table-footer"><span id="table-count">Showing ${orders.length} sample orders</span><span>Search and filters update this list</span></div></div></section>`;
}
function customersPage() {
 const total=customers.reduce((s,c)=>s+c.spend,0);
 return `${pageHeading({eyebrow:'RELATIONSHIPS / CUSTOMERS',title:'Know the people <em>behind the numbers.</em>',desc:'A useful customer overview starts with the relationships, not just the transactions.',actions:exportButton('Export customers')})}
 <div class="metric-strip"><div class="metric"><label>Customers shown</label><strong>${customers.length}</strong><small>Fictional sample directory</small></div><div class="metric"><label>Returning customers</label><strong>${customers.filter(c=>c.segment==='Returning'||c.segment==='VIP').length}</strong><small>More than one purchase</small></div><div class="metric"><label>Sample lifetime spend</label><strong>${money(total)}</strong><small>Across listed customers</small></div></div>
 <section class="content-section" style="margin-top:0"><div class="section-title-row"><div><div class="section-kicker">CUSTOMER DIRECTORY / 01</div><h2>A closer connection</h2><p>Search names, explore customer segments, and review purchase history.</p></div><div class="toolbar"><label class="search-field">${svgIcon('search')}<input id="table-search" type="search" placeholder="Search customers…" aria-label="Search customers" /></label><select id="segment-filter" class="filter-select" aria-label="Filter by customer segment"><option value="all">All segments</option><option>New</option><option>Returning</option><option>VIP</option></select></div></div>
 <div class="table-shell"><table class="data-table"><thead><tr><th>CUSTOMER</th><th>JOINED</th><th>ORDERS</th><th>LIFETIME SPEND</th><th>SEGMENT</th><th>LAST KNOWN EMAIL</th></tr></thead><tbody id="customers-tbody">${renderCustomerRows(customers)}</tbody></table><div class="table-footer"><span id="table-count">${customers.length} fictional customers shown</span><span>Fictional sample records</span></div></div></section>`;
}
function renderCustomerRows(list) {
 if(!list.length) return `<tr><td colspan="6"><div class="table-empty">No customers match this search.</div></td></tr>`;
 return list.map((c,i)=>`<tr data-customer="${c.name}" tabindex="0"><td><span class="customer-cell"><i class="mini-avatar ${i%4?`c${(i%4)+1}`:''}">${c.initials}</i><span><b>${c.name}</b><small>${c.initials.toLowerCase()} · customer</small></span></span></td><td>${c.joined}</td><td>${c.orders}</td><td class="amount">${money(c.spend)}</td><td><span class="status ${c.segment==='VIP'?'paid':c.segment==='New'?'pending':''}">${c.segment}</span></td><td>${c.email}</td></tr>`).join('');
}
function renderProductRows(list) {
 if(!list.length) return `<tr><td colspan="7"><div class="table-empty">No products match this search.</div></td></tr>`;
 return list.map(p=>`<tr data-product="${p.name}" tabindex="0"><td><span class="product-name-cell"><i class="product-thumb ${p.tint}"></i><span><b>${p.name}</b><small style="display:block;color:#929386;font-size:9px;margin-top:4px;font-weight:400">${p.sku}</small></span></span></td><td>${p.category}</td><td class="amount">${money(p.price)}</td><td>${number(p.sold)}</td><td class="amount">${money(p.revenue)}</td><td><span class="inventory-bar ${p.stock<15?'low':''}"><span style="width:${Math.min(100,p.stock/120*100)}%"></span></span>${p.stock} units</td><td><span class="status ${p.stock<15?'pending':''}">${p.stock<15?'Low stock':'In stock'}</span></td></tr>`).join('');
}
function productsPage() {
 const total=products.reduce((s,p)=>s+p.revenue,0);
 return `${pageHeading({eyebrow:'CATALOGUE / PRODUCTS',title:'Make room for <em>what works.</em>',desc:'Product performance, sales contribution, and a small nudge when inventory needs attention.',actions:exportButton('Export catalogue')})}
 <div class="metric-strip"><div class="metric"><label>Products in catalogue</label><strong>${products.length}</strong><small>Across 4 sample categories</small></div><div class="metric"><label>Combined gross sales</label><strong>${money(total)}</strong><small>Gross sample sales by product</small></div><div class="metric"><label>Stock alerts</label><strong>${products.filter(p=>p.stock<15).length.toString().padStart(2,'0')}</strong><small>Less than 15 units on hand</small></div></div>
 <section class="content-section" style="margin-top:0"><div class="section-title-row"><div><div class="section-kicker">PRODUCT REGISTER / 01</div><h2>The catalogue</h2><p>Inventory and performance for six fictional products.</p></div><div class="toolbar"><label class="search-field">${svgIcon('search')}<input id="table-search" type="search" placeholder="Search products…" aria-label="Search products" /></label><select class="filter-select" id="stock-filter" aria-label="Filter product stock"><option value="all">All stock levels</option><option value="low">Low stock</option><option value="available">In stock</option></select></div></div>
 <div class="table-shell"><table class="data-table"><thead><tr><th>PRODUCT</th><th>CATEGORY</th><th>PRICE</th><th>UNITS SOLD</th><th>GROSS SALES</th><th>ON HAND</th><th>STATUS</th></tr></thead><tbody id="products-tbody">${renderProductRows(products)}</tbody></table><div class="table-footer"><span id="table-count">${products.length} products shown</span><span>Fictional sample records</span></div></div></section>`;
}
function reportsPage() {
 return `${pageHeading({eyebrow:'INTELLIGENCE / REPORTS',title:'The detail behind <em>the direction.</em>',desc:'Useful snapshots for reviews, planning, and the questions worth asking next.',actions:exportButton('Export snapshot','export-summary')})}
 <div class="metric-strip"><div class="metric"><label>Available report views</label><strong>03</strong><small>Curated sample report types</small></div><div class="metric"><label>Most recent period</label><strong style="font-size:23px">Oct 2026</strong><small>Up to 17 October in this concept</small></div><div class="metric"><label>Data status</label><strong style="font-size:23px;color:var(--olive-dark)">Illustrative</strong><small>Not connected to a live store</small></div></div>
 <section class="content-section" style="margin-top:0"><div class="section-title-row"><div><div class="section-kicker">REPORT LIBRARY / 01</div><h2>Choose your perspective</h2><p>Each report can be explored in the interface or exported as a CSV.</p></div></div><div class="report-grid">
 <article class="report-card"><div class="report-card-top"><span>REPORT 01 / FINANCE</span><span class="report-icon">↗</span></div><h2>Revenue &amp; growth</h2><p>Period comparisons, revenue trend, order volume, average order value and channel contribution.</p><div class="report-card-bottom"><span>Four date ranges</span><button data-action="open-revenue">Open report ↗</button></div></article>
 <article class="report-card"><div class="report-card-top"><span>REPORT 02 / COMMERCE</span><span class="report-icon">▤</span></div><h2>Order register</h2><p>Order IDs, customers, fulfilment state, sales channel, items and transaction totals.</p><div class="report-card-bottom"><span>Sample order set</span><button data-action="export-orders">Download CSV ↗</button></div></article>
 <article class="report-card"><div class="report-card-top"><span>REPORT 03 / CUSTOMER</span><span class="report-icon">◎</span></div><h2>Customer overview</h2><p>Customer segments, purchase frequency, lifetime spend and the shape of retention.</p><div class="report-card-bottom"><span>Customer directory</span><button data-action="export-customers">Download CSV ↗</button></div></article>
 </div></section><section class="content-section"><div class="section-title-row"><div><div class="section-kicker">REPORT NOTES / 02</div><h2>Use the numbers thoughtfully</h2><p>Every figure in SIGNAL is generated for demonstration, not sourced from a real company.</p></div></div><div class="insight-data"><span class="insight-glyph">i</span><div class="insight-data-copy"><b>No live integrations</b><small>There are no connected accounts, external analytics APIs, or background syncs in this project.</small></div></div><div class="insight-data"><span class="insight-glyph">↗</span><div class="insight-data-copy"><b>Exports are real files</b><small>CSV downloads are generated locally in your browser from the sample records you can see.</small></div></div></section>`;
}
function settingsPage() {
 let prefs={}; try { prefs=JSON.parse(localStorage.getItem('signalPrefs')||'{}'); } catch (_) {}
 const name=prefs.name||'Alex Morgan', email=prefs.email||'alex@signal.demo', currency=prefs.currency||'USD', period=prefs.period||'30d';
 return `${pageHeading({eyebrow:'PREFERENCES / WORKSPACE',title:'Make SIGNAL <em>yours.</em>',desc:'A few considered preferences to make this sample workspace feel like your own.',actions:''})}
 <div class="settings-layout"><nav class="settings-tabs" aria-label="Settings sections"><button class="settings-tab active" data-settings-tab="general">General</button><button class="settings-tab" data-settings-tab="display">Display &amp; data</button><button class="settings-tab" data-settings-tab="notifications">Notifications</button><button class="settings-tab" data-settings-tab="about">About SIGNAL</button></nav>
 <div class="settings-panel" id="settings-panel"><h2>Workspace details</h2><p>These preferences are saved locally in this browser. They do not change a remote account or real business data.</p>
 <div class="settings-form-row"><label for="pref-name">Workspace owner<small>Name shown in the top navigation.</small></label><input class="field-input" id="pref-name" value="${escapeHtml(name)}" /></div>
 <div class="settings-form-row"><label for="pref-email">Email address<small>For this local demo only.</small></label><input class="field-input" id="pref-email" type="email" value="${escapeHtml(email)}" /></div>
 <div class="settings-form-row"><label for="pref-currency">Display currency<small>Changes the display label only; no conversion is applied.</small></label><select class="field-input field-select" id="pref-currency"><option value="USD" ${currency==='USD'?'selected':''}>USD · US Dollar</option><option value="GBP" ${currency==='GBP'?'selected':''}>GBP · Pound Sterling</option><option value="EUR" ${currency==='EUR'?'selected':''}>EUR · Euro</option><option value="NGN" ${currency==='NGN'?'selected':''}>NGN · Nigerian Naira</option></select></div>
 <div class="settings-form-row"><label for="pref-period">Default date range<small>Starting period for analytics pages.</small></label><select class="field-input field-select" id="pref-period"><option value="7d" ${period==='7d'?'selected':''}>Last 7 days</option><option value="30d" ${period==='30d'?'selected':''}>Last 30 days</option><option value="90d" ${period==='90d'?'selected':''}>Last 90 days</option><option value="12m" ${period==='12m'?'selected':''}>Last 12 months</option></select></div>
 <div class="form-actions"><button class="button-primary" data-action="save-settings">Save preferences ${svgIcon('check')}</button></div></div></div>`;
}
function escapeHtml(str) { return String(str).replace(/[&<>"']/g, ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
const renderers={overview:overviewPage,analytics:analyticsPage,orders:ordersPage,customers:customersPage,products:productsPage,reports:reportsPage,settings:settingsPage};
const pageNames={overview:'Overview',analytics:'Revenue analytics',orders:'Orders',customers:'Customers',products:'Products',reports:'Reports',settings:'Settings'};
let currentPage='overview';
function navigate(page, updateHash=true) {
 if (!renderers[page]) page='overview';
 currentPage=page;
 if (updateHash && location.hash!==`#${page}`) history.pushState({page},'',`#${page}`);
 $$('.nav-link[data-page]').forEach(a=>{const active=a.dataset.page===page;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 $('#breadcrumb-current').textContent=pageNames[page]; $('#footer-page').textContent=page.toUpperCase();
 pageContent.innerHTML=renderers[page](); pageContent.style.animation='none'; void pageContent.offsetHeight; pageContent.style.animation='';
 hydrateIcons(pageContent); wireCharts(); bindPageEvents(); closeSidebar();
 window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
}
function showToast(title, detail='This is a local demonstration action.') {
 const region=$('#toast-region'); const node=document.createElement('div'); node.className='toast'; node.innerHTML=`<span class="toast-mark">✳</span><span><b>${escapeHtml(title)}</b><small>${escapeHtml(detail)}</small></span>`; region.appendChild(node);
 window.setTimeout(()=>{node.style.opacity='0';node.style.transform='translateY(5px)';window.setTimeout(()=>node.remove(),240);},3300);
}
function csvDownload(filename, rows) {
 const text=rows.map(row=>row.map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(',')).join('\r\n');
 const blob=new Blob(['\ufeff'+text],{type:'text/csv;charset=utf-8;'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url;a.download=filename;a.style.display='none';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
 showToast('Export prepared',`${filename} was generated from the sample data in your browser.`);
}
function exportOrders(list=orders) { csvDownload('signal-orders-demo.csv',[['Order ID','Customer','Email','Date','Product','Items',`Amount ${selectedCurrency()}`,'Status','Channel'],...list.map(o=>[o.id,o.customer,o.email,o.date,o.product,o.items,o.amount,o.status,o.channel])]); }
function exportCustomers(list=customers) { csvDownload('signal-customers-demo.csv',[['Customer','Email','Joined','Orders',`Lifetime spend ${selectedCurrency()}`,'Segment'],...list.map(c=>[c.name,c.email,c.joined,c.orders,c.spend,c.segment])]); }
function exportProducts(list=products) { csvDownload('signal-products-demo.csv',[['Product','SKU','Category',`Price ${selectedCurrency()}`,'Units sold','Stock',`Gross sales ${selectedCurrency()}`],...list.map(p=>[p.name,p.sku,p.category,p.price,p.sold,p.stock,p.revenue])]); }
function exportRevenue() { const d=revenueRanges[activeRange()];csvDownload(`signal-revenue-${activeRange()}-demo.csv`,[['Date',`Current revenue ${selectedCurrency()}`,`Previous period ${selectedCurrency()}`],...d.dates.map((date,i)=>[date,d.revenue[i],d.compare[i]])]); }
function exportSummary() { const d=revenueRanges[activeRange()];csvDownload(`signal-snapshot-${activeRange()}-demo.csv`,[['Metric','Value'],['Period',d.label],[`Gross revenue ${selectedCurrency()}`,d.total],[`Prior period revenue ${selectedCurrency()}`,d.prior],['Orders',d.orders],[`Average order value ${selectedCurrency()}`,d.avg],['Data status','Fictional sample data']]); }
function openDetailModal(title, kicker, rows) {
 const root=$('#modal-root');
 root.innerHTML=`<div class="modal-backdrop" data-modal-backdrop><section class="detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-modal-title"><header class="modal-header"><div><span class="section-kicker">${escapeHtml(kicker)}</span><h2 id="detail-modal-title">${escapeHtml(title)}</h2><p>Record details from the fictional SIGNAL sample workspace.</p></div><button class="modal-close" data-close-modal aria-label="Close details">${svgIcon('close')}</button></header><div class="modal-body">${rows.map(([label,value])=>`<div class="modal-field"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join('')}</div><footer class="modal-footer"><span class="modal-note">ILLUSTRATIVE SAMPLE RECORD</span><button class="button-secondary" data-close-modal>Close details</button></footer></section></div>`;
 const close=$('[data-close-modal]',root); close?.focus();
}
function openOrder(id) { const o=orders.find(order=>order.id===id); if(!o)return; openDetailModal(o.id,'ORDER DETAIL',[['Customer',o.customer],['Email',o.email],['Placed',o.date],['Product',o.product],['Items',String(o.items)],['Order total',money(o.amount)],['Status',o.status],['Sales channel',o.channel]]); }
function openCustomer(name) { const c=customers.find(customer=>customer.name===name); if(!c)return; openDetailModal(c.name,'CUSTOMER PROFILE',[['Email',c.email],['Customer since',c.joined],['Orders placed',String(c.orders)],['Lifetime spend',money(c.spend)],['Segment',c.segment]]); }
function openProduct(name) { const p=products.find(product=>product.name===name); if(!p)return; openDetailModal(p.name,'PRODUCT DETAIL',[['SKU',p.sku],['Category',p.category],['Unit price',money(p.price)],['Units sold',number(p.sold)],['Gross sales',money(p.revenue)],['Stock on hand',`${p.stock} units`],['Inventory status',p.stock<15?'Low stock':'In stock']]); }
function closeDetailModal() { $('#modal-root').innerHTML=''; }

function filterCurrentTable() {
 const search=$('#table-search')?.value.trim().toLowerCase()||'';
 if(currentPage==='orders') {
   const status=$('#status-filter')?.value||'all'; const list=orders.filter(o=>(status==='all'||o.status===status)&&[o.id,o.customer,o.email,o.product,o.channel].some(v=>v.toLowerCase().includes(search)));
   $('#orders-tbody').innerHTML=renderOrderRows(list); $('#table-count').textContent=`Showing ${list.length} of ${orders.length} sample orders`; bindTableRows();
 } else if(currentPage==='customers') {
   const segment=$('#segment-filter')?.value||'all';const list=customers.filter(c=>(segment==='all'||c.segment===segment)&&[c.name,c.email,c.segment].some(v=>v.toLowerCase().includes(search)));
   $('#customers-tbody').innerHTML=renderCustomerRows(list);$('#table-count').textContent=`${list.length} of ${customers.length} fictional customers shown`;
 } else if(currentPage==='products') {
   const stock=$('#stock-filter')?.value||'all';const list=products.filter(p=>(stock==='all'||(stock==='low'?p.stock<15:p.stock>=15))&&[p.name,p.sku,p.category].some(v=>v.toLowerCase().includes(search)));
   $('#products-tbody').innerHTML=renderProductRows(list);$('#table-count').textContent=`${list.length} of ${products.length} products shown`;
 }
}
function bindTableRows() {
 $$('[data-order-id]').forEach(row=>{row.onclick=()=>openOrder(row.dataset.orderId);row.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openOrder(row.dataset.orderId);}};});
}
function bindPageEvents() {
 $('#range-select')?.addEventListener('change',e=>{ const value=e.target.value; if(currentPage==='overview'||currentPage==='analytics') { navigate(currentPage,false); const sel=$('#range-select'); if(sel)sel.value=value; /* preserve the chosen range while repainting */ renderRange(value); } });
 $('#table-search')?.addEventListener('input',filterCurrentTable);
 $('#status-filter')?.addEventListener('change',filterCurrentTable);
 $('#segment-filter')?.addEventListener('change',filterCurrentTable);
 $('#stock-filter')?.addEventListener('change',filterCurrentTable);
 bindTableRows();
 $$('[data-settings-tab]').forEach(btn=>btn.addEventListener('click',()=>renderSettingsTab(btn.dataset.settingsTab)));
}
function renderRange(value) {
 // Keep the selected range as an explicit state shared between chart and export actions.
 const select=$('#range-select'); if(select) select.value=value;
 if(currentPage==='overview') {
   const d=revenueRanges[value];
   const total=$('.chart-total'); if(total) total.textContent=money(d.total);
   const comp=$('.chart-comparison'); if(comp) comp.innerHTML=`${percent((d.total/d.prior-1)*100)} <span style="color:var(--muted)">against prior period</span>`;
   const frame=$('[data-chart-frame]'); if(frame){frame.innerHTML=`${makeChartSvg(value,207)}<div class="chart-tooltip" data-chart-tooltip><small></small><b></b><span></span></div>`;wireCharts();}
   // Refresh the four headline values and labels using the freshly selected range.
   const vals=$$('.kpi-value'); if(vals.length>=3){ vals[0].textContent=money(d.total);vals[1].textContent=number(d.orders);vals[2].textContent=money(d.avg,2); }
 } else if(currentPage==='analytics') {
   const d=revenueRanges[value]; const metrics=$$('.metric strong'); if(metrics.length>=3){metrics[0].textContent=money(d.total);metrics[1].textContent=number(d.orders);metrics[2].textContent=money(d.avg,2);}
   const total=$('.chart-total');if(total)total.textContent=money(d.total);const comp=$('.chart-comparison');if(comp)comp.innerHTML=`${percent((d.total/d.prior-1)*100)} <span style="color:var(--muted)">period-on-period</span>`;
   const frame=$('[data-chart-frame]');if(frame){frame.innerHTML=`${makeChartSvg(value,275)}<div class="chart-tooltip" data-chart-tooltip><small></small><b></b><span></span></div>`;wireCharts();}
 }
}
function renderSettingsTab(tab) {
 $$('.settings-tab').forEach(btn=>btn.classList.toggle('active',btn.dataset.settingsTab===tab)); const panel=$('#settings-panel');if(!panel)return;
 if(tab==='general') { // Re-render only the settings panel from the main template.
   panel.innerHTML=`<h2>Workspace details</h2><p>These preferences are saved locally in this browser. They do not change a remote account or real business data.</p><div class="settings-form-row"><label for="pref-name">Workspace owner<small>Name shown in the top navigation.</small></label><input class="field-input" id="pref-name" value="${escapeHtml(loadPrefs().name||'Alex Morgan')}" /></div><div class="settings-form-row"><label for="pref-email">Email address<small>For this local demo only.</small></label><input class="field-input" id="pref-email" type="email" value="${escapeHtml(loadPrefs().email||'alex@signal.demo')}" /></div><div class="settings-form-row"><label for="pref-currency">Display currency<small>Changes the display label only; no conversion is applied.</small></label><select class="field-input field-select" id="pref-currency"><option value="USD">USD · US Dollar</option><option value="GBP">GBP · Pound Sterling</option><option value="EUR">EUR · Euro</option><option value="NGN">NGN · Nigerian Naira</option></select></div><div class="settings-form-row"><label for="pref-period">Default date range<small>Starting period for analytics pages.</small></label><select class="field-input field-select" id="pref-period"><option value="7d">Last 7 days</option><option value="30d">Last 30 days</option><option value="90d">Last 90 days</option><option value="12m">Last 12 months</option></select></div><div class="form-actions"><button class="button-primary" data-action="save-settings">Save preferences ${svgIcon('check')}</button></div>`;
   const prefs=loadPrefs(); if($('#pref-currency'))$('#pref-currency').value=prefs.currency||'USD';if($('#pref-period'))$('#pref-period').value=prefs.period||'30d';
 } else if(tab==='display') {
   panel.innerHTML=`<h2>Display &amp; data</h2><p>Small adjustments to the way this demo presents sample information.</p><div class="settings-form-row"><label>Show comparison series<small>Display the previous period in charts.</small></label><button class="toggle" role="switch" aria-checked="${loadDisplayPrefs().comparison===false?'false':'true'}" data-toggle="comparison"><span></span></button></div><div class="settings-form-row"><label>Reduced motion<small>Prefer less movement between views.</small></label><button class="toggle" role="switch" aria-checked="${loadDisplayPrefs().motion===true?'true':'false'}" data-toggle="motion"><span></span></button></div><div class="settings-form-row"><label>Sample data mode<small>This workspace uses fictional business data.</small></label><span class="demo-status"><span></span> ENABLED</span></div><div class="form-actions"><button class="button-primary" data-action="save-display">Apply display settings ${svgIcon('check')}</button></div>`;
 } else if(tab==='notifications') {
   panel.innerHTML=`<h2>Notification preferences</h2><p>Control which sample notifications are shown in this browser.</p><div class="settings-form-row"><label>Weekly summary<small>A fictional report-ready notice.</small></label><button class="toggle" role="switch" aria-checked="${loadDisplayPrefs().weekly===false?'false':'true'}" data-toggle="weekly"><span></span></button></div><div class="settings-form-row"><label>Inventory reminders<small>Low-stock sample product alerts.</small></label><button class="toggle" role="switch" aria-checked="${loadDisplayPrefs().inventory===false?'false':'true'}" data-toggle="inventory"><span></span></button></div><div class="settings-form-row"><label>Order activity<small>Updates to sample order statuses.</small></label><button class="toggle" role="switch" aria-checked="${loadDisplayPrefs().orders===true?'true':'false'}" data-toggle="orders"><span></span></button></div><div class="form-actions"><button class="button-primary" data-action="save-display">Save notification settings ${svgIcon('check')}</button></div>`;
 } else {
   panel.innerHTML=`<h2>Made to make sense.</h2><p>SIGNAL is a fictional business intelligence dashboard concept by FORM11 TECH STUDIOS. It is built with plain HTML, CSS, and JavaScript, and designed to run on GitHub Pages without a backend.</p><div class="settings-form-row"><label>Build<small>Static web application</small></label><span>FORM11 SIGNAL · 1.0</span></div><div class="settings-form-row"><label>Data source<small>All data ships with this project</small></label><span>Fictional sample records</span></div><div class="settings-form-row"><label>Privacy<small>Preferences stay in local browser storage</small></label><span>Local-first demo</span></div><div class="settings-form-row"><label>Designed &amp; built by</label><strong>FORM11 TECH STUDIOS.</strong></div>`;
 }
}
function loadPrefs() { try{return JSON.parse(localStorage.getItem('signalPrefs')||'{}')}catch(_){return {}} }
function loadDisplayPrefs() { try{return JSON.parse(localStorage.getItem('signalDisplayPrefs')||'{}')}catch(_){return {}} }
function saveDisplayPreferences() {
 const settings = loadDisplayPrefs(); $$('[data-toggle]').forEach(toggle => { settings[toggle.dataset.toggle] = toggle.getAttribute('aria-checked') === 'true'; });
 try { localStorage.setItem('signalDisplayPrefs', JSON.stringify(settings)); } catch (_) {}
 document.body.classList.toggle('hide-comparison', settings.comparison === false);
 document.body.classList.toggle('reduce-motion', settings.motion === true);
 applyNotificationPreferences(settings);
}
function applyNotificationPreferences(settings = loadDisplayPrefs()) {
 const rules = {weekly: settings.weekly !== false, inventory: settings.inventory !== false, orders: settings.orders === true};
 Object.entries(rules).forEach(([type, visible]) => { const item = $(`[data-notification-type="${type}"]`); if (item) item.style.display = visible ? '' : 'none'; });
 const unread = Object.values(rules).filter(Boolean).length; const eyebrow = $('.notification-menu .popover-eyebrow'); if (eyebrow) eyebrow.textContent = `INBOX · ${String(unread).padStart(2,'0')} UNREAD`; const dot = $('#notification-button i'); if (dot) dot.style.display = unread ? '' : 'none';
}
function applyStoredDisplayPreferences() {
 let settings = {}; try { settings = JSON.parse(localStorage.getItem('signalDisplayPrefs') || '{}'); } catch (_) {}
 document.body.classList.toggle('hide-comparison', settings.comparison === false); document.body.classList.toggle('reduce-motion', settings.motion === true); applyNotificationPreferences(settings);
}
function saveSettings() {
 const prefs=loadPrefs();if($('#pref-name'))prefs.name=$('#pref-name').value.trim()||'Alex Morgan';if($('#pref-email'))prefs.email=$('#pref-email').value.trim()||'alex@signal.demo';if($('#pref-currency'))prefs.currency=$('#pref-currency').value;if($('#pref-period'))prefs.period=$('#pref-period').value;
 try{localStorage.setItem('signalPrefs',JSON.stringify(prefs));}catch(_){}
 const name=prefs.name||'Alex Morgan'; const profile=$('.profile-copy b');if(profile)profile.textContent=name;showToast('Preferences saved','Your settings have been stored in this browser.');
}
function closeSidebar() { $('#sidebar').classList.remove('open');$('#mobile-scrim').classList.remove('show'); }
function togglePopover(id) {
 const el=$(id);const wasHidden=el.classList.contains('hidden'); $$('.popover-menu').forEach(menu=>menu.classList.add('hidden'));if(wasHidden)el.classList.remove('hidden');
}

// Global navigation and actions are delegated so controls remain live after each screen render.
document.addEventListener('click',e=>{
 const nav=e.target.closest('[data-page]'); if(nav && nav.matches('a[data-page]')) {e.preventDefault();navigate(nav.dataset.page);return;}
 const go=e.target.closest('[data-navigate]');if(go){navigate(go.dataset.navigate);return;}
 const action=e.target.closest('[data-action]')?.dataset.action;if(!action)return;
 switch(action){
  case 'export-csv': if(currentPage==='orders')exportOrders();else if(currentPage==='customers')exportCustomers();else if(currentPage==='products')exportProducts();else if(currentPage==='analytics')exportRevenue();else exportSummary();break;
  case 'export-summary': exportSummary();break;
  case 'export-revenue': exportRevenue();break;
  case 'export-orders': exportOrders();break;
  case 'export-customers': exportCustomers();break;
  case 'export-products': exportProducts();break;
  case 'export-all': exportSummary();break;
  case 'open-revenue': navigate('analytics');break;
  case 'view-reports': $('#notification-menu').classList.add('hidden');navigate('reports');break;
  case 'profile-settings': $('#profile-menu').classList.add('hidden');navigate('settings');break;
  case 'profile-logout': $('#profile-menu').classList.add('hidden');showToast('Demo session remains open','Authentication is not connected in this concept.');break;
  case 'save-settings': saveSettings();break;
  case 'save-display': saveDisplayPreferences();showToast('Preferences applied','Your display choices are reflected in this demo session.');break;
 }
});
$('#notification-button').addEventListener('click',()=>togglePopover('#notification-menu'));
$('#profile-button').addEventListener('click',()=>togglePopover('#profile-menu'));
try { const savedProfile = loadPrefs(); if(savedProfile.name) $('.profile-copy b').textContent = savedProfile.name; } catch (_) {}
$('#menu-toggle').addEventListener('click',()=>{ $('#sidebar').classList.add('open');$('#mobile-scrim').classList.add('show'); });
$('#mobile-scrim').addEventListener('click',closeSidebar);
document.addEventListener('click',e=>{if(!e.target.closest('#profile-menu')&&!e.target.closest('#profile-button'))$('#profile-menu').classList.add('hidden');if(!e.target.closest('#notification-menu')&&!e.target.closest('#notification-button'))$('#notification-menu').classList.add('hidden');});
document.addEventListener('click',e=>{const t=e.target.closest('[data-toggle]');if(t){t.setAttribute('aria-checked',t.getAttribute('aria-checked')!=='true'?'true':'false');}});
document.addEventListener('click',e=>{const row=e.target.closest('[data-customer]');if(row)openCustomer(row.dataset.customer);const product=e.target.closest('[data-product]');if(product)openProduct(product.dataset.product);if(e.target.matches('[data-close-modal]')||e.target.matches('[data-modal-backdrop]'))closeDetailModal();});
document.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){const row=e.target.closest?.('[data-customer]');const prod=e.target.closest?.('[data-product]');if(row){e.preventDefault();openCustomer(row.dataset.customer);}else if(prod){e.preventDefault();openProduct(prod.dataset.product);}}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeSidebar();$$('.popover-menu').forEach(menu=>menu.classList.add('hidden'));closeDetailModal();}});
window.addEventListener('popstate',()=>navigate(location.hash.slice(1)||'overview',false));

// Initial UI.
hydrateIcons();
applyStoredDisplayPreferences();
const initial=location.hash.replace('#','')||'overview';
navigate(renderers[initial]?initial:'overview',false);
