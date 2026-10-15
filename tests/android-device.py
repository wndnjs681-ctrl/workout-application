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
adb('install','-r','dist/Liftlog-1.3.0.apk')
adb('shell','pm','grant','kr.liftlog.app','android.permission.POST_NOTIFICATIONS')
adb('shell','settings','put','secure','show_ime_with_hard_keyboard','1')
print('Lock notification defaults:',adb('shell','settings','get','secure','lock_screen_show_notifications'),adb('shell','settings','get','secure','lock_screen_show_silent_notifications'),flush=True)
adb('shell','settings','put','secure','lock_screen_show_notifications','1')
adb('shell','settings','put','secure','lock_screen_show_silent_notifications','1')
adb('shell','wm','size','720x1520')
adb('shell','wm','density','320')
adb('shell','am','start','-a','android.settings.SETTINGS')
adb('shell','am','force-stop','com.android.launcher3')
adb('shell','am','start','-n','kr.liftlog.app/.MainActivity')
pid=wait(lambda:adb('shell','pidof','kr.liftlog.app'))
wait(lambda:'webview_devtools_remote_'+pid in adb('shell','cat','/proc/net/unix'))
adb('forward','tcp:9222','localabstract:webview_devtools_remote_'+pid)
target=wait(lambda:json.load(urllib.request.urlopen('http://127.0.0.1:9222/json'))[0])
ws=websocket.create_connection(target['webSocketDebuggerUrl'],suppress_origin=True,timeout=15);seq=0
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
print('CDP target',target,flush=True)
print('Initial page',js("JSON.stringify({url:location.href,text:document.body?.innerText,ready:document.readyState,actions:typeof actions})"),flush=True)
shot('android-initial.png')
wait(lambda:js("typeof actions==='object'"),seconds=60)
assert js('library.length')==294
js('actions.start()');time.sleep(1)
# Tap the real accessibility node, so Android opens its actual input method.
shot('android-picker-before-keyboard.png')
def find_input():
 result=adb('shell','uiautomator','dump','/sdcard/liftlog-ui.xml')
 print('Accessibility dump:',result,flush=True)
 if 'dumped' not in result:return None
 xml=adb('shell','cat','/sdcard/liftlog-ui.xml')
 root=ET.fromstring(xml)
 (out/'android-picker-accessibility.xml').write_text(xml)
 return next((n for n in root.iter('node') if n.attrib.get('class')=='android.widget.EditText' and '운동 검색' in (n.attrib.get('content-desc','')+' '+n.attrib.get('text',''))),None)
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
adb('shell','input','keyevent','4');js("closeSheet();data.draft.exercises=[newExercise('bench')];page='workout';save();render();startTimer(90)")
wait(lambda:'rest_countdown' in adb('shell','dumpsys','notification','--noredact'))
notifications=adb('shell','dumpsys','notification','--noredact')
assert 'kr.liftlog.app' in notifications and 'rest_countdown' in notifications
assert js('Android.load().includes("timer")')
adb('shell','cmd','statusbar','expand-notifications');time.sleep(2);shot('android-countdown-notification.png')
adb('shell','cmd','statusbar','collapse');adb('shell','am','start','-a','android.settings.SETTINGS');time.sleep(3)
# Confirm foreground timer survives leaving the activity.
assert 'RestTimerService' in adb('shell','dumpsys','activity','services','kr.liftlog.app')
print('PASS native foreground countdown and custom notification while app is in background')
adb('shell','locksettings','set-disabled','false');adb('shell','input','keyevent','26');time.sleep(2);adb('shell','input','keyevent','26');time.sleep(3);shot('android-lockscreen-countdown.png')
# Verify notification skip reaches the app through the service broadcast.
adb('shell','wm','dismiss-keyguard');adb('shell','am','start','-n','kr.liftlog.app/.MainActivity');time.sleep(1)
adb('shell','cmd','statusbar','expand-notifications');time.sleep(1)
def find_skip():
 result=adb('shell','uiautomator','dump','/sdcard/liftlog-notifications.xml')
 if 'dumped' not in result:return None
 xml=adb('shell','cat','/sdcard/liftlog-notifications.xml')
 return next((n for n in ET.fromstring(xml).iter('node') if n.attrib.get('text')=='건너뛰기'),None)
node=wait(find_skip,seconds=30)
x1,y1,x2,y2=map(int,re.findall(r'\d+',node.attrib['bounds']))
adb('shell','input','tap',str((x1+x2)//2),str((y1+y2)//2));adb('shell','cmd','statusbar','collapse')
wait(lambda:js('data.timer===null'))
assert json.loads(js('Android.load()'))['timer'] is None
print('PASS notification skip clears native storage and in-app rest timer',flush=True)
(out/'android-native-verification.txt').write_text('PASS actual keyboard viewport\nPASS foreground timer notification in background\nNotification and lock-screen screenshots captured; display depends on device notification settings.\n')
ws.close()
