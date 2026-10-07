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
