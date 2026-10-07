'use strict';
const $=s=>document.querySelector(s);
const icons={
 dumbbell:'M3 8v8m3-11v14m3-8h6m0-6v14m3-11v8M3 10H1v4h2m15-4h3v4h-3',
 home:'M3 10l9-7 9 7v10H3zM9 20v-7h6v7',calendar:'M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2M7 2v4m10-4v4M3 10h18M7 14h2m6 0h2m-10 4h2',
 chart:'M4 3v17h17M8 15l4-5 4 2 5-7',settings:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1z',
 plus:'M12 5v14M5 12h14',check:'M5 12l4 4L19 6',arrow:'M5 12h14m-5-5 5 5-5 5',back:'M16 5l-7 7 7 7',next:'M8 5l7 7-7 7',clock:'M12 8v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18',
 flame:'M12 2c0 7-8 7-8 13a8 8 0 0 0 16 0c0-3-2-6-4-7 0 3-1 4-2 5 0-5-2-7-2-11',close:'M6 6l12 12M18 6 6 18',search:'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14m5 12 6 6',pause:'M8 5v14m8-14v14',play:'M7 4l14 8-14 8z',stop:'M6 6h12v12H6z',more:'M5 12h.01M12 12h.01M19 12h.01',download:'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',upload:'M12 16V4m-5 5 5-5 5 5M4 16v5h16v-5',widget:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',info:'M12 10v6m0-9h.01M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20',trash:'M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7',target:'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20m0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10m0 5h.01',bolt:'M13 2 4 14h7l-1 8 10-13h-7z'
};
function icon(name,extra=''){return `<svg class="icon ${extra}" viewBox="0 0 24 24" aria-hidden="true"><path d="${icons[name]||icons.dumbbell}"/></svg>`;}
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const button=(action,label,cls='secondary',attrs='')=>`<button class="${cls}" data-action="${action}" ${attrs}>${label}</button>`;
const library=[
 ['bench','바벨 벤치프레스','가슴','바벨','strength',40],['incline','인클라인 덤벨 프레스','가슴','덤벨','strength',12],['chestpress','체스트 프레스','가슴','머신','strength',30],['fly','덤벨 플라이','가슴','덤벨','strength',8],['cablefly','케이블 크로스오버','가슴','케이블','strength',10],['pushup','푸시업','가슴','맨몸','bodyweight',0],['dip','딥스','가슴','맨몸','bodyweight',0],
 ['deadlift','데드리프트','등','바벨','strength',60],['latpull','랫 풀다운','등','케이블','strength',35],['row','바벨 로우','등','바벨','strength',30],['seatedrow','시티드 케이블 로우','등','케이블','strength',30],['pullup','풀업','등','맨몸','bodyweight',0],['dumbbellrow','원암 덤벨 로우','등','덤벨','strength',14],['tbar','티바 로우','등','머신','strength',25],
 ['squat','바벨 스쿼트','하체','바벨','strength',40],['legpress','레그 프레스','하체','머신','strength',80],['lunge','덤벨 런지','하체','덤벨','strength',10],['legcurl','레그 컬','하체','머신','strength',25],['legextension','레그 익스텐션','하체','머신','strength',25],['rdl','루마니안 데드리프트','하체','바벨','strength',40],['hipthrust','힙 쓰러스트','하체','바벨','strength',40],['calf','스탠딩 카프 레이즈','하체','머신','strength',20],['goblet','고블릿 스쿼트','하체','덤벨','strength',12],['bodysquat','맨몸 스쿼트','하체','맨몸','bodyweight',0],
 ['ohp','오버헤드 프레스','어깨','바벨','strength',20],['shoulderpress','덤벨 숄더 프레스','어깨','덤벨','strength',10],['lateral','사이드 레터럴 레이즈','어깨','덤벨','strength',4],['rear','리어 델트 플라이','어깨','머신','strength',15],['facepull','페이스 풀','어깨','케이블','strength',15],
 ['curl','덤벨 컬','팔','덤벨','strength',8],['barbellcurl','바벨 컬','팔','바벨','strength',15],['hammercurl','해머 컬','팔','덤벨','strength',8],['pushdown','트라이셉스 푸시다운','팔','케이블','strength',15],['extension','오버헤드 트라이셉스 익스텐션','팔','덤벨','strength',8],
 ['plank','플랭크','코어','맨몸','duration',0],['crunch','크런치','코어','맨몸','bodyweight',0],['legraise','행잉 레그 레이즈','코어','맨몸','bodyweight',0],['russiantwist','러시안 트위스트','코어','덤벨','strength',5],['abwheel','앱 휠 롤아웃','코어','맨몸','bodyweight',0],
 ['run','러닝머신','유산소','머신','duration',0],['bike','실내 자전거','유산소','머신','duration',0],['rowing','로잉 머신','유산소','머신','duration',0],['walk','걷기','유산소','맨몸','duration',0],['rope','줄넘기','유산소','기타','duration',0]
].map(([id,name,muscle,equipment,kind,weight])=>({id,name,muscle,equipment,kind,weight}));
const routines=[{name:'전신 밸런스',desc:'처음부터 탄탄하게, 전신 기본 루틴',ids:['squat','bench','latpull','plank'],color:'',tag:'FULL BODY'}, {name:'상체 집중',desc:'가슴 · 등 · 어깨, 균형 있게',ids:['bench','seatedrow','shoulderpress','curl'],color:'blue',tag:'UPPER BODY'}, {name:'하체 & 코어',desc:'흔들리지 않는 힘의 기초',ids:['squat','rdl','legcurl','plank'],color:'peach',tag:'LOWER BODY'}];
function fresh(){return {version:1,settings:{unit:'kg',rest:90,autoRest:true,goal:3},sessions:[],draft:null,customExercises:[],timer:null};}
let data=fresh(),loadError=false;
try{const raw=window.Android?Android.load():localStorage.getItem('liftlog-v1');if(raw){data=validate(JSON.parse(raw));}}catch(e){loadError=true;}
let page=data.draft?'workout':'home',month=new Date(),selectedDate=dateKey(),modal=null,pickerFilter='전체',pickerQuery='',picked=new Set(),insightId='bench',historyQuery='',historySelection=null;
function dateKey(date=new Date()){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
function parseDate(v){return new Date(v+'T12:00:00');}
function validDate(v){return typeof v==='string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !isNaN(parseDate(v)) && dateKey(parseDate(v))===v;}
function validate(x){
 if(!x||x.version!==1||!x.settings||!Array.isArray(x.sessions)||!Array.isArray(x.customExercises))throw Error('백업 형식 오류');
 const numeric=(n,min,max)=>typeof n==='number' && Number.isFinite(n)&&n>=min&&n<=max;
 if(!['kg','lb'].includes(x.settings.unit)||!numeric(x.settings.rest,15,3600)||!numeric(x.settings.goal,1,7)||!Number.isInteger(x.settings.goal)||typeof x.settings.autoRest!=='boolean')throw Error('설정 오류');
 if(x.customExercises.length>500||x.sessions.length>10000)throw Error('기록 개수 초과');
 const ids=new Set(library.map(e=>e.id));
 for(const e of x.customExercises){if(!e||typeof e.id!=='string'||!e.id.startsWith('custom_')||ids.has(e.id)||typeof e.name!=='string'||e.name.length<1||e.name.length>80||!['가슴','등','하체','어깨','팔','코어','유산소','기타'].includes(e.muscle)||!['strength','bodyweight','duration'].includes(e.kind))throw Error('운동 데이터 오류');ids.add(e.id);}
 function checkSession(s,draft){
  if(!s||typeof s.id!=='string'||!validDate(s.date)||typeof s.name!=='string'||s.name.length>80||!Array.isArray(s.exercises)||s.exercises.length>60||!numeric(s.startedAt,0,1e14)||typeof s.notes!=='string'||s.notes.length>2000)throw Error('운동 기록 오류');
  if(!draft&&(!numeric(s.finishedAt,0,1e14)||!numeric(s.duration,0,1e9)))throw Error('시간 오류');
  for(const e of s.exercises){if(!ids.has(e.id)||!Array.isArray(e.sets)||e.sets.length>100)throw Error('세트 오류');for(const set of e.sets){if(!numeric(set.weightKg,0,10000)||!numeric(set.reps,0,100000)||!Number.isInteger(set.reps)||typeof set.done!=='boolean')throw Error('세트 값 오류');}}
 }
 x.sessions.forEach(s=>checkSession(s,false));if(x.draft)checkSession(x.draft,true);
 if(x.timer && (!numeric(x.timer.total,1,3600)||!numeric(x.timer.remaining,0,3600)||typeof x.timer.paused!=='boolean'||!numeric(x.timer.end,0,1e14)))throw Error('타이머 오류');
 return x;
}
function save(){if(loadError){toast('저장된 데이터를 읽지 못했습니다. 설정에서 복원을 먼저 해주세요.');return false;}try{const raw=JSON.stringify(data);if(window.Android){if(!Android.save(raw))throw Error('저장 실패');}else localStorage.setItem('liftlog-v1',raw);return true;}catch(e){toast('기록을 저장하지 못했습니다. 저장 공간을 확인해 주세요.');return false;}}
function allExercises(){return [...library,...data.customExercises];}
function exercise(id){return allExercises().find(e=>e.id===id);}
const fmt=n=>new Intl.NumberFormat('ko-KR',{maximumFractionDigits:1}).format(n);
const weight=n=>Number((n*(data.settings.unit==='lb'?2.2046226218:1)).toFixed(2));
const asKg=n=>n/(data.settings.unit==='lb'?2.2046226218:1);
const clock=n=>`${String(Math.floor(n/60)).padStart(2,'0')}:${String(Math.floor(n%60)).padStart(2,'0')}`;
const completed=s=>s.exercises.flatMap(e=>e.sets.filter(a=>a.done)).length;
function volume(s){return s.exercises.reduce((sum,e)=>sum+(exercise(e.id)?.kind==='strength'?e.sets.filter(a=>a.done).reduce((t,a)=>t+a.weightKg*a.reps,0):0),0);}
function monday(){const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()-((d.getDay()+6)%7));return d;}
function weekSessions(){return data.sessions.filter(s=>s.date>=dateKey(monday()) && s.date<=dateKey());}
function latest(){return [...data.sessions].sort((a,b)=>b.finishedAt-a.finishedAt);}
function lastExercise(id){for(const s of latest()){const e=s.exercises.find(a=>a.id===id);if(e && e.sets.some(a=>a.done))return e;}return null;}
function toast(msg){$('#toast').textContent=msg;$('#toast').className='toast';clearTimeout(toast.timeout);toast.timeout=setTimeout(()=>{$('#toast').className='';$('#toast').textContent='';},3400);}
function nav(){return `<nav class="nav" aria-label="주 메뉴">${[['home','home','홈'],['routines','dumbbell','운동'],['calendar','calendar','캘린더'],['insights','chart','성장'],['settings','settings','설정']].map(([p,i,n])=>button('navigate',icon(i)+n,page===p?'active':'',`data-page="${p}" aria-label="${n}"`)).join('')}</nav>`;}
function head(){return `<header class="head"><div class="brand">${icon('dumbbell')} LIFTLOG</div>${button('navigate',icon('settings'),'avatar','data-page="settings" aria-label="설정"')}</header>`;}
function empty(title,desc,ico='dumbbell',action=''){return `<div class="empty">${icon(ico)}<h3>${title}</h3><p>${desc}</p>${action}</div>`;}
function stat(label,value,unit=''){return `<div class="stat"><div class="stat-label">${label}</div><div class="stat-value">${value} <small>${unit}</small></div></div>`;}
function routineCard(r,index){return `<div class="routine"><div class="routine-art ${r.color}">${icon(index===2?'target':'dumbbell')}</div><div class="routine-info"><h3>${r.name}</h3><p>${r.ids.length}개 운동 · ${r.tag}</p></div>${button('routine',icon('play'),'icon-btn',`data-index="${index}" aria-label="${r.name} 시작"`)}</div>`;}
function home(){
 const ws=weekSessions(),goal=data.settings.goal,week=monday();
 return `${head()}<div class="eyebrow">YOUR NEXT REP STARTS HERE</div><h1 style="margin-top:10px">어제보다 한 세트 더.</h1><p class="welcome-line">작은 기록이 쌓여, 단단한 나를 만듭니다.</p>
 <section class="hero"><svg class="hero-art icon" viewBox="0 0 24 24"><path d="${icons.dumbbell}"/></svg><span class="eyebrow">${data.draft?'KEEP THE MOMENTUM':'READY WHEN YOU ARE'}</span><h2>${data.draft?'멈췄던 운동,<br>이어서 해볼까요?':'오늘의 운동을<br>시작해 볼까요?'}</h2><p>${data.draft?esc(data.draft.name):'무게, 횟수, 휴식까지.<br>운동에만 집중하세요.'}</p>${button('start',icon(data.draft?'play':'plus')+(data.draft?'운동 이어하기':'새 운동 시작'),'primary')}</section><div style="margin-top:12px">${button('history',icon('calendar')+' 과거 운동 불러오기','secondary full')}</div>
 <section class="section card"><div class="row"><h3>이번 주의 페이스</h3><span class="pill">목표 ${goal}회</span></div><div class="row" style="margin-top:14px"><div><span class="big-number">${ws.length}</span><span class="muted"> / ${goal}회</span></div><span class="small lime">${ws.length>=goal?'목표 달성! 멋진 한 주예요':`${Math.max(0,goal-ws.length)}회 더, 나와의 약속`}</span></div><div class="progress-track"><span style="width:${Math.min(100,ws.length/goal*100)}%"></span></div><div class="week">${['월','화','수','목','금','토','일'].map((name,i)=>{const d=new Date(week);d.setDate(week.getDate()+i);const k=dateKey(d);const done=ws.some(s=>s.date===k);return `<button class="day ${done?'done':''} ${k===dateKey()?'today':''}" data-action="day" data-date="${k}" aria-label="${k} 기록">${name}<span>${done?icon('check'):d.getDate()}</span></button>`;}).join('')}</div></section>
 <div class="stats">${stat('이번 주 운동 시간',fmt(ws.reduce((n,s)=>n+s.duration,0)/60),'분')}${stat('이번 주 총 볼륨',fmt(weight(ws.reduce((n,s)=>n+volume(s),0))),data.settings.unit)}</div>
 <section class="section"><div class="row section-title"><h2>바로 시작하는 루틴</h2>${button('navigate','전체 보기 '+icon('next'),'text-btn','data-page="routines"')}</div><div class="card compact">${routines.map(routineCard).join('')}</div></section>
 <section class="section"><div class="row section-title"><h2>최근 운동</h2>${button('navigate','기록 보기','text-btn','data-page="calendar"')}</div>${data.sessions.length?logCard(latest()[0]):`<div class="card">${empty('첫 번째 기록을 기다리고 있어요','오늘의 한 세트가 내일의 기준이 됩니다.','calendar')}</div>`}</section><div class="app-footer">BUILD YOUR OWN STRONG.</div>`;
}
function logCard(s){return `<button class="card log-card full" data-action="viewSession" data-id="${esc(s.id)}" style="text-align:left"><div class="row"><h3>${esc(s.name)}</h3><span class="badge">완료</span></div><p>${esc(s.date)} · ${s.exercises.length}개 운동</p><div class="log-metrics"><span>${icon('clock')} ${Math.round(s.duration/60)}분</span><span>${completed(s)}세트</span><span>${fmt(weight(volume(s)))} ${data.settings.unit}</span></div></button>`;}
function routinesPage(){return `${head()}<div class="eyebrow">TRAIN WITH INTENTION</div><h1 style="margin-top:9px">오늘, 어떤 운동?</h1><p class="welcome-line">루틴으로 시작하거나 나만의 운동을 골라보세요.</p><div class="section">${button('start',icon('plus')+(data.draft?'진행 중인 운동 이어하기':'직접 운동 구성하기'),'primary')}${button('history',icon('calendar')+' 과거 운동 불러오기','secondary full','style="margin-top:12px"')}</div>${routines.map((r,i)=>`<section class="section card"><div class="row"><span class="mini-tag">${r.tag}</span><span class="small muted">${r.ids.length}개 운동</span></div><h2 style="margin-top:14px">${r.name}</h2><p class="small muted" style="margin-top:6px">${r.desc}</p><div class="divider"></div>${r.ids.map(id=>`<p class="small" style="margin-bottom:9px">${icon('dumbbell')} &nbsp;${exercise(id).name} <span class="muted">· ${exercise(id).kind==='duration'?'시간 기록':'3세트'}</span></p>`).join('')}${button('routine',icon('play')+'루틴 시작','secondary full',`data-index="${i}" style="margin-top:12px"`)}</section>`).join('')}<div class="section tip">${icon('info')}<p>시작한 뒤 운동을 추가·삭제하고, 세트 수와 무게를 자유롭게 바꿀 수 있어요.</p></div>`;}
function calendar(){
 const y=month.getFullYear(),m=month.getMonth(),first=new Date(y,m,1),count=new Date(y,m+1,0).getDate(),off=(first.getDay()+6)%7;
 const records=data.sessions.filter(s=>s.date===selectedDate);
 return `${head()}<div class="eyebrow">EVERY DAY COUNTS</div><h1 style="margin-top:9px">기록이 쌓이는 달력</h1><p class="welcome-line">운동한 날마다, 한 걸음 더 가까이.</p><div class="section card"><div class="calendar-head">${button('month',icon('back'),'icon-btn','data-delta="-1" aria-label="이전 달"')}<h2>${y}년 ${m+1}월</h2>${button('month',icon('next'),'icon-btn','data-delta="1" aria-label="다음 달"')}</div><div class="calendar-grid">${['월','화','수','목','금','토','일'].map(d=>`<div class="label">${d}</div>`).join('')}${'<span></span>'.repeat(off)}${Array.from({length:count},(_,i)=>{const k=dateKey(new Date(y,m,i+1));return button('day',i+1,`calendar-date ${k===dateKey()?'today':''} ${k===selectedDate?'selected':''} ${data.sessions.some(s=>s.date===k)?'has-record':''} ${k>dateKey()?'future':''}`,`data-date="${k}" aria-label="${k} 기록"`);}).join('')}</div><div class="row" style="margin-top:22px"><span class="small muted">● 운동 기록이 있는 날</span>${button('today','오늘로','text-btn')}</div></div><section class="section"><div class="row section-title"><h2>${parseDate(selectedDate).getMonth()+1}월 ${parseDate(selectedDate).getDate()}일</h2><span class="small muted">${records.length}개의 기록</span></div>${records.length?records.map(logCard).join(''):`<div class="card">${empty('아직 기록이 없는 날이에요',selectedDate>dateKey()?'앞으로 채워 갈 나의 운동 기록.':'오늘의 노력, 여기에 남겨보세요.','calendar',selectedDate<=dateKey()?button('recordDate',icon('plus')+'이 날짜에 기록하기','secondary'): '')}</div>`}</section>`;
}
function workout(){
 const s=data.draft;if(!s){page='home';return home();}
 const done=completed(s),total=s.exercises.reduce((n,e)=>n+e.sets.length,0);
 return `<div class="workout-top"><div class="workout-header">${button('navigate',icon('back'),'icon-btn','data-page="home" aria-label="홈으로"')}<span class="eyebrow">WORKOUT IN PROGRESS</span>${button('timer',icon('clock'),'icon-btn','aria-label="타이머"')}</div></div><div class="row"><span class="small muted">${s.date}</span><span class="elapsed" id="elapsed">${clock(Math.floor((Date.now()-s.startedAt)/1000))}</span></div><input class="session-name" id="session-name" maxlength="80" aria-label="운동 이름" value="${esc(s.name)}"><div class="row"><span class="small muted">${s.exercises.length}개 운동 · ${done}/${total}세트 완료</span>${button('unit',data.settings.unit.toUpperCase()+' ⇄','pill')}</div>
 ${s.exercises.map((e,i)=>{const ex=exercise(e.id),last=lastExercise(e.id),kind=ex.kind;return `<section class="card exercise-card"><div class="row"><h3>${esc(ex.name)}</h3>${button('exerciseMenu',icon('more'),'icon-btn',`data-index="${i}" aria-label="${esc(ex.name)} 편집"`)}</div><p class="last">${last?`지난 기록 · ${setDescription(last.sets.find(a=>a.done),kind)}`:'첫 기록 · 오늘의 기준을 만들어보세요'}</p><div class="set-labels"><span>세트</span><span>${kind==='strength'?data.settings.unit:kind==='duration'?'기록':'중량'}</span><span>${kind==='duration'?'시간 (초)':'횟수'}</span><span>완료</span></div>${e.sets.map((set,j)=>`<div class="set-row ${set.done?'done':''}"><span class="set-number">${j+1}</span>${kind==='strength'?`<input inputmode="decimal" type="number" min="0" max="${weight(10000)}" step="any" value="${weight(set.weightKg)}" data-field="weight" data-ex="${i}" data-set="${j}" aria-label="${esc(ex.name)} ${j+1}세트 무게">`:`<span class="small muted" style="text-align:center">${kind==='duration'?'타임':'맨몸'}</span>`}<input inputmode="numeric" type="number" min="1" max="100000" step="1" value="${set.reps||''}" data-field="reps" data-ex="${i}" data-set="${j}" aria-label="${esc(ex.name)} ${j+1}세트 ${kind==='duration'?'초':'횟수'}">${button('checkSet',icon('check'),`check ${set.done?'done':''}`,`data-ex="${i}" data-set="${j}" aria-label="${esc(ex.name)} ${j+1}세트 완료" aria-pressed="${set.done}"`)}</div>`).join('')}${button('addSet',icon('plus')+' 세트 추가','add-set',`data-index="${i}"`)}</section>`;}).join('')}
 ${s.exercises.length?'':`<div class="section card">${empty('오늘의 운동을 골라주세요','운동 검색에서 부위별로 선택할 수 있어요.','dumbbell')}</div>`}<div class="section">${button('pick',icon('plus')+'운동 추가','secondary full')}${button('history',icon('calendar')+' 과거 운동 불러오기','secondary full','style="margin-top:10px"')}</div><label class="note-label" for="workout-notes">오늘의 메모</label><textarea class="note" id="workout-notes" maxlength="2000" rows="2" placeholder="컨디션, 자세, 다음 운동의 목표…">${esc(s.notes)}</textarea><div class="workout-bottom">${button('cancelWorkout','운동 취소','secondary danger')}${button('finish',icon('check')+'운동 완료','primary')}</div><p class="micro" style="text-align:center;margin-top:14px">완료한 세트만 기록에 저장됩니다.</p>`;
}
function setDescription(set,kind){if(!set)return '기록 없음';return kind==='duration'?`${set.reps}초`:kind==='bodyweight'?`맨몸 × ${set.reps}회`:`${fmt(weight(set.weightKg))} ${data.settings.unit} × ${set.reps}회`;}
function insights(){
 const sessions=latest();
 const available=allExercises().filter(e=>sessions.some(s=>s.exercises.some(a=>a.id===e.id&&a.sets.some(a=>a.done))));
 if(available.length&&!available.some(e=>e.id===insightId))insightId=available[0].id;
 const totalVol=sessions.reduce((n,s)=>n+volume(s),0),history=[...sessions].reverse().filter(s=>s.exercises.some(e=>e.id===insightId&&e.sets.some(a=>a.done))).slice(-10);
 const ex=exercise(insightId)||library[0];
 const values=history.map(s=>{const e=s.exercises.find(a=>a.id===ex.id);return Math.max(...e.sets.filter(a=>a.done).map(a=>ex.kind==='strength'?weight(a.weightKg):a.reps));});
 const recorded=allExercises().filter(e=>sessions.some(s=>s.exercises.some(a=>a.id===e.id&&a.sets.some(a=>a.done))));
 let chart='';
 if(history.length){const max=Math.max(1,...values)*1.15,points=values.map((v,i)=>`${history.length===1?145:22+i*266/(history.length-1)},${125-v/max*100}`).join(' ');chart=`<svg class="chart" viewBox="0 0 310 155" role="img" aria-label="${esc(ex.name)} 기록 그래프">${[25,75,125].map(y=>`<path d="M20 ${y}H295" stroke="#34404e" stroke-dasharray="3 5"/>`).join('')}<polyline class="line" points="${points}"/>${values.map((v,i)=>{const x=history.length===1?145:22+i*266/(history.length-1),y=125-v/max*100;return `<circle cx="${x}" cy="${y}" r="4" fill="#c8fa71"/><text x="${x}" y="${y-10}" text-anchor="middle">${fmt(v)}</text>`;}).join('')}<text x="20" y="151">${history[0].date.slice(5)}</text><text x="290" y="151" text-anchor="end">${history[history.length-1].date.slice(5)}</text></svg>`;}
 const weeks=Array.from({length:4},(_,i)=>{const end=new Date(monday());end.setDate(end.getDate()-(3-i)*7+6);const start=new Date(end);start.setDate(end.getDate()-6);return{n:sessions.filter(s=>s.date>=dateKey(start)&&s.date<=dateKey(end)).length,label:i===3?'이번 주':`${3-i}주 전`};});
 return `${head()}<div class="eyebrow">STRONGER, ONE REP AT A TIME</div><h1 style="margin-top:9px">숫자로 보는 나의 성장</h1><p class="welcome-line">꾸준한 나를, 기록으로 확인하세요.</p><div class="stats">${stat('누적 운동',sessions.length,'회')}${stat('완료한 세트',sessions.reduce((n,s)=>n+completed(s),0),'세트')}</div><div class="section card"><div class="row"><h3>운동 빈도</h3><span class="small muted">최근 4주</span></div><div class="bar-chart">${weeks.map(w=>`<div class="bar"><span class="small lime">${w.n}회</span><div style="height:${Math.max(3,w.n/Math.max(1,...weeks.map(x=>x.n))*78)}px"></div>${w.label}</div>`).join('')}</div></div><section class="section card"><div class="row"><h3>운동별 최고 기록</h3><span class="pill">${ex.kind==='strength'?data.settings.unit:ex.kind==='duration'?'초':'회'}</span></div><select id="insight-exercise" class="chart-select" aria-label="성장 그래프 운동 선택">${(recorded.length?recorded:[ex]).map(e=>`<option value="${esc(e.id)}" ${e.id===insightId?'selected':''}>${esc(e.name)}</option>`).join('')}</select>${chart||empty('성장의 출발선이에요','운동을 완료하면 실제 기록으로 그래프가 채워집니다.','chart')}<p class="micro">${ex.kind==='strength'?'운동별 세트 최고 무게':'운동별 세트 최고 '+(ex.kind==='duration'?'시간':'횟수')} · 최근 10회 기록</p></section><div class="section card"><span class="muted small">지금까지 들어 올린 총 볼륨</span><div class="big-number" style="margin-top:12px">${fmt(weight(totalVol))} <span class="small muted">${data.settings.unit}</span></div><p class="micro" style="margin-top:10px">중량 운동의 무게 × 횟수 합계. 맨몸·시간 운동 제외.</p></div><div class="section tip">${icon('bolt')}<p>기록이 쌓일수록 변화가 보입니다. 지난 기록을 기준으로 나만의 다음 목표를 정해보세요.</p></div>`;
}
function settings(){return `${head()}<div class="eyebrow">MAKE IT YOURS</div><h1 style="margin-top:9px">나에게 맞게</h1><p class="welcome-line">익숙한 단위, 편안한 운동의 리듬.</p>${loadError?'<div class="section tip danger">저장된 데이터 형식을 읽지 못했습니다. 원본은 보존되어 있으며, 백업 파일로 복원하거나 초기화할 수 있습니다.</div>':''}<div class="section card"><div class="setting-row"><div><h3>무게 단위</h3><p>기존 기록도 자동으로 환산돼요</p></div><div class="segmented">${['kg','lb'].map(u=>button('setUnit',u,u===data.settings.unit?'active':'',`data-unit="${u}"`)).join('')}</div></div><div class="setting-row"><div><h3>자동 휴식 타이머</h3><p>세트를 완료하면 바로 시작</p></div>${button('toggleRest','<span></span>',`switch ${data.settings.autoRest?'on':''}`,`role="switch" aria-label="자동 휴식 타이머" aria-checked="${data.settings.autoRest}"`)}</div><div class="setting-row"><div><h3>기본 휴식 시간</h3><p>나의 운동 속도에 맞게</p></div><select id="rest-setting" aria-label="기본 휴식 시간">${[30,45,60,90,120,180,300,...([30,45,60,90,120,180,300].includes(data.settings.rest)?[]:[data.settings.rest])].sort((a,b)=>a-b).map(n=>`<option value="${n}" ${n===data.settings.rest?'selected':''}>${n}초</option>`).join('')}</select></div><div class="setting-row"><div><h3>주간 운동 목표</h3><p>꾸준히 지킬 수 있는 약속</p></div><select id="goal-setting" aria-label="주간 운동 목표">${Array.from({length:7},(_,i)=>`<option value="${i+1}" ${data.settings.goal===i+1?'selected':''}>주 ${i+1}회</option>`).join('')}</select></div></div><div class="section card"><div class="row"><div class="routine-art blue">${icon('widget')}</div><div style="flex:1"><h3>홈 화면에서도 한눈에</h3><p class="small muted" style="margin-top:5px">이번 주 운동 · 최근 기록 · 바로 시작</p></div></div>${button('widget',icon('plus')+'홈 화면 위젯 추가','primary','style="margin-top:20px"')}<p class="micro" style="margin-top:12px">안드로이드에서 지원됩니다. 홈 화면을 길게 눌러 위젯 → 리프트로그를 선택해도 돼요.</p></div><div class="section card"><h3>내 기록, 안전하게</h3><div class="setting-row"><div><p style="margin-top:0">계정 없이 이 기기에 저장됩니다.<br>기기를 바꾸기 전에 파일로 백업하세요.</p></div></div><div class="row" style="margin-top:15px">${button('export',icon('download')+' 백업 저장','secondary')}${button('import',icon('upload')+' 복원','secondary')}</div></div><div class="section">${button('reset','모든 데이터 초기화','text-btn danger')}</div><div class="app-footer">리프트로그 1.1.0<br>LIFTLOG · BUILD YOUR OWN STRONG.</div>`;}
function render(){
 const screens={home,routines:routinesPage,calendar,workout,insights,settings};
 $('#app').innerHTML=`<main class="screen">${(screens[page]||home)()}</main>${page==='workout'?'':nav()}`;
 timerUI();
}
function sheet(title,body,kind='generic'){modal=kind;$('#overlay').innerHTML=`<div class="overlay-backdrop"><section class="sheet" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="handle"></div><div class="sheet-head"><h2>${title}</h2>${button('close',icon('close'),'icon-btn','aria-label="닫기"')}</div>${body}</section></div>`;}
function closeSheet(){modal=null;$('#overlay').innerHTML='';}
function confirmSheet(title,desc,action,label='확인'){sheet(title,`<p class="muted">${desc}</p><div class="sheet-actions">${button('close','돌아가기','secondary')}${button(action,label,'primary')}</div>`,'confirm');}
function startWorkout(date=dateKey(),routine=null){
 if(loadError){page='settings';render();toast('데이터 복원 또는 초기화를 먼저 해주세요.');return;}
 if(data.draft){page='workout';closeSheet();render();return;}
 data.draft={id:cryptoId(),date,name:routine?.name||'오늘의 운동',startedAt:Date.now(),notes:'',exercises:[]};
 if(routine)data.draft.exercises=routine.ids.map(newExercise);
 save();page='workout';render();if(!routine)openPicker();
}
function cryptoId(){return 's_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,9);}
function newExercise(id){const ex=exercise(id),last=lastExercise(id),defaultReps=ex.kind==='duration'?(ex.muscle==='유산소'?600:60):10;return {id,sets:last?last.sets.filter(s=>s.done).map(s=>({...s,done:false})):Array.from({length:ex.kind==='duration'?1:3},()=>({weightKg:ex.weight||0,reps:defaultReps,done:false}))};}
function openPicker(){pickerFilter='전체';pickerQuery='';picked=new Set();sheet('운동 선택',`<div class="search">${icon('search')}<input id="exercise-search" aria-label="운동 검색" placeholder="운동 이름으로 검색"></div><div class="filters" id="picker-filters"></div><div id="picker-results"></div>${button('customExercise',icon('plus')+'나만의 운동 만들기','text-btn')}${button('addPicked','운동 추가','primary','id="picker-add"')}`,'picker');refreshPicker();}
function refreshPicker(){
 $('#picker-filters').innerHTML=['전체','가슴','등','하체','어깨','팔','코어','유산소','기타'].map(f=>button('filter',f,`pill ${f===pickerFilter?'active':''}`,`data-filter="${f}"`)).join('');
 const list=allExercises().filter(e=>(pickerFilter==='전체'||e.muscle===pickerFilter)&&e.name.toLowerCase().includes(pickerQuery.toLowerCase()));
 $('#picker-results').innerHTML=list.map(e=>`<button class="exercise-choice ${picked.has(e.id)?'selected':''}" data-action="pickExercise" data-id="${esc(e.id)}" aria-pressed="${picked.has(e.id)}"><span class="routine-art">${icon(e.kind==='duration'?'clock':'dumbbell')}</span><div><h3>${esc(e.name)}</h3><p>${esc(e.muscle)} · ${esc(e.equipment||'직접 추가')} · ${e.kind==='duration'?'시간':e.kind==='bodyweight'?'맨몸':'중량'}</p></div><span class="box">${icon('check')}</span></button>`).join('')||empty('검색 결과가 없어요','다른 이름으로 검색하거나 직접 추가해보세요.','search');
 $('#picker-add').textContent=picked.size?`${picked.size}개 운동 추가`:'운동을 선택해 주세요';$('#picker-add').disabled=!picked.size;
}
function customExercise(){sheet('나만의 운동',`<label class="form-label" for="custom-name">운동 이름</label><input id="custom-name" placeholder="예: 케틀벨 스윙" maxlength="80"><label class="form-label" for="custom-muscle">운동 부위</label><select id="custom-muscle">${['가슴','등','하체','어깨','팔','코어','유산소','기타'].map(m=>`<option>${m}</option>`).join('')}</select><label class="form-label" for="custom-kind">기록 방식</label><select id="custom-kind"><option value="strength">중량 + 횟수</option><option value="bodyweight">맨몸 + 횟수</option><option value="duration">시간 (초)</option></select>${button('saveCustom','만들고 운동에 추가','primary')}`,'custom');}
function finishWorkout(){const s=data.draft;if(!s || !completed(s)){toast('한 세트 이상 완료한 뒤 저장해 주세요.');return;}
 sheet('오늘도 해냈어요',`<div class="success-mark">${icon('check')}</div><h2 style="text-align:center">${completed(s)}세트의 노력이 쌓였어요.</h2><p class="muted small" style="text-align:center;margin-top:8px">완료하지 않은 세트는 저장에서 제외됩니다.</p><div class="stats">${stat('총 볼륨',fmt(weight(volume(s))),data.settings.unit)}${stat('운동 시간',Math.round((Date.now()-s.startedAt)/60000),'분')}</div>${button('saveWorkout',icon('check')+'기록 저장','primary')}`,'finish');}
function sessionDetail(id){const s=data.sessions.find(s=>s.id===id);if(!s)return;sheet(esc(s.name),`<p class="small muted">${s.date} · ${Math.round(s.duration/60)}분 · ${completed(s)}세트</p>${s.exercises.map(e=>`<div class="detail-exercise"><h3>${esc(exercise(e.id).name)}</h3><div class="history-sets">${e.sets.map(set=>`<span>${esc(setDescription(set,exercise(e.id).kind))}</span>`).join('')}</div></div>`).join('')}${s.notes?`<p class="small muted" style="margin-top:17px;white-space:pre-wrap">${esc(s.notes)}</p>`:''}<div class="sheet-actions">${button('repeat',icon('calendar')+'이 기록 불러오기','primary',`data-id="${esc(id)}"`)}${button('deleteSession',icon('trash'),'secondary danger',`data-id="${esc(id)}" aria-label="기록 삭제"`)}</div>`,'detail');}
function historyMatches(query=''){
 const terms=query.trim().toLowerCase().split(/\s+/).filter(Boolean);
 return [...data.sessions].sort((a,b)=>b.date.localeCompare(a.date)||b.finishedAt-a.finishedAt).filter(s=>{
  const text=[s.date,s.name,...s.exercises.map(e=>exercise(e.id)?.name||'')].join(' ').toLowerCase();
  return terms.every(term=>text.includes(term));
 });
}
function historySheet(){
 historyQuery='';historySelection=null;
 sheet('과거 운동 불러오기',`<p class="small muted">그날의 운동·세트·무게·횟수를 그대로 가져옵니다.</p><div class="search">${icon('search')}<input id="history-search" aria-label="과거 운동 검색" placeholder="운동 이름, 종목, 날짜로 검색"></div><div class="row" style="margin-bottom:12px"><span class="micro">예: 2026-10 · 벤치 · 상체</span><span id="history-count" class="micro"></span></div><div id="history-results"></div>`,'history');
 refreshHistory();
}
function refreshHistory(){
 const matches=historyMatches(historyQuery);
 $('#history-count').textContent=matches.length+'개 기록';
 $('#history-results').innerHTML=matches.map(s=>`<button class="card history-choice full" data-action="chooseHistory" data-id="${esc(s.id)}"><div class="row"><span class="small lime">${esc(s.date)}</span>${icon('next')}</div><h3 style="margin-top:9px">${esc(s.name)}</h3><p class="small muted" style="margin-top:7px">${s.exercises.length}개 운동 · ${completed(s)}세트 · ${Math.round(s.duration/60)}분</p><p class="history-exercises">${s.exercises.map(e=>esc(exercise(e.id)?.name||'운동')).join(' · ')}</p></button>`).join('')||empty(data.sessions.length?'일치하는 기록이 없어요':'불러올 운동 기록이 아직 없어요',data.sessions.length?'운동 이름이나 날짜로 다시 검색해 주세요.':'운동을 완료하고 저장하면 여기에 표시됩니다.','calendar');
}
function selectedHistorySheet(id){
 const s=data.sessions.find(s=>s.id===id);if(!s){toast('이 기록을 찾을 수 없습니다.');return;}
 historySelection=id;
 const hasDraft=!!data.draft?.exercises.length;
 sheet('이 기록 불러오기',`<div class="row"><h3>${esc(s.name)}</h3><span class="pill">${esc(s.date)}</span></div><p class="small muted" style="margin-top:10px">${s.exercises.length}개 운동 · ${completed(s)}세트</p>${s.exercises.map(e=>`<div class="detail-exercise"><h3>${esc(exercise(e.id).name)}</h3><div class="history-sets">${e.sets.filter(a=>a.done).map(a=>`<span>${esc(setDescription(a,exercise(e.id).kind))}</span>`).join('')}</div></div>`).join('')}<div class="tip" style="margin-top:17px">${icon('info')}<p>선택한 날짜의 값으로 가져옵니다. 가져온 세트는 미완료 상태로 시작해요.</p></div>${hasDraft?`<p class="small muted" style="margin-top:15px">진행 중인 운동이 있어요. 추가하거나 운동 목록을 교체할 수 있습니다.</p>${button('appendHistory',icon('plus')+' 현재 운동에 추가','primary')}${button('replaceHistory','현재 운동 목록 교체','secondary full','style="margin-top:10px"')}`:button('loadHistory',icon('play')+'이 기록으로 운동 시작','primary')}${button('history','기록 목록으로 돌아가기','text-btn full','style="margin-top:12px"')}`,'historyPreview');
}
function importHistory(id,mode='replace'){
 if(loadError){toast('데이터 복원 또는 초기화를 먼저 해주세요.');return false;}
 const source=data.sessions.find(s=>s.id===id);if(!source){toast('이 기록을 찾을 수 없습니다.');return false;}
 const copied=source.exercises.map(e=>({id:e.id,sets:e.sets.filter(a=>a.done).map(a=>({weightKg:a.weightKg,reps:a.reps,done:false}))})).filter(e=>e.sets.length);
 if(!copied.length){toast('불러올 완료 세트가 없습니다.');return false;}
 const oldDraft=data.draft,oldTimer=data.timer;
 if(mode==='append'&&oldDraft){
  const merged=oldDraft.exercises.map(e=>({id:e.id,sets:e.sets.map(a=>({...a}))}));
  for(const entry of copied){const existing=merged.find(e=>e.id===entry.id);if(existing){if(existing.sets.length+entry.sets.length>100){toast('운동당 최대 100세트까지 불러올 수 있어요.');return false;}existing.sets.push(...entry.sets);}else merged.push(entry);}
  if(merged.length>60){toast('한 번에 최대 60개 운동까지 기록할 수 있어요.');return false;}
  data.draft={...oldDraft,exercises:merged};
 }else{
  data.draft=oldDraft?{...oldDraft,name:source.name,exercises:copied}:{id:cryptoId(),date:dateKey(),name:source.name,startedAt:Date.now(),notes:'',exercises:copied};
  data.timer=null;
 }
 if(!save()){data.draft=oldDraft;data.timer=oldTimer;return false;}
 if(mode!=='append'&&window.Android)Android.stopTimer();
 closeSheet();page='workout';render();window.scrollTo(0,0);toast(source.date+' 운동 기록을 불러왔습니다.');return true;
}
function timerSeconds(){if(!data.timer)return 0;return data.timer.paused?data.timer.remaining:Math.max(0,Math.ceil((data.timer.end-Date.now())/1000));}
function nativeTimer(seconds){try{if(window.Android)Android.startTimer(seconds);}catch(e){toast('알림 타이머를 시작하지 못했습니다. 앱 내 타이머는 계속됩니다.');}}
function startTimer(seconds=data.settings.rest){data.timer={total:seconds,remaining:seconds,paused:false,end:Date.now()+seconds*1000};nativeTimer(seconds);save();timerUI();}
function stopTimer(){data.timer=null;if(window.Android)Android.stopTimer();save();timerUI();}
function timerSheet(){sheet('휴식 타이머',`<p class="muted small" style="text-align:center">숨을 고르고, 다음 세트를 준비하세요.</p><div class="timer-circle"><svg viewBox="0 0 220 220"><circle cx="110" cy="110" r="100" stroke="#344231" stroke-width="7" fill="none"/><circle id="timer-ring" cx="110" cy="110" r="100" stroke="#c8fa71" stroke-width="7" fill="none" stroke-linecap="round" stroke-dasharray="628.3"/></svg><div><div class="timer-time" id="sheet-timer">${clock(data.timer?timerSeconds():data.settings.rest)}</div><p class="small muted" id="timer-status" style="text-align:center">휴식을 시작하세요</p></div></div><div class="timer-controls">${[30,60,90,120,180].map(n=>button('timerPreset',`${n}초`,'pill',`data-seconds="${n}"`)).join('')}</div><div class="sheet-actions">${button('timerStop','초기화','secondary')}${button('timerToggle',icon('play')+' 시작','primary','id="timer-toggle"')}</div><p class="micro" style="text-align:center;margin-top:18px">APK에서는 알림으로 화면을 꺼도 타이머를 확인할 수 있어요.</p>`,'timer');timerUI();}
function timerUI(){
 let float=$('#timer-float');const t=data.timer,seconds=timerSeconds();
 if(t && modal!=='timer'){if(!float){float=document.createElement('aside');float.id='timer-float';float.className='timer-float';document.body.append(float);}float.innerHTML=`<button data-action="timer" style="display:flex;align-items:center;gap:12px">${icon('clock')}<div style="text-align:left"><div class="small">${t.paused?'일시 정지':'휴식 타이머'}</div><b>${clock(seconds)}</b></div></button><div class="row">${button('timerAdd','+15초','small')}${button('timerToggle',icon(t.paused?'play':'pause'),'icon-btn','aria-label="타이머 일시 정지 또는 재개"')}${button('timerStop',icon('close'),'icon-btn','aria-label="타이머 종료"')}</div>`;}else if(float)float.remove();
 if(modal==='timer'){$('#sheet-timer').textContent=clock(t?seconds:data.settings.rest);$('#timer-status').textContent=t?(t.paused?'일시 정지':'휴식 중 · 다음 세트 준비'):'휴식을 시작하세요';$('#timer-toggle').innerHTML=icon(t&&!t.paused?'pause':'play')+(t?(t.paused?'계속하기':'일시 정지'):'시작');$('#timer-ring').style.strokeDashoffset=628.3*(1-(t?seconds/t.total:1));}
}
function toggleTimer(){if(!data.timer){startTimer();return;}const t=data.timer;if(t.paused){t.end=Date.now()+t.remaining*1000;t.paused=false;nativeTimer(t.remaining);}else{t.remaining=timerSeconds();t.paused=true;if(window.Android)Android.stopTimer();}save();timerUI();}
setInterval(()=>{
 if($('#elapsed')&&data.draft)$('#elapsed').textContent=clock(Math.max(0,Math.floor((Date.now()-data.draft.startedAt)/1000)));
 if(data.timer&&!data.timer.paused&&timerSeconds()<=0){data.timer=null;save();toast('휴식 끝! 다음 세트를 시작하세요.');if(!window.Android){try{const ctx=new (window.AudioContext||window.webkitAudioContext)(),o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);g.gain.value=.1;o.frequency.value=880;o.start();o.stop(ctx.currentTime+.35);o.onended=()=>ctx.close();}catch(e){}navigator.vibrate?.(300);}}
 timerUI();
},500);
const actions={
 navigate:b=>{page=b.dataset.page;closeSheet();render();window.scrollTo(0,0);},
 start:()=>startWorkout(),
 routine:b=>{if(data.draft){toast('진행 중인 운동을 먼저 완료하거나 취소해 주세요.');page='workout';render();return;}startWorkout(dateKey(),routines[Number(b.dataset.index)]);},
 day:b=>{selectedDate=b.dataset.date;month=parseDate(selectedDate);page='calendar';render();},
 month:b=>{month=new Date(month.getFullYear(),month.getMonth()+Number(b.dataset.delta),1);render();},
 today:()=>{month=new Date();selectedDate=dateKey();render();},
 recordDate:()=>{if(data.draft){toast('진행 중인 운동을 먼저 완료해 주세요.');page='workout';render();return;}startWorkout(selectedDate);},
 close:closeSheet,
 pick:openPicker,
 filter:b=>{pickerFilter=b.dataset.filter;refreshPicker();},
 pickExercise:b=>{const id=b.dataset.id;picked.has(id)?picked.delete(id):picked.add(id);refreshPicker();},
 addPicked:()=>{if(data.draft.exercises.length+picked.size>60){toast('한 번에 최대 60개 운동까지 기록할 수 있어요.');return;}for(const id of picked){if(!data.draft.exercises.some(e=>e.id===id))data.draft.exercises.push(newExercise(id));}save();closeSheet();render();},
 customExercise,
 saveCustom:()=>{const name=$('#custom-name').value.trim();if(!name){toast('운동 이름을 입력해 주세요.');return;}if(data.customExercises.length>=500){toast('직접 추가한 운동은 최대 500개까지 저장할 수 있어요.');return;}if(data.draft.exercises.length>=60){toast('최대 60개 운동까지 기록할 수 있어요.');return;}const e={id:'custom_'+cryptoId(),name,muscle:$('#custom-muscle').value,kind:$('#custom-kind').value,equipment:'직접 추가',weight:0};data.customExercises.push(e);data.draft.exercises.push(newExercise(e.id));save();closeSheet();render();},
 addSet:b=>{const e=data.draft.exercises[Number(b.dataset.index)];if(e.sets.length>=100){toast('운동당 최대 100세트까지 기록할 수 있어요.');return;}e.sets.push({...e.sets[e.sets.length-1],done:false});save();render();},
 checkSet:b=>{if(b.closest('.set-row')&&[...b.closest('.set-row').querySelectorAll('input')].some(i=>!i.checkValidity()||i.value.trim()==='')){toast('유효한 무게와 횟수 또는 시간을 입력해 주세요.');return;}const e=data.draft.exercises[Number(b.dataset.ex)],s=e.sets[Number(b.dataset.set)];if(!s.done&&(!Number.isInteger(s.reps)||s.reps<=0||s.reps>100000||!Number.isFinite(s.weightKg)||s.weightKg<0||s.weightKg>10000)){toast('유효한 무게와 횟수 또는 시간을 입력해 주세요.');return;}s.done=!s.done;if(s.done){try{window.Android?Android.haptic():navigator.vibrate?.(30);}catch(e){}if(data.settings.autoRest)startTimer();}save();render();},
 exerciseMenu:b=>{const i=Number(b.dataset.index),e=data.draft.exercises[i];sheet(esc(exercise(e.id).name),`${button('removeLastSet','마지막 세트 삭제','secondary full',`data-index="${i}" ${e.sets.length<=1?'disabled':''}`)}${button('removeExercise',icon('trash')+' 운동 삭제','secondary danger full',`data-index="${i}" style="margin-top:12px"`)}`,'exerciseMenu');},
 removeLastSet:b=>{const e=data.draft.exercises[Number(b.dataset.index)];if(e.sets.length>1)e.sets.pop();save();closeSheet();render();},
 removeExercise:b=>{data.draft.exercises.splice(Number(b.dataset.index),1);save();closeSheet();render();},
 unit:()=>{data.settings.unit=data.settings.unit==='kg'?'lb':'kg';save();render();toast('무게 단위: '+data.settings.unit);},
 setUnit:b=>{data.settings.unit=b.dataset.unit;save();render();},
 toggleRest:()=>{data.settings.autoRest=!data.settings.autoRest;save();render();},
 cancelWorkout:()=>confirmSheet('운동을 취소할까요?','진행 중인 운동의 입력 내용이 삭제됩니다. 저장한 과거 기록은 유지됩니다.','confirmCancel','취소하기'),
 confirmCancel:()=>{data.draft=null;stopTimer();save();closeSheet();page='home';render();},
 finish:finishWorkout,
 saveWorkout:()=>{const draft=data.draft;if(!draft)return;const now=Date.now(),s=JSON.parse(JSON.stringify(draft));s.exercises=s.exercises.map(e=>({...e,sets:e.sets.filter(a=>a.done)})).filter(e=>e.sets.length);s.finishedAt=now;s.duration=Math.max(0,Math.round((now-s.startedAt)/1000));data.sessions.push(s);data.draft=null;if(!save()){data.sessions.pop();data.draft=draft;return;}stopTimer();closeSheet();selectedDate=s.date;month=parseDate(s.date);page='calendar';render();window.scrollTo(0,0);toast('오늘의 운동을 저장했습니다. 수고했어요!');},
 viewSession:b=>sessionDetail(b.dataset.id),
 history:historySheet,
 chooseHistory:b=>selectedHistorySheet(b.dataset.id),
 repeat:b=>selectedHistorySheet(b.dataset.id),
 loadHistory:()=>importHistory(historySelection),
 appendHistory:()=>importHistory(historySelection,'append'),
 replaceHistory:()=>confirmSheet('운동 목록을 교체할까요?','현재 입력한 운동과 세트를 선택한 과거 기록으로 교체합니다. 지금 운동의 날짜와 메모는 유지됩니다.','confirmReplaceHistory','교체하기'),
 confirmReplaceHistory:()=>importHistory(historySelection),
 deleteSession:b=>{const id=b.dataset.id;confirmSheet('이 기록을 삭제할까요?','삭제한 기록은 백업 파일이 없으면 되돌릴 수 없습니다.','confirmDelete','삭제하기');$('#overlay [data-action="confirmDelete"]').dataset.id=id;},
 confirmDelete:b=>{data.sessions=data.sessions.filter(s=>s.id!==b.dataset.id);save();closeSheet();render();toast('기록을 삭제했습니다.');},
 timer:timerSheet,
 timerPreset:b=>startTimer(Number(b.dataset.seconds)),
 timerToggle:toggleTimer,
 timerStop:stopTimer,
 timerAdd:()=>{if(!data.timer)return;const s=Math.min(3600,timerSeconds()+15),paused=data.timer.paused;data.timer.remaining=s;data.timer.total=Math.max(data.timer.total,s);data.timer.end=Date.now()+s*1000;if(!paused)nativeTimer(s);save();timerUI();},
 widget:()=>{if(window.Android)Android.pinWidget();else toast('위젯은 안드로이드 APK에서 추가할 수 있어요.');},
 export:()=>{if(loadError){toast('읽기 오류가 있는 데이터를 백업할 수 없습니다.');return;}const raw=JSON.stringify(data,null,2);if(window.Android)Android.exportBackup(raw);else{const a=document.createElement('a'),url=URL.createObjectURL(new Blob([raw],{type:'application/json'}));a.href=url;a.download='liftlog-backup-'+dateKey()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}},
 import:()=>{if(window.Android)Android.importBackup();else $('#backup-file').click();},
 confirmImport:()=>{const before=data;stopTimer();data=window.pendingBackup;data.timer=null;loadError=false;if(!save()){data=before;return;}window.pendingBackup=null;page=data.draft?'workout':'home';closeSheet();render();toast('백업에서 기록을 복원했습니다.');},
 reset:()=>confirmSheet('모든 데이터를 초기화할까요?','운동 기록, 진행 중인 운동, 추가한 운동과 설정이 모두 삭제됩니다. 필요하면 먼저 백업을 저장해 주세요.','confirmReset','초기화'),
 confirmReset:()=>{stopTimer();data=fresh();loadError=false;save();page='home';closeSheet();render();toast('데이터를 초기화했습니다.');}
};
document.addEventListener('click',event=>{const b=event.target.closest('[data-action]');if(b&&!b.disabled){try{actions[b.dataset.action]?.(b);}catch(e){console.error(e);toast('작업을 완료하지 못했습니다. 다시 시도해 주세요.');}}else if(event.target.classList.contains('overlay-backdrop'))closeSheet();});
document.addEventListener('input',event=>{
 const el=event.target;
 if(el.id==='history-search'){historyQuery=el.value;refreshHistory();return;}
 if(el.id==='exercise-search'){pickerQuery=el.value;refreshPicker();return;}
 if(el.id==='session-name'&&data.draft){data.draft.name=el.value.slice(0,80);save();return;}
 if(el.id==='workout-notes'&&data.draft){data.draft.notes=el.value.slice(0,2000);save();return;}
 if(el.dataset.field&&data.draft){
  const s=data.draft.exercises[Number(el.dataset.ex)].sets[Number(el.dataset.set)],n=Number(el.value),valid=el.value.trim()!==''&&Number.isFinite(n)&&n>=0;
  if(s.done){s.done=false;el.closest('.set-row').classList.remove('done');el.closest('.set-row').querySelector('.check').classList.remove('done');el.closest('.set-row').querySelector('.check').setAttribute('aria-pressed','false');save();}
  if(!valid){el.setCustomValidity('숫자를 입력해 주세요.');return;}
  if(el.dataset.field==='weight'){if(asKg(n)>10000){el.setCustomValidity('무게가 너무 큽니다.');return;}s.weightKg=asKg(n);}else{if(!Number.isInteger(n)||n>100000){el.setCustomValidity('정수로 입력해 주세요.');return;}s.reps=n;}
  el.setCustomValidity('');if(s.done){s.done=false;el.closest('.set-row').classList.remove('done');el.closest('.set-row').querySelector('.check').classList.remove('done');el.closest('.set-row').querySelector('.check').setAttribute('aria-pressed','false');}save();
 }
});
document.addEventListener('change',event=>{const el=event.target;
 if(el.id==='rest-setting'){data.settings.rest=Number(el.value);save();}
 if(el.id==='goal-setting'){data.settings.goal=Number(el.value);save();}
 if(el.id==='insight-exercise'){insightId=el.value;render();}
 if(el.id==='backup-file'&&el.files[0]){const file=el.files[0];if(file.size>5000000){toast('5MB 이하의 백업 파일을 선택해 주세요.');return;}file.text().then(importBackup).catch(()=>toast('파일을 읽지 못했습니다.'));el.value='';}
});
window.importBackup=raw=>{try{if(typeof raw!=='string'||raw.length>5000000)throw Error();const next=validate(JSON.parse(raw));window.pendingBackup=next;confirmSheet('백업을 복원할까요?',`${next.sessions.length}개의 운동 기록이 있습니다. 현재 기기의 데이터를 이 백업 내용으로 교체합니다.`,'confirmImport','복원하기');}catch(e){toast('유효한 리프트로그 백업 파일이 아닙니다.');}};
window.quickStart=()=>startWorkout();
window.handleBack=()=>{if(modal){closeSheet();return true;}if(page!=='home'){page='home';render();return true;}return false;};
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSheet();if(e.key==='Tab'&&modal){const f=[...$('#overlay').querySelectorAll('button:not(:disabled),input,select,textarea')];if(!f.length)return;if(e.shiftKey&&document.activeElement===f[0]){e.preventDefault();f.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===f.at(-1)){e.preventDefault();f[0].focus();}}});
if(data.timer&&!data.timer.paused&&timerSeconds()===0){data.timer=null;save();}
render();
if(loadError){page='settings';render();toast('저장 데이터를 읽지 못했습니다. 설정에서 확인해 주세요.');}
