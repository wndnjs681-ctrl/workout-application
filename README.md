# 리프트로그 · LIFTLOG

한국어 운동 기록 안드로이드 앱. 네이비와 라임색 디자인, 회원가입 없는 기기 저장 방식.

**현재 배포 상태:** 앱 및 안드로이드 프로젝트 소스는 구현했습니다. 이 작업 환경에 Android SDK / Gradle이 없으며 SDK 다운로드와 브라우저 실행도 제한되어 APK 컴파일, 실기기 설치, 실제 위젯 작동 검증은 하지 못했습니다. ZIP은 설치 APK가 아닌 소스 프로젝트입니다.

## 포함한 기능

- 44개 기본 운동: 부위 필터, 운동 검색, 사용자 운동 추가. 중량·횟수, 맨몸·횟수, 시간(초) 기록.
- 전신 / 상체 / 하체·코어 루틴. 운동·세트 추가와 삭제, 이전 운동 세트 불러오기.
- 세트 완료 후 자동 휴식 타이머. 시간 선택, 일시 정지, 재개, +15초, 종료.
- 안드로이드 foreground service의 알림 카운트다운 및 완료 알림 / 진동. 알림 권한은 타이머 사용 시 요청.
- 날짜별 기록 캘린더, 과거 날짜 기록, 기록 상세 조회·삭제·다시 운동.
- kg / lb 전환. 내부 원본은 kg로 보관하고 화면에서 환산.
- 주간 목표, 총 볼륨, 누적 운동, 운동별 최고 기록 그래프.
- 진행 운동 자동 저장 및 다시 열었을 때 복구.
- 실제 Android AppWidgetProvider: 주간 횟수, 최근 운동, 진행 기록 안내, 운동 바로 시작. 4×2 위젯, 크기 조절 지원.
- JSON 백업 / 복원. 안드로이드 시스템 파일 선택기를 사용하며 전체 저장소 권한은 요청하지 않음.

## 바로 미리보기

`app/src/main/assets/index.html`을 브라우저에서 열면 실제 운동 기록 UI를 체험할 수 있습니다. 함께 제공한 `Liftlog-preview.html`은 별도 설치 없이 여는 단일 파일입니다. 미리보기는 브라우저에 기록을 저장하며 Android 위젯·알림 서비스는 APK에서만 작동합니다. 미리보기 기록을 안드로이드 앱에 옮기려면 백업 저장 → 앱에서 복원을 사용하세요.

## APK 빌드

방법 1 — Android Studio:

1. 이 프로젝트 폴더를 Android Studio에서 엽니다.
2. Gradle JDK를 17 이상, Gradle 배포판을 8.11.1로 설정합니다. 프로젝트에 Gradle wrapper 바이너리는 포함되어 있지 않으므로 로컬 Gradle 8.11.1 배포판을 지정하거나 `gradle wrapper --gradle-version 8.11.1`로 wrapper를 생성합니다.
3. SDK Manager에서 Android SDK Platform 35와 Build Tools 35.0.0을 설치하고 Gradle Sync를 실행합니다.
4. Build → Build App Bundle(s) / APK(s) → Build APK(s)를 실행합니다.
5. `app/build/outputs/apk/debug/app-debug.apk`를 휴대폰에 복사해 설치합니다.

방법 2 — 명령행:

JDK 17 이상, Android SDK 35, Gradle 8.11.1을 설치하고 `ANDROID_HOME`을 SDK 경로로 설정한 후 `./build-apk.sh`를 실행합니다. 결과는 `dist/Liftlog-1.0.0.apk`입니다. Windows에서는 `gradle :app:assembleDebug`를 실행합니다.

방법 3 — GitHub Actions:

소스를 본인의 GitHub 저장소에 올리면 포함된 `.github/workflows/android.yml`이 main/master push 또는 수동 실행 때 SDK를 설치하고 APK를 빌드합니다. Actions → Build installable APK → 완료된 실행 → Artifacts의 `Liftlog-1.0.0-APK`를 다운로드하여 압축을 풀면 `app-debug.apk`가 있습니다. 워크플로는 작성했지만 여기서는 원격 실행하지 않았습니다.

생성되는 APK는 개발용 debug 서명입니다. 같은 앱을 계속 업데이트하려면 같은 서명 키를 유지해야 합니다. 스토어 배포에는 별도 release 서명과 AAB 빌드가 필요하며, 스토어 등록은 수행하지 않았습니다.

## 위젯 사용

앱 설치 후 설정 → 홈 화면 위젯 추가. 또는 홈 화면을 길게 누른 뒤 위젯 → 리프트로그를 선택하세요. 위젯을 누르면 진행 중인 운동을 이어 하거나 새 운동을 시작합니다. 휴식 알림을 받으려면 안드로이드 알림 권한을 허용하세요. 기기가 앱을 강제 종료한 경우 타이머 서비스도 종료될 수 있습니다.

지원 범위: Android 8.0(API 26) 이상. 최근 Android System WebView 필요.

## 검증 현황

`node tests/core.cjs`: 루틴 구성, 저장, 단위 변환과 원본 보존, 세트 볼륨, 타이머 상태, 완료한 세트 저장, 캘린더 데이터, 백업 검증·오류 거부, 위젯 JS 호출 경로, 운동 취소, 진행 기록 복구와 화면 HTML 생성 검증 통과.

JavaScript 문법 검사, 11개 Android manifest / 리소스 XML 파싱, 빌드 스크립트 문법 검사 통과. `tests/flow.cjs`는 Playwright 실제 UI 검증 시나리오이며, 이 환경에서는 Chromium의 소켓 호출이 차단되어 실행하지 못했습니다. Android Java 컴파일과 SDK 호환성, 네이티브 알림 / 위젯 / 파일 선택기, 실기기 화면 및 접근성 검증은 APK 빌드 이후 필요합니다.

## 참고한 앱

공개 스토어 설명의 기능 흐름을 참고하고 고유한 이름과 화면을 작성했습니다. 타 앱의 이미지나 소스는 사용하지 않았습니다.

- [번핏 — Google Play](https://play.google.com/store/apps/details?hl=ko&id=com.bunnit.haja.android): 운동 기록·루틴·성장 추적의 흐름.
- [Hevy — App Store](https://apps.apple.com/us/app/hevy-workout-tracker-gym-log/id1458862350): 세트 기록, 타이머, 빠른 접근 흐름.
- [Hevy 자동 휴식 타이머](https://www.hevyapp.com/features/workout-rest-timer/): 세트 완료 후 휴식 시작 흐름.

## 소스 구조

- `app/src/main/assets/`: 한국어 화면, 운동 라이브러리, 기록·단위·타이머·캘린더 로직.
- `MainActivity.java`: 로컬 WebView, 기기 저장, 파일 백업 / 복원, 위젯 추가 연결.
- `RestTimerService.java`: 화면 밖에서도 진행되는 짧은 휴식 타이머.
- `WorkoutWidget.java`: 안드로이드 홈 화면 위젯.
