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

// Upgrade regressions: catalog compatibility, search, add/delete and undo semantics.
test('기본 운동 294개',"library.length===294");
test('운동 ID 중복 없음',"new Set(library.map(e=>e.id)).size===library.length");
test('장비와 부위 복합 검색',"searchExercises('케이블 등').length>5&&searchExercises('케이블 등').every(e=>e.muscle==='등'&&e.equipment==='케이블')");
test('띄어쓰기 없는 운동 검색',"searchExercises('힙어브덕션').length===2");
test('다른 한글 표기 검색',"searchExercises('렛풀다운')[0].id==='latpull'");
run("data=fresh();startWorkout(dateKey(),routines[0]);data.draft.exercises[0].sets[2]={weightKg:52.5,reps:8,done:true};addSets(0)");
test('세트 추가 이전 값 복사 및 미완료',"data.draft.exercises[0].sets.length===4&&data.draft.exercises[0].sets[3].weightKg===52.5&&data.draft.exercises[0].sets[3].reps===8&&!data.draft.exercises[0].sets[3].done");
run('addSets(0,3)');test('3세트 한 번에 추가',"data.draft.exercises[0].sets.length===7&&data.draft.exercises[0].sets.slice(-3).every(s=>s.weightKg===52.5&&!s.done)");
run('deleteSet(0,2)');test('선택한 세트만 삭제',"data.draft.exercises[0].sets.length===6&&data.draft.exercises[0].sets[2].done===false");
run('undoDeletedSet()');test('삭제 복원 위치 값 완료 상태 보존',"data.draft.exercises[0].sets.length===7&&data.draft.exercises[0].sets[2].weightKg===52.5&&data.draft.exercises[0].sets[2].done");
run('undoDeletedSet()');test('복원 중복 방지',"data.draft.exercises[0].sets.length===7");
run('data.draft.exercises[0].sets=[{weightKg:0,reps:10,done:false}];deleteSet(0,0)');test('마지막 한 세트 보호',"data.draft.exercises[0].sets.length===1");
run('data.draft.exercises[0].sets=Array.from({length:99},()=>({weightKg:20,reps:10,done:false}));addSets(0,3)');test('빠른 추가 100세트 한도 보호',"data.draft.exercises[0].sets.length===99");
run('addSets(0);addSets(0)');test('한 세트 추가 100세트 한도 보호',"data.draft.exercises[0].sets.length===100");
run('deleteSet(0,0);const oldId=data.draft.id;data.draft.id="another-draft";undoDeletedSet()');test('다른 운동에 잘못 복원하지 않음',"data.draft.exercises[0].sets.length===99");
test('확장 운동 포함 백업 검증',"(()=>{const x=fresh();x.draft={id:'test',date:dateKey(),name:'test',notes:'',startedAt:Date.now(),exercises:[newExercise('ex_001')]};return validate(x).draft.exercises[0].id==='ex_001';})()");
// Elapsed time regression: a draft left for days must never become an 8000-minute workout.
test('전체 시간 시분초 구분',"workoutClock(3661)==='01:01:01'&&workoutClock(61)==='00:01:01'");
run("data=fresh();data.draft={id:'abandoned',date:dateKey(),name:'오래된 운동',notes:'메모',startedAt:Date.now()-8000*60000,exercises:[newExercise('bench')]};normalizeClock()");
test('8000분 방치 기록 2시간 자동 제한',"data.draft.clock.paused&&data.draft.clock.limitReached&&!data.draft.clock.needsReview&&workoutElapsedMs()===WORKOUT_MAX_MS");
test('오래된 진행 세트와 메모 보존',"data.draft.exercises[0].sets.length===3&&data.draft.notes==='메모'");
run('data.draft.clock={...newClock(100000),elapsedMs:60000};checkpointClock(130000)');
test('운동 시간 정확히 누적',"data.draft.clock.elapsedMs===90000&&workoutElapsedMs(data.draft,140000)===100000");
run('data.draft.clock.paused=true');test('일시정지 중 시간 불변',"workoutElapsedMs(data.draft,800000)===90000");
run('data.draft.clock={...newClock(100000),elapsedMs:60000,lastSeenMs:130000};normalizeClock(data.draft,100000+WORKOUT_MAX_MS+100000)');
test('재실행 긴 공백도 2시간에서 자동 정지',"data.draft.clock.paused&&data.draft.clock.limitReached&&data.draft.clock.elapsedMs===WORKOUT_MAX_MS");
test('과거 비정상 시간은 원본 보존하고 통계 제외',"(()=>{const s={duration:8000*3600};return reliableDuration(s)===0&&durationLabel(s)==='시간 확인 필요'&&s.duration===8000*3600})()");
test('확인한 장시간 기록은 통계 반영',"reliableDuration({duration:13*3600,durationConfirmed:true})===13*3600");
run("data=fresh();startWorkout(dateKey(),routines[0]);data.settings.exerciseRest={squat:120};actions.checkSet({dataset:{ex:'0',set:'0'},closest:()=>null})");
test('종목별 휴식 자동 적용',"data.timer.total===120&&data.timer.exerciseId==='squat'");
run('adjustTimer(-15)');test('휴식 15초 감소',"timerSeconds()<=105&&timerSeconds()>103");
run('toggleTimer();adjustTimer(15)');test('정지 상태 시간 조절',"data.timer.paused&&data.timer.remaining>=118&&data.timer.remaining<=120");
run('window.nativeRestStopped()');test('알림 건너뛰기 UI 동기화',"data.timer===null");
run("data.settings.favorites=['squat','bench']");test('즐겨찾기 검색',"searchExercises('', '즐겨찾기').length===2&&searchExercises('스쿼트','즐겨찾기')[0].id==='squat'");
run("data.customRoutines=[{id:'r1',name:'내 루틴',exercises:[newExercise('bench')]}]");test('사용자 루틴 백업 검증',"validate(JSON.parse(JSON.stringify(data))).customRoutines[0].exercises[0].id==='bench'");
test('손상된 시계 백업 거부',"(()=>{const x=JSON.parse(JSON.stringify(data));x.draft.clock.elapsedMs=-1;try{validate(x);return false}catch(e){return true}})()");

run("data=fresh();startWorkout(dateKey(),routines[0]);data.settings.exerciseRest={squat:150};toggleTimer()");test('하단 수동 시작도 다음 운동의 휴식 시간 적용',"data.timer.total===150&&data.timer.exerciseId==='squat'");

// Moving a completed workout changes its calendar day, never its recorded effort.
nodes.set('#session-date',node());
run("data=fresh();data.sessions=[{id:'date-edit',date:'2026-09-01',name:'날짜 테스트',startedAt:1000,finishedAt:2000,duration:600,notes:'날짜만 바꿔요',exercises:[{id:'bench',sets:[{weightKg:40,reps:8,done:true}]}]}];sessionDateSheet('date-edit')");
test('기록 상세 날짜 수정 화면',"modal==='sessionDate'&&document.querySelector('#overlay').innerHTML.includes('2026-09-01')");
run("document.querySelector('#session-date').value='2026-09-14';saveSessionDate()");
test('기록 날짜 변경과 달력 이동',"data.sessions[0].date==='2026-09-14'&&selectedDate==='2026-09-14'&&month.getMonth()===8&&page==='calendar'&&modal==='detail'");
test('날짜 수정 시 세트와 시간 메모 보존',"data.sessions[0].startedAt===1000&&data.sessions[0].finishedAt===2000&&data.sessions[0].duration===600&&data.sessions[0].notes==='날짜만 바꿔요'&&data.sessions[0].exercises[0].sets[0].weightKg===40");
test('수정 날짜 백업과 재실행 저장',"validate(JSON.parse(localStorage.getItem('liftlog-v1'))).sessions[0].date==='2026-09-14'");
run("sessionDateSheet('date-edit');document.querySelector('#session-date').value='2026-02-31';saveSessionDate()");test('존재하지 않는 날짜 거부',"data.sessions[0].date==='2026-09-14'&&modal==='sessionDate'");
run("document.querySelector('#session-date').value='2999-01-01';saveSessionDate()");test('미래 운동 날짜 거부',"data.sessions[0].date==='2026-09-14'&&modal==='sessionDate'");
run("document.querySelector('#session-date').value='';saveSessionDate()");test('빈 날짜 거부',"data.sessions[0].date==='2026-09-14'");
run("document.querySelector('#session-date').value='2026-09-15';loadError=true;saveSessionDate();loadError=false");test('저장 실패 시 원래 날짜 보존',"data.sessions[0].date==='2026-09-14'");

// Two-hour cap across active use, pause/resume, reboot and saving.
run("data=fresh();startWorkout(dateKey(),routines[0]);data.draft.clock=newClock(100000)");
test('2시간 직전까지 정상 측정',"workoutElapsedMs(data.draft,100000+WORKOUT_MAX_MS-1)===WORKOUT_MAX_MS-1&&!data.draft.clock.paused");
run("normalizeClock(data.draft,100000+WORKOUT_MAX_MS)");
test('정확히 2시간에 자동 정지',"data.draft.clock.elapsedMs===WORKOUT_MAX_MS&&data.draft.clock.paused&&data.draft.clock.limitReached&&data.draft.clock.autoStoppedAt===100000+WORKOUT_MAX_MS");
run("normalizeClock(data.draft,100000+86400000);normalizeClock(data.draft,100000+86400000)");
test('다음 날에도 2시간과 자동 정지 시각 유지',"workoutElapsedMs(data.draft,100000+86400000)===WORKOUT_MAX_MS&&data.draft.clock.autoStoppedAt===100000+WORKOUT_MAX_MS");
run("toggleWorkoutClock()");
test('2시간 제한 후 이어하기로 초과 불가',"data.draft.clock.paused&&workoutElapsedMs()===WORKOUT_MAX_MS");
run("data.draft.clock={...newClock(100000),elapsedMs:60000,paused:true};normalizeClock(data.draft,100000+86400000)");
test('명시적 일시정지 시간은 누적하지 않음',"data.draft.clock.elapsedMs===60000&&!data.draft.clock.limitReached&&data.draft.clock.paused");
run("data.draft.clock={...newClock(Date.now()),elapsedMs:WORKOUT_MAX_MS+100000,paused:true};normalizeClock()");
test('이전 버전의 초과 시계도 2시간 제한',"data.draft.clock.elapsedMs===WORKOUT_MAX_MS&&data.draft.clock.limitReached");
run("data.draft.exercises[0].notes='등을 패드에 고정';data.draft.exercises[0].sets[0].done=true;save();actions.saveWorkout()");
test('자동 정지 후 세트와 메모 저장',"data.draft===null&&data.sessions[0].duration===7200&&data.sessions[0].exercises[0].notes==='등을 패드에 고정'&&data.sessions[0].exercises[0].sets[0].done");
test('완료 메모 백업 검증',"validate(JSON.parse(localStorage.getItem('liftlog-v1'))).sessions[0].exercises[0].notes==='등을 패드에 고정'");
test('형식이 잘못된 운동 메모 백업 거부',"(()=>{const x=JSON.parse(JSON.stringify(data));x.sessions[0].exercises[0].notes=42;try{validate(x);return false}catch(e){return true}})()");
test('너무 긴 운동 메모 백업 거부',"(()=>{const x=JSON.parse(JSON.stringify(data));x.sessions[0].exercises[0].notes='가'.repeat(2001);try{validate(x);return false}catch(e){return true}})()");
test('새 운동은 지난 메모를 덮어쓰지 않음',"newExercise(data.sessions[0].exercises[0].id).notes===''");
run("const sourceId=data.sessions[0].id;importHistory(sourceId)");
test('지난 운동 불러오기 메모 동반 보존',"data.draft.exercises[0].notes==='등을 패드에 고정'&&!data.draft.exercises[0].sets[0].done");
run("data.draft.exercises[0].notes='현재 운동 메모';importHistory(data.sessions[0].id,'append')");
test('지난 세트 추가 시 현재 메모 보존',"data.draft.exercises[0].notes==='현재 운동 메모'&&data.draft.exercises[0].sets.length===2");
test('메모 HTML을 안전한 텍스트로 표시',"exerciseNoteText({notes:'<script>alert(1)</script>\\n두 번째 줄'}).includes('&lt;script&gt;')&&!exerciseNoteText({notes:'<script>'}).includes('<script>')");
nodes.set('#clock-minutes',node());nodes.set('#clock-seconds',node());
run("document.querySelector('#clock-minutes').value='120';document.querySelector('#clock-seconds').value='1'");
test('2시간 1초 입력 거부',"Number.isNaN(readDuration('#clock-minutes','#clock-seconds',WORKOUT_MAX_MS/1000))");
run("document.querySelector('#clock-seconds').value='0'");
test('정확히 120분 입력 허용',"readDuration('#clock-minutes','#clock-seconds',WORKOUT_MAX_MS/1000)===7200");


// Editing metadata must preserve quantities; a new recording unit gets a new identity.
run("data=fresh();startWorkout(dateKey(),{name:'수정 테스트',ids:['bench','squat']});data.draft.exercises[0].sets[0]={weightKg:52.5,reps:8,done:true};data.draft.exercises[0].notes='남겨둘 메모';data.sessions=[{id:'past-kind',date:'2026-09-01',name:'지난 운동',startedAt:1000,finishedAt:2000,duration:600,notes:'',exercises:[{id:'bench',sets:[{weightKg:40,reps:10,done:true}]}]}];openPicker(0);requestExerciseReplacement('ohp')");
test('동일 기록 방식 종목 변경 시 세트 값과 완료 메모 유지',"data.draft.exercises[0].id==='ohp'&&data.draft.exercises[0].sets[0].weightKg===52.5&&data.draft.exercises[0].sets[0].reps===8&&data.draft.exercises[0].sets[0].done&&data.draft.exercises[0].notes==='남겨둘 메모'");
test('운동 종목 변경은 과거 기록을 바꾸지 않음',"data.sessions[0].exercises[0].id==='bench'&&data.sessions[0].exercises[0].sets[0].weightKg===40");
run("openPicker(0);requestExerciseReplacement('plank')");
test('다른 단위로 바꾸기 전 확인',"modal==='confirm'&&data.draft.exercises[0].id==='ohp'");
run("replaceWorkoutExercise('plank',true)");test('시간 종목 변경은 초 단위 기본 세트로 시작',"data.draft.exercises[0].id==='plank'&&data.draft.exercises[0].sets[0].reps===60&&!data.draft.exercises[0].sets[0].done&&data.draft.exercises[0].notes==='남겨둘 메모'");
run("openPicker(0)");test('이미 있는 운동으로 중복 변경 거부',"replaceWorkoutExercise('squat',true)===false&&data.draft.exercises[0].id==='plank'");
run("openPicker(0);loadError=true;replaceWorkoutExercise('run',true);loadError=false");test('종목 교체 저장 실패 시 원래 세트 보존',"data.draft.exercises[0].id==='plank'&&data.draft.exercises[0].sets[0].reps===60");
run("exerciseInfoSheet(1);applyExerciseInfo({...exerciseEditContext,values:{name:'내 스쿼트',muscle:'하체',equipment:'파워랙',kind:'strength'}})");
test('기본 운동 이름 부위 기구 수정',"exercise('squat').name==='내 스쿼트'&&exercise('squat').equipment==='파워랙'&&data.draft.exercises[1].id==='squat'");
test('수정한 이름 검색',"searchExercises('내 스쿼트')[0].id==='squat'");
test('운동 수정 정보 백업 검증',"validate(JSON.parse(JSON.stringify(data))).settings.exerciseOverrides.squat.name==='내 스쿼트'");
test('수정 정보로 기본 운동의 단위를 몰래 바꾸는 백업 거부',"(()=>{const x=JSON.parse(JSON.stringify(data));x.settings.exerciseOverrides.squat.kind='duration';try{validate(x);return false}catch(e){return true}})()");
run("exerciseInfoSheet(0);applyExerciseInfo({...exerciseEditContext,values:{name:'플랭크 반복',muscle:'코어',equipment:'매트',kind:'bodyweight'}})");
test('기록 방식 변경은 새 운동 ID로 분리',"data.draft.exercises[0].id.startsWith('custom_')&&exercise(data.draft.exercises[0].id).kind==='bodyweight'&&exercise('plank').kind==='duration'&&data.draft.exercises[0].notes==='남겨둘 메모'");
run("window.editedCustomId=data.draft.exercises[0].id;exerciseInfoSheet(0);applyExerciseInfo({...exerciseEditContext,values:{name:'내 플랭크',muscle:'기타',equipment:'맨몸',kind:'bodyweight'}})");
test('직접 추가한 운동 정보 수정은 ID와 세트 유지',"data.draft.exercises[0].id===window.editedCustomId&&exercise(window.editedCustomId).name==='내 플랭크'&&data.draft.exercises[0].sets[0].reps===10");
run("exerciseInfoSheet(0);loadError=true;applyExerciseInfo({...exerciseEditContext,values:{name:'실패할 수정',muscle:'기타',equipment:'',kind:'duration'}});loadError=false");
test('운동 정보 저장 실패 시 새 ID와 단위 변경 취소',"data.draft.exercises[0].id===window.editedCustomId&&exercise(window.editedCustomId).name==='내 플랭크'&&data.customExercises.length===1");
