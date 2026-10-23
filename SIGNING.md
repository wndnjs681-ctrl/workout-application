# Android distribution signing

Starting with 1.4.0, the application ID is `kr.liftlog.app.next`; the Java namespace remains `kr.liftlog.app`. The launcher label is 리프트로그 새 버전. The original `kr.liftlog.app` installation and its private data remain intact. Users migrate through Settings → 백업 저장 in the old app and Settings → 복원 in the new one.

The signing key for releases 1.3.x was stored only in a GitHub Actions cache, which expired. Do not claim that 1.4.0 updates that original installation in place, and never delete a user's original app or data as part of migration.

The new owner certificate SHA-256 is `04882f4b2201eec16eeca169025d57a2f177d7a7857ad9f85310d5e524549878`. The PKCS12 alias is `liftlog-release`. Keep this certificate and application ID for subsequent releases. Never generate a replacement key when the retained owner key is missing. Ask the owner to restore their private signing backup instead.

CI always publishes an explicitly named Unsigned-APK artifact, including the Android apksigner tool. Emulator tests use a disposable key only for their test install; that key must never sign the user distribution.

For automatic owner-signed APKs, configure these repository Actions secrets from the owner's private signing backup:

- `LIFTLOG_NEXT_KEYSTORE_BASE64`: contents of keystore-base64.txt.
- `LIFTLOG_NEXT_KEYSTORE_PASSWORD`: contents of store-password.txt.

The workflow signs an additional installable APK artifact only when both secrets exist. It does not depend on a cache for production signing. Do not print secrets, commit the private key, or upload it in public workflow artifacts.

The initial 1.4.0 distribution was signed locally with the retained owner key and verified with APK Signature Schemes v2 and v3. A private `Liftlog-signing-backup.zip` was supplied to the owner separately from this public repository. In a workspace retaining that private key, use `java -jar apksigner.jar sign --ks /path/to/liftlog-owner.p12 --ks-pass file:/path/to/store-password.txt --ks-key-alias liftlog-release --out Liftlog.apk Liftlog-unsigned.apk`, then verify the signature and compare the certificate above.
