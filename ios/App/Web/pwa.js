'use strict';
const isIOS=/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const standalone=()=>window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
let installPrompt=null;
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;});
window.showInstallHelp=async()=>{
 if(standalone()){toast('이미 홈 화면 앱으로 사용 중이에요 ♡');return;}
 if(installPrompt){await installPrompt.prompt();installPrompt=null;return;}
 sheet('홈 화면에 리프트로그 추가',`<p class="muted">${isIOS?'Safari에서 이 페이지를 열어주세요.':'브라우저 메뉴에서 앱 설치 또는 홈 화면에 추가를 선택해 주세요.'}</p><div class="install-note"><p>① Safari의 <b>공유</b> 버튼 누르기<br>② <b>홈 화면에 추가</b> 선택<br>③ 이름 확인 후 <b>추가</b> 누르기</p></div><p class="small muted" style="margin-top:17px">처음 온라인으로 열면 화면이 저장되어 이후에는 오프라인에서도 기록할 수 있어요. 기록은 현재 브라우저·기기에 저장됩니다. Safari 기록을 홈 화면 앱으로 옮길 때는 백업 저장 → 복원을 이용하세요.</p>${button('close','알겠어요 ♡','primary')}`,'install');
};
window.showWebWidgetHelp=()=>sheet('홈 화면에서 바로 시작',`<p class="muted">아이폰 웹앱은 홈 화면 아이콘으로 바로 열 수 있어요.</p><div class="install-note">아이폰의 네이티브 위젯과 화면을 잠근 상태의 타이머 완료 알림은 이 웹앱에서 지원하지 않습니다. 타이머는 앱을 다시 열면 남은 시간을 계산합니다.</div>${button('installWeb','홈 화면에 추가 방법','primary')}`,'webWidget');
if(!window.Android&&'serviceWorker' in navigator&&location.protocol==='https:'){
 navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(()=>toast('오프라인 준비를 완료하지 못했습니다. 온라인 상태에서 다시 열어주세요.'));
}
