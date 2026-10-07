#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
if ! command -v gradle >/dev/null; then
  echo 'Gradle 8.11.1을 설치하거나 Android Studio에서 이 프로젝트를 열어 Build APK(s)를 실행하세요.' >&2
  exit 1
fi
if [[ -z "${ANDROID_HOME:-${ANDROID_SDK_ROOT:-}}" && ! -f local.properties ]]; then
  echo 'Android SDK 35 위치를 ANDROID_HOME 또는 local.properties의 sdk.dir에 지정하세요.' >&2
  exit 1
fi
gradle --no-daemon :app:assembleDebug
mkdir -p dist
cp app/build/outputs/apk/debug/app-debug.apk dist/Liftlog-1.1.0.apk
echo '설치 파일: dist/Liftlog-1.1.0.apk'
