# 리프트로그 iOS 단독 앱

Safari 없이 실행되는 iOS 앱입니다. 운동 화면은 앱에 포함된 WKWebView 리소스로 오프라인에서 실행되고, 기록 저장·휴식 종료 알림·파일 백업은 iOS 코드와 연결되어 있습니다.

## 무료 Apple ID로 본인 아이폰에서 테스트
1. Mac에 Xcode를 설치하고 Apple ID를 Xcode → Settings → Accounts에 추가합니다.
2. 이 폴더에서 `brew install xcodegen` 후 `xcodegen generate`를 실행합니다. GitHub Actions 소스 아티팩트에는 생성된 프로젝트도 포함됩니다.
3. `Liftlog.xcodeproj`를 열고 **LiftlogPersonal** 스킴을 선택합니다.
4. 타깃 Signing & Capabilities에서 본인의 Personal Team을 선택합니다. 필요하면 Bundle Identifier를 고유한 값으로 바꿉니다.
5. 아이폰을 Mac에 연결하고 개발자 모드를 켠 뒤 기기를 실행 대상으로 선택하여 ▶를 누릅니다.

무료 Personal Team 설치는 임시이며 다시 서명/설치가 필요할 수 있습니다. 다른 사람에게 링크로 배포하거나 App Store/TestFlight에 올리는 방식은 아닙니다. 기록은 앱을 삭제하지 않고 업데이트해야 유지됩니다. 백업은 설정에서 JSON 파일로 내보낼 수 있습니다.

## 위젯 포함 정식 빌드
Apple Developer Program 가입 후 **Liftlog** 스킴을 사용합니다. 앱/위젯 Bundle Identifier 및 App Group `group.kr.liftlog.app`을 본인 계정에 등록된 고유한 값으로 맞춥니다. 그룹을 바꿀 때는 project.yml과 Shared/Store.swift도 함께 바꿉니다. Xcode에서 앱과 위젯 모두 팀과 프로비저닝을 설정합니다. Product → Archive → Distribute App으로 TestFlight/App Store에 업로드합니다.

무료 **LiftlogPersonal**은 App Groups/위젯을 포함하지 않습니다. 정식 **Liftlog**에는 WidgetKit 홈 화면 위젯이 있습니다. 휴식 타이머는 로컬 알림 허용 시 잠금 화면에서도 종료를 알려줍니다. 잠금 화면에 초마다 갱신되는 카운트다운 Live Activity는 포함되지 않았습니다.

GitHub Actions가 제공하는 `.app`은 시뮬레이터 테스트용 또는 서명 없는 빌드 검증 결과입니다. 아이폰에 다운로드하여 설치할 수 있는 IPA가 아닙니다. 실제 설치에는 본인 Apple 계정으로 서명해야 합니다.
