// 넷리파이가 배포할 때마다 실행됩니다. content 폴더의 글과 사진 목록을 site-data.json 하나로 합칩니다.
const fs = require('fs'), path = require('path');
const dir = 'content/columns';
let files = [];
try { files = fs.readdirSync(dir).filter(f => f.endsWith('.json')); } catch (e) {}
const posts = files.map(f => {
  try { return Object.assign({ id: f.replace(/\.json$/, '') }, JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))); }
  catch (e) { return null; }
}).filter(Boolean);
posts.sort((a, b) => String(b.date).localeCompare(String(a.date)) || b.id.localeCompare(a.id));
let about = { photos: [] };
try { about = JSON.parse(fs.readFileSync('content/about.json', 'utf8')); } catch (e) {}
fs.writeFileSync('site-data.json', JSON.stringify({ posts, about }));
console.log('posts:', posts.length, 'photos:', (about.photos || []).length);
