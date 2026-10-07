const {webkit,chromium}=require('playwright');
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../web'),out=path.resolve(__dirname,'../ui-results');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const server=http.createServer((req,res)=>{let route=new URL(req.url,'http://localhost').pathname;if(route==='/')route='/index.html';const p=path.join(root,route);if(!p.startsWith(root+path.sep)||!fs.existsSync(p)){res.writeHead(404);res.end();return;}const ext=path.extname(p);res.setHeader('Content-Type',{'.js':'application/javascript','.css':'text/css','.html':'text/html','.png':'image/png','.webmanifest':'application/manifest+json'}[ext]||'text/plain');res.end(fs.readFileSync(p));});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url=process.env.LIFTLOG_PWA_URL||'http://127.0.0.1:'+server.address().port;
 for(const [engine,name] of [[webkit,'safari'],[chromium,'chromium']]){
  const browser=await engine.launch();const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);await page.waitForTimeout(400);
  assert.equal(await page.locator('h1').innerText(),'오늘도, 나를 위한 한 세트 ♡');
  assert.equal(await page.evaluate(()=>getComputedStyle(document.querySelector('.screen')).backgroundColor),'rgb(255, 247, 250)');
  await page.screenshot({path:path.join(out,name+'-home.png'),fullPage:true});
  await page.locator('[data-action="start"]').click();await page.fill('#exercise-search','벤치');await page.locator('[data-action="pickExercise"]').click();await page.locator('[data-action="addPicked"]').click();
  await page.locator('[data-field="weight"]').first().fill('40');await page.locator('[data-field="reps"]').first().fill('8');await page.locator('[data-action="checkSet"]').first().click();
  await page.locator('[data-action="timerStop"]').click();await page.screenshot({path:path.join(out,name+'-workout.png'),fullPage:true});
  await page.locator('[data-action="finish"]').click();await page.locator('[data-action="saveWorkout"]').click();
  assert.equal(await page.locator('.calendar-date.has-record').count(),1);await page.screenshot({path:path.join(out,name+'-calendar.png'),fullPage:true});
  await page.locator('[data-page="home"]').last().click();await page.locator('[data-action="history"]').first().click();await page.fill('#history-search','벤치');await page.locator('[data-action="chooseHistory"]').click();await page.locator('[data-action="loadHistory"]').click();assert.equal(await page.locator('[data-field="weight"]').first().inputValue(),'40');
  await page.locator('[data-action="navigate"][data-page="home"]').first().click();await page.locator('[data-page="settings"]').first().click();await page.locator('[data-action="installWeb"]').click();assert(await page.getByText('홈 화면에 리프트로그 추가',{exact:true}).isVisible());assert((await page.locator('.sheet').innerText()).includes('홈 화면에 추가'));await page.locator('[data-action="close"]').first().click();
  assert((await page.locator('.screen').innerText()).includes('웹앱에는 아이폰 네이티브 위젯'));
  await page.setViewportSize({width:320,height:720});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=320));
  if(url.startsWith('https:')){await page.evaluate(()=>navigator.serviceWorker.ready);const cached=await page.evaluate(async()=>Promise.all(['index.html','app.js','theme.css'].map(async file=>!!(await caches.match(new URL(file,location.href).href)))));assert(cached.every(Boolean));console.log('PASS '+name+' 오프라인 앱 자산 캐시');if(name==='chromium'){await page.reload();await page.context().setOffline(true);await page.reload();assert(await page.locator('#app').isVisible());await page.context().setOffline(false);console.log('PASS '+name+' 오프라인 다시 열기');}}
  assert.deepEqual(errors,[]);await browser.close();console.log('PASS '+name+' 운동 기록, 과거 불러오기, 설치 안내, 320px 화면 및 JS 오류 검사');
 }
 server.close();
})().catch(e=>{console.error(e);process.exit(1);});
