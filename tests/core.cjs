const path=require('path');
const assets=path.resolve(__dirname,'../app/src/main/assets/app.js');
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const nodes=new Map();const node=()=>({innerHTML:'',textContent:'',className:'',style:{},dataset:{},value:'',disabled:false,querySelectorAll:()=>[],querySelector:()=>null,remove(){}});
const listeners={};const storage={};const context={console,Intl,Date,Math,Number,Array,Set,JSON,Error,String,Boolean,Object,parseInt,isNaN,
 document:{querySelector:s=>nodes.get(s)||null,createElement:()=>node(),body:{append(n){nodes.set('#timer-float',n);}},addEventListener:(k,fn)=>listeners[k]=fn},
 localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},navigator:{},setTimeout:()=>1,clearTimeout(){},setInterval(){},window:{scrollTo(){}}};
 ['#app','#overlay','#toast','#picker-filters','#picker-results','#picker-add'].forEach(s=>nodes.set(s,node()));context.scrollTo=()=>{};context.window=context;vm.createContext(context);
 vm.runInContext(fs.readFileSync(assets,'utf8'),context);
 function run(code){return vm.runInContext(code,context);}function test(msg,code){assert.ok(run(code),msg);console.log('PASS '+msg);}
 run("startWorkout(dateKey(),routines[0])");test('루틴 운동 구성',"data.draft.exercises.length===4");
 run("data.draft.exercises[0].sets[0]={weightKg:50,reps:8,done:true};save()");test('기기 저장',"JSON.parse(localStorage.getItem('liftlog-v1')).draft.exercises[0].sets[0].weightKg===50");
 run("data.settings.unit='lb'");test('kg/lb 변환',"Math.abs(weight(50)-110.23)<0.001");run("data.settings.unit='kg'");test('단위 전환 원본 보존',"data.draft.exercises[0].sets[0].weightKg===50");test('세트 볼륨 계산',"volume(data.draft)===400");
 run('startTimer(90)');test('타이머 시작',"data.timer.total===90&&!data.timer.paused&&timerSeconds()<=90");run('toggleTimer()');test('타이머 일시 정지',"data.timer.paused&&data.timer.remaining>0");run('toggleTimer()');test('타이머 재개',"!data.timer.paused");run('stopTimer()');test('타이머 종료',"data.timer===null");
 run('actions.saveWorkout()');test('완료된 운동 저장',"data.sessions.length===1&&data.draft===null");test('미완료 세트 제외',"data.sessions[0].exercises.length===1&&data.sessions[0].exercises[0].sets.length===1");test('날짜별 기록',"data.sessions[0].date===dateKey()&&weekSessions().length===1");
 test('정상 백업 유효성',"validate(JSON.parse(JSON.stringify(data))).sessions.length===1");test('손상 백업 거부',"(()=>{try{validate({version:1,sessions:[]});return false;}catch(e){return true;}})()");test('숫자 오류 백업 거부',"(()=>{let x=JSON.parse(JSON.stringify(data));x.sessions[0].exercises[0].sets[0].weightKg=-1;try{validate(x);return false;}catch(e){return true;}})()");test('잘못된 날짜 백업 거부',"(()=>{let x=JSON.parse(JSON.stringify(data));x.sessions[0].date='2026-02-31';try{validate(x);return false;}catch(e){return true;}})()");
 run('window.quickStart()');test('위젯 JS 시작 경로',"data.draft!==null");run('actions.confirmCancel()');test('취소 시 기존 기록 보존',"data.draft===null&&data.sessions.length===1");
 test('과거 운동 불러오기',"lastExercise('squat').sets[0].weightKg===50");
 run("startWorkout(dateKey(),routines[1]);data.draft.exercises[0].sets[0].weightKg=80;save()");
 const reload={...context,window:null};reload.window=reload;vm.createContext(reload);vm.runInContext(fs.readFileSync(assets,'utf8'),reload);
 assert.equal(vm.runInContext("data.draft.exercises[0].sets[0].weightKg",reload),80);console.log('PASS 앱 재실행 진행 기록 복구');
 run("actions.confirmCancel();page='insights';render();page='settings';render();page='calendar';render();page='routines';render();page='home';render()");console.log('PASS 각 화면 HTML 생성');
 ['#history-count','#history-results'].forEach(s=>nodes.set(s,node()));
 run(`data=fresh();data.sessions=[
 {id:'old',date:'2026-09-01',name:'상체 A',startedAt:1000,finishedAt:2000,duration:100,notes:'과거 메모',exercises:[{id:'bench',sets:[{weightKg:40,reps:8,done:true},{weightKg:45,reps:6,done:true}]},{id:'plank',sets:[{weightKg:0,reps:60,done:true}]}]},
 {id:'new',date:'2026-10-01',name:'상체 B',startedAt:3000,finishedAt:4000,duration:100,notes:'',exercises:[{id:'bench',sets:[{weightKg:70,reps:5,done:true}]}]}
 ];save()`);
 test('과거 기록 날짜순 정렬',"historyMatches()[0].id==='new'");
 test('운동 이름 검색',"historyMatches('상체 A').length===1&&historyMatches('상체 A')[0].id==='old'");
 test('운동 종목 검색',"historyMatches('플랭크').length===1");
 test('날짜와 종목 복합 검색',"historyMatches('2026-09 벤치')[0].id==='old'");
 test('검색 결과 없음',"historyMatches('없는운동').length===0");
 run('historySheet()');test('과거 기록 선택 목록 생성',"modal==='history'&&document.querySelector('#history-results').innerHTML.includes('상체 A')");
 run("actions.chooseHistory({dataset:{id:'old'}})");test('선택 날짜의 세트 미리보기',"modal==='historyPreview'&&document.querySelector('#overlay').innerHTML.includes('40 kg × 8회')");
 run('actions.loadHistory()');test('선택한 과거 무게를 정확히 복사',"data.draft.exercises[0].sets[0].weightKg===40&&data.draft.exercises[0].sets[1].weightKg===45");
 test('다른 최신 기록의 무게를 가져오지 않음',"lastExercise('bench').sets[0].weightKg===70&&data.draft.exercises[0].sets[0].weightKg===40");
 test('시간 운동 복사',"data.draft.exercises[1].sets[0].reps===60");
 test('복사한 세트 미완료 시작',"data.draft.exercises.every(e=>e.sets.every(s=>!s.done))");
 test('새 운동 날짜와 ID 생성',"data.draft.date===dateKey()&&data.draft.id!=='old'&&data.draft.notes===''");
 run("data.draft.exercises[0].sets[0].weightKg=99");test('수정 시 과거 원본 불변',"data.sessions[0].exercises[0].sets[0].weightKg===40");
 run("data.draft.notes='현재 메모';data.draft.date='2026-09-20';data.draft.exercises[0].sets[0].done=true;startTimer(90);importHistory('new','append')");
 test('기존 운동 세트 뒤에 추가',"data.draft.exercises[0].sets.length===3&&data.draft.exercises[0].sets[2].weightKg===70&&data.draft.exercises[0].sets[0].done");
 test('추가 시 기존 날짜·메모·타이머 보존',"data.draft.date==='2026-09-20'&&data.draft.notes==='현재 메모'&&data.timer!==null");
 run("historySelection='old';actions.replaceHistory()");test('교체 전 확인 화면',"modal==='confirm'&&data.draft.exercises[0].sets[0].weightKg===99");
 run('actions.confirmReplaceHistory()');test('교체 시 과거 세트 적용 및 날짜·메모 보존',"data.draft.exercises[0].sets[0].weightKg===40&&data.draft.date==='2026-09-20'&&data.draft.notes==='현재 메모'&&data.timer===null");
 run("data.settings.unit='lb'");test('과거 기록의 lb 표시와 원본 kg 보존',"setDescription(data.draft.exercises[0].sets[0],'strength').includes('88.2 lb')&&data.draft.exercises[0].sets[0].weightKg===40");
 test('기존 백업 스키마 유지',"validate(JSON.parse(JSON.stringify(data))).version===1");
 const previous=run('JSON.stringify(data)');run("importHistory('missing')");assert.equal(run('JSON.stringify(data)'),previous);console.log('PASS 없는 기록 거부 및 데이터 보존');
 run("data.draft.exercises[0].sets=Array.from({length:100},()=>({weightKg:40,reps:8,done:false}));save()");const atLimit=run('JSON.stringify(data)');run("importHistory('old','append')");assert.equal(run('JSON.stringify(data)'),atLimit);console.log('PASS 세트 한도 초과 시 기존 입력 보존');
 run("data=fresh();historySheet()");test('첫 사용자 빈 기록 안내',"document.querySelector('#history-results').innerHTML.includes('불러올 운동 기록이 아직 없어요')");
