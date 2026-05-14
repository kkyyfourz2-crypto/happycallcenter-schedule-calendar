const express = require('express');
const fs      = require('fs');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;
const DB   = path.join(__dirname, 'data.json');

// DB 초기화
if (!fs.existsSync(DB)) fs.writeFileSync(DB, JSON.stringify({ schedules:{}, employees:[], org:'' }));

function readDB()       { return JSON.parse(fs.readFileSync(DB,'utf8')); }
function writeDB(data)  { fs.writeFileSync(DB, JSON.stringify(data, null, 2)); }

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 직원 목록 조회
app.get('/api/employees', (req, res) => {
  const db = readDB();
  res.json({ employees: db.employees.length ? db.employees : [
    {name:'이순옥', time:'09:00~12:00'},
    {name:'이경숙', time:'12:00~15:00'},
    {name:'박봉임', time:'15:00~18:00'}
  ], org: db.org || '' });
});

// 직원 목록 저장
app.post('/api/employees', (req, res) => {
  const db = readDB();
  db.employees = req.body.employees || [];
  db.org       = req.body.org || '';
  writeDB(db);
  res.json({ ok: true });
});

// 특정 월 데이터 조회
app.get('/api/schedule/:year/:month', (req, res) => {
  const db  = readDB();
  const key = `${req.params.year}_${req.params.month}`;
  res.json({ data: db.schedules[key] || {} });
});

// 특정 월 데이터 저장
app.post('/api/schedule/:year/:month', (req, res) => {
  const db  = readDB();
  const key = `${req.params.year}_${req.params.month}`;
  db.schedules[key] = req.body.data || {};
  writeDB(db);
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`달력 서버 실행 중: http://localhost:${PORT}`));
