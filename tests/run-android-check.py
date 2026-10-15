import subprocess,sys
from pathlib import Path
p=Path('test-output');p.mkdir(exist_ok=True)
result=subprocess.run([sys.executable,'tests/android-device.py'])
with (p/'android-runtime.log').open('w') as f:
 subprocess.run(['adb','logcat','-d','-v','brief','AndroidRuntime:E','chromium:E','DEBUG:E','*:S'],stdout=f,stderr=subprocess.STDOUT)
if result.returncode:
 print((p/'android-runtime.log').read_text()[-8000:])
 with (p/'android-failure.png').open('wb') as f:subprocess.run(['adb','exec-out','screencap','-p'],stdout=f)
sys.exit(result.returncode)
