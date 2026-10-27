// 넷리파이가 배포할 때마다 실행됩니다.
// 1) content 폴더의 글과 사진 목록을 site-data.json 하나로 합칩니다.
// 2) 칼럼마다 따로 읽을 수 있는 글 페이지(columns/글번호.html)를 만듭니다.
// 3) 검색엔진용 sitemap.xml을 만듭니다.
const fs = require('fs'), path = require('path');
const SITE = 'https://onepickmath.netlify.app';
const dir = 'content/columns';
let files = [];
try { files = fs.readdirSync(dir).filter(f => f.endsWith('.json')); } catch (e) {}
const posts = files.map(f => {
  try { return Object.assign({ id: f.replace(/\.json$/, '') }, JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))); }
  catch (e) { return null; }
}).filter(Boolean);
posts.sort((a, b) => String(b.date).localeCompare(String(a.date)) || b.id.localeCompare(a.id));
posts.forEach((p, i) => { p.slug = /^[A-Za-z0-9_-]+$/.test(p.id) ? p.id : 'post-' + (posts.length - i); });
let about = { photos: [] };
try { about = JSON.parse(fs.readFileSync('content/about.json', 'utf8')); } catch (e) {}
fs.writeFileSync('site-data.json', JSON.stringify({ posts, about }));

// ---- 칼럼 글 페이지 만들기 ----
const index = fs.readFileSync('index.html', 'utf8');
const pick = (re) => { const m = index.match(re); return m ? m[0] : ''; };
const style = pick(/<style>[\s\S]*?<\/style>/);
const toHome = (h) => h.replace(/href="#/g, 'href="/#');
const header = toHome(pick(/<header>[\s\S]*?<\/header>/));
const footer = toHome(pick(/<footer>[\s\S]*?<\/footer>/));
const callfix = pick(/<a class="callfix"[\s\S]*?<\/a>/);
// 홈페이지와 똑같은 방식으로 본문을 변환하도록 index.html의 변환 함수를 그대로 가져옵니다.
const mdSrc = pick(/function mdEsc[\s\S]*?(?=function render\(\))/);
const mdToHtml = new Function(mdSrc + '; return mdToHtml;')();
const esc = (t) => String(t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const plain = (h) => h.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();

const extra = `<style>
body{background:var(--bg2)}
.art{max-width:780px;margin:40px auto 60px;background:#fff;border:1px solid var(--bd);border-radius:28px;padding:clamp(24px,5vw,52px);box-shadow:0 10px 28px rgba(23,143,130,.06)}
.art .ck{display:inline-block;background:var(--ms);color:var(--m);font-weight:800;font-size:13px;padding:6px 14px;border-radius:999px;margin-top:16px}
.art h1{font-size:clamp(26px,5vw,38px);line-height:1.3;font-weight:900;margin:14px 0 10px}
.art .meta{color:var(--m);font-size:14px;font-weight:700;margin-bottom:28px}
.art .pb.rich{font-size:16px;line-height:1.85}
.art .pb.rich h2{font-size:24px;margin:1.6em 0 .5em}.art .pb.rich h3{font-size:20px;margin:1.4em 0 .4em}
.back{display:flex;flex-wrap:wrap;gap:10px;margin-top:40px;padding-top:24px;border-top:1px solid var(--bd)}
</style>`;

fs.mkdirSync('columns', { recursive: true });
posts.forEach(p => {
  const body = mdToHtml(p.body || '');
  const desc = (p.sum || plain(body).slice(0, 120)).replace(/\s+/g, ' ');
  const date = String(p.date || '').slice(0, 10);
  const html = `<!DOCTYPE html>
<html lang="ko"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(p.title)} | 원픽학원</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE}/columns/${p.slug}.html">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="article">
${style}
${extra}
</head>
<body>
${header}
<main><div class="w"><article class="art">
<div class="crumb"><a href="/">홈</a> › <a href="/#columns">칼럼</a></div>
${p.cat ? `<div class="ck">${esc(p.cat)}</div>` : ''}
<h1>${esc(p.title)}</h1>
<div class="meta">글쓴이 원픽학원 원장 / ${esc(date)}</div>
<div class="pb rich">${body}</div>
<div class="back"><a class="btn o" href="/#columns">← 칼럼 목록으로</a><a class="btn" href="/#contact">상담 예약하기</a></div>
</article></div></main>
${footer}
${callfix}
</body></html>`;
  fs.writeFileSync(path.join('columns', p.slug + '.html'), html);
});

// ---- sitemap.xml ----
const urls = [`<url><loc>${SITE}/</loc></url>`].concat(posts.map(p =>
  `<url><loc>${SITE}/columns/${p.slug}.html</loc>${p.date ? `<lastmod>${String(p.date).slice(0, 10)}</lastmod>` : ''}</url>`));
fs.writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);

console.log('posts:', posts.length, 'photos:', (about.photos || []).length, 'pages: columns/*.html');
