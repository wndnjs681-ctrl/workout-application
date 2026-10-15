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
   if value:return value
  except Exception:pass
  time.sleep(.5)
 raise AssertionError('Timed out waiting for device state')
adb('install','-r','dist/Liftlog-1.3.0.apk')
adb('shell','pm','grant','kr.liftlog.app','android.permission.POST_NOTIFICATIONS')
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
wait(lambda:js("typeof actions==='object'"))
assert js('library.length')==294
js('actions.start()');time.sleep(1)
# Tap the real accessibility node, so Android opens its actual input method.
adb('shell','uiautomator','dump','/sdcard/liftlog-ui.xml')
xml=adb('shell','cat','/sdcard/liftlog-ui.xml');root=ET.fromstring(xml)
node=next(n for n in root.iter('node') if n.attrib.get('class')=='android.widget.EditText')
x1,y1,x2,y2=map(int,re.findall(r'\d+',node.attrib['bounds']))
adb('shell','input','tap',str((x1+x2)//2),str((y1+y2)//2))
wait(lambda:'mInputShown=true' in adb('shell','dumpsys','input_method') or 'mIsInputViewShown=true' in adb('shell','dumpsys','input_method'))
size=js("JSON.stringify({h:innerHeight,button:document.querySelector('#picker-add').getBoundingClientRect().bottom,search:document.querySelector('#exercise-search').getBoundingClientRect().top,list:document.querySelector('.picker-list').clientHeight})")
size=json.loads(size);assert size['button']<=size['h']+1 and size['search']>=0 and size['list']>10,size
shot('android-keyboard-search.png');print('PASS actual Android keyboard keeps search and add button visible',size)
adb('shell','input','keyevent','4');js("closeSheet();data.draft.exercises=[newExercise('bench')];page='workout';save();render();startTimer(90)")
wait(lambda:'NotificationRecord' in adb('shell','dumpsys','notification','--noredact'))
notifications=adb('shell','dumpsys','notification','--noredact')
assert 'kr.liftlog.app' in notifications and 'rest_countdown' in notifications
assert js('Android.load().includes("timer")')
adb('shell','cmd','statusbar','expand-notifications');time.sleep(2);shot('android-countdown-notification.png')
adb('shell','cmd','statusbar','collapse');adb('shell','input','keyevent','3');time.sleep(3)
# Confirm foreground timer survives leaving the activity.
assert 'RestTimerService' in adb('shell','dumpsys','activity','services','kr.liftlog.app')
print('PASS native foreground countdown and custom notification while app is in background')
adb('shell','input','keyevent','26');time.sleep(2);adb('shell','input','keyevent','26');time.sleep(2);shot('android-lockscreen-countdown.png')
(out/'android-native-verification.txt').write_text('PASS actual keyboard viewport\nPASS foreground timer notification in background\nNotification and lock-screen screenshots captured; display depends on device notification settings.\n')
ws.close()
