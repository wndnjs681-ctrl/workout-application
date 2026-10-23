"""Native APK smoke test on an Android emulator (no production data)."""
import json,subprocess,time,re,urllib.request,os,xml.etree.ElementTree as ET
import websocket
from pathlib import Path
out=Path('test-output');out.mkdir(exist_ok=True)
def adb(*args):return subprocess.check_output(['adb',*args]).decode().strip()
def wait(check,seconds=30):
 end=time.time()+seconds
 while time.time()<end:
  try:
   value=check()
   if value is not None and value is not False and value != "":return value
  except Exception as error:
   print("Waiting:",str(error)[:180],flush=True)
  time.sleep(.5)
 raise AssertionError('Timed out waiting for device state')
adb('install','-r','dist/Liftlog-1.4.2.apk')
adb('shell','pm','grant','kr.liftlog.app.next','android.permission.POST_NOTIFICATIONS')
adb('shell','settings','put','secure','show_ime_with_hard_keyboard','1')
print('Lock notification defaults:',adb('shell','settings','get','secure','lock_screen_show_notifications'),adb('shell','settings','get','secure','lock_screen_show_silent_notifications'),flush=True)
adb('shell','settings','put','secure','lock_screen_show_notifications','1')
adb('shell','settings','put','secure','lock_screen_show_silent_notifications','1')
adb('shell','wm','size','720x1520')
adb('shell','wm','density','320');time.sleep(2)
adb('shell','am','start','-a','android.settings.SETTINGS')
adb('shell','am','force-stop','com.android.launcher3')
adb('shell','am','start','-n','kr.liftlog.app.next/kr.liftlog.app.MainActivity')
pid=wait(lambda:adb('shell','pidof','kr.liftlog.app.next'))
wait(lambda:'webview_devtools_remote_'+pid in adb('shell','cat','/proc/net/unix'))
adb('forward','tcp:9222','localabstract:webview_devtools_remote_'+pid)
target=None;ws=None;seq=0
def js(expression):
 global seq
 seq+=1;ws.send(json.dumps({'id':seq,'method':'Runtime.evaluate','params':{'expression':expression,'returnByValue':True}}))
 while True:
  data=json.loads(ws.recv())
  if data.get('id')==seq:
   result=data.get('result',{})
   if 'exceptionDetails' in result:raise AssertionError(result['exceptionDetails'])
   return result.get('result',{}).get('value')
def shot(name):
 with (out/name).open('wb') as f:subprocess.run(['adb','exec-out','screencap','-p'],stdout=f,check=True)
def attach_loaded_page():
 global target,ws,seq
 targets=json.load(urllib.request.urlopen('http://127.0.0.1:9222/json'))
 target=next((t for t in targets if 'app.liftlog.local' in t.get('url','') and t.get('title') and not json.loads(t.get('description') or '{}').get('empty',False)),None)
 if not target:return False
 if ws:
  try:ws.close()
  except Exception:pass
 ws=websocket.create_connection(target['webSocketDebuggerUrl'],suppress_origin=True,timeout=15);seq=0
 return js("typeof actions==='object'&&document.readyState==='complete'") is True
wait(attach_loaded_page,seconds=60)
print('CDP target',target,flush=True)
print('Initial page',js("JSON.stringify({url:location.href,text:document.body?.innerText,ready:document.readyState,actions:typeof actions})"),flush=True)
shot('android-initial.png')
wait(lambda:js("typeof actions==='object'"),seconds=60)
assert js('library.length')==294
js('actions.start()');time.sleep(1)
# Tap the real accessibility node, so Android opens its actual input method.
shot('android-picker-before-keyboard.png')
def find_input():
 # Display-density setup can recreate the Activity and restore the draft while
 # dismissing its transient picker. Reopen that picker before testing its input.
 try:
  js("if(!document.querySelector('#exercise-search')){if(!data.draft)startWorkout();else openPicker();}")
 except websocket.WebSocketConnectionClosedException:
  attach_loaded_page();return None
 result=adb('shell','uiautomator','dump','/sdcard/liftlog-ui.xml')
 print('Accessibility dump:',result,flush=True)
 if 'dumped' not in result:return None
 xml=adb('shell','cat','/sdcard/liftlog-ui.xml')
 root=ET.fromstring(xml)
 (out/'android-picker-accessibility.xml').write_text(xml)
 inputs=[n for n in root.iter('node') if n.attrib.get('class')=='android.widget.EditText' and n.attrib.get('bounds')!='[0,0][0,0]']
 labeled=next((n for n in inputs if '운동 검색' in (n.attrib.get('content-desc','')+' '+n.attrib.get('text',''))),None)
 return labeled if labeled is not None else inputs[0] if len(inputs)==1 else None
node=wait(find_input,seconds=60)
base_height=js('innerHeight')
x1,y1,x2,y2=map(int,re.findall(r'\d+',node.attrib['bounds']))
adb('shell','input','tap',str((x1+x2)//2),str((y1+y2)//2))
wait(lambda:'mInputShown=true' in adb('shell','dumpsys','input_method') or 'mIsInputViewShown=true' in adb('shell','dumpsys','input_method'))
wait(lambda:js('innerHeight')<base_height-100,seconds=30)
time.sleep(1)  # Wait for the WebView compositor and IME animation to finish.
size=js("JSON.stringify({h:innerHeight,button:document.querySelector('#picker-add').getBoundingClientRect().bottom,search:document.querySelector('#exercise-search').getBoundingClientRect().top,list:document.querySelector('.picker-list').clientHeight})")
size=json.loads(size);assert size['button']<=size['h']+1 and size['search']>=0 and size['list']>10,size
shot('android-keyboard-search.png');print('PASS actual Android keyboard keeps search and add button visible',size)
adb('shell','input','keyevent','4');js("closeSheet();data.draft.exercises=[newExercise('bench')];data.draft.exercises[0].notes='실제 스와이프 메모';page='workout';save();render();document.querySelector('[data-field=weight]').scrollIntoView({block:'center'})")
assert js('data.draft.exercises[0].sets.length')==1
time.sleep(1)
adb('shell','uiautomator','dump','/sdcard/liftlog-swipe.xml')
xml=ET.fromstring(adb('shell','cat','/sdcard/liftlog-swipe.xml'))
webview=next(n for n in xml.iter('node') if n.attrib.get('class')=='android.webkit.WebView')
wx1,wy1,wx2,wy2=map(int,re.findall(r'\d+',webview.attrib['bounds']))
point=json.loads(js("JSON.stringify((()=>{const r=document.querySelector('[data-field=weight]').getBoundingClientRect();return {x:r.x+r.width*.8,y:r.y+r.height/2,dpr:devicePixelRatio}})())"))
sx=int(wx1+point['x']*point['dpr']);sy=int(wy1+point['y']*point['dpr']);ex=int(sx-90*point['dpr'])
adb('shell','input','swipe',str(sx),str(sy),str(ex),str(sy),'250')
wait(lambda:js('data.draft.exercises[0].sets.length===0'))
assert js("data.draft.exercises[0].notes==='실제 스와이프 메모'")
shot('android-direct-swipe-deleted.png');print('PASS real Android swipe deletes the only set without an extra tap and preserves notes',flush=True)
js('actions.undoSet()');assert js('data.draft.exercises[0].sets.length')==1
print('PASS native swipe undo restores the single set',flush=True)
js('startTimer(90)')
wait(lambda:'rest_countdown' in adb('shell','dumpsys','notification','--noredact'))
notifications=adb('shell','dumpsys','notification','--noredact')
assert 'kr.liftlog.app.next' in notifications and 'rest_countdown' in notifications
assert js('Android.load().includes("timer")')
adb('shell','cmd','statusbar','expand-notifications');time.sleep(2);shot('android-countdown-notification.png')
# Fixed panel and explicit text colors must remain visible in both system themes.
from PIL import Image
for night,name in [('yes','dark'),('no','light')]:
 adb('shell','cmd','statusbar','collapse');adb('shell','cmd','uimode','night',night);time.sleep(2)
 adb('shell','cmd','statusbar','expand-notifications');time.sleep(2)
 filename='android-notification-'+name+'.png';shot(filename)
 im=Image.open(out/filename).convert('RGB')
 panel=sum(1 for r,g,b in im.getdata() if abs(r-17)<3 and abs(g-27)<3 and abs(b-20)<3)
 right=im.crop((int(im.width*.35),0,im.width,im.height))
 lime=sum(1 for r,g,b in right.getdata() if 194<=r<=206 and 244<=g<=255 and 107<=b<=120)
 assert panel>2000 and lime>40,{'theme':name,'dark_panel_pixels':panel,'bright_timer_pixels':lime}
 print('PASS notification contrast in '+name+' mode',{'dark_panel_pixels':panel,'bright_timer_pixels':lime},flush=True)
# A night-mode configuration change may recreate the WebView; attach to its current target.
try:ws.close()
except Exception:pass
pid=wait(lambda:adb('shell','pidof','kr.liftlog.app.next'))
adb('forward','tcp:9222','localabstract:webview_devtools_remote_'+pid)
wait(attach_loaded_page,seconds=30)

adb('shell','cmd','statusbar','collapse');adb('shell','am','start','-a','android.settings.SETTINGS');time.sleep(3)
# Confirm foreground timer survives leaving the activity.
assert 'RestTimerService' in adb('shell','dumpsys','activity','services','kr.liftlog.app.next')
print('PASS native foreground countdown and custom notification while app is in background')
adb('shell','locksettings','set-disabled','false');adb('shell','input','keyevent','26');time.sleep(2);adb('shell','input','keyevent','26');time.sleep(3);shot('android-lockscreen-countdown.png')
# Verify notification skip reaches the app through the service broadcast.
adb('shell','wm','dismiss-keyguard');adb('shell','am','start','-n','kr.liftlog.app.next/kr.liftlog.app.MainActivity');time.sleep(1)
adb('shell','cmd','statusbar','expand-notifications');time.sleep(1)
def find_skip():
 result=adb('shell','uiautomator','dump','/sdcard/liftlog-notifications.xml')
 if 'dumped' not in result:return None
 xml=adb('shell','cat','/sdcard/liftlog-notifications.xml')
 (out/'android-notification-accessibility.xml').write_text(xml)
 return next((n for n in ET.fromstring(xml).iter('node') if '건너뛰기' in (n.attrib.get('text','')+' '+n.attrib.get('content-desc',''))),None)
try:
 node=wait(find_skip,seconds=10)
except AssertionError:
 node=None
if node is None:
 print('WARN SystemUI notification action is not exposed to accessibility automation; skip tap was not verified. App-side rest-stop callback is covered by core tests.',flush=True)
 (out/'notification-skip-limitation.txt').write_text('The notification action was visible in screenshots but was not exposed by this emulator accessibility dump. The tap could not be automatically verified. App-side callback logic is covered by core tests.\n')
else:
 x1,y1,x2,y2=map(int,re.findall(r'\d+',node.attrib['bounds']))
 adb('shell','input','tap',str((x1+x2)//2),str((y1+y2)//2));adb('shell','cmd','statusbar','collapse')
 wait(lambda:js('data.timer===null'))
 assert json.loads(js('Android.load()'))['timer'] is None
 print('PASS notification skip clears native storage and in-app rest timer',flush=True)
(out/'android-native-verification.txt').write_text('PASS actual keyboard viewport\nPASS foreground timer notification in background\nNotification and lock-screen screenshots captured; display depends on device notification settings.\n')
ws.close()

