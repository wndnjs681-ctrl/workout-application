import SwiftUI
import UIKit
import WebKit
import UserNotifications
import UniformTypeIdentifiers
import WidgetKit

@main
struct LiftlogApp: App {
    var body: some Scene {
        WindowGroup {
            WorkoutView().ignoresSafeArea(edges: .bottom)
                .onOpenURL { url in
                    if url.scheme == "liftlog", url.host == "workout" {
                        UserDefaults.standard.set(true, forKey: "quickStartPending")
                        NotificationCenter.default.post(name: .init("liftlogQuickStart"), object: nil)
                    }
                }
        }
    }
}
struct WorkoutView: UIViewControllerRepresentable {
    func makeUIViewController(context: Context) -> WorkoutController { WorkoutController() }
    func updateUIViewController(_ controller: WorkoutController, context: Context) {}
}
final class WorkoutController: UIViewController, WKScriptMessageHandler, WKNavigationDelegate, UIDocumentPickerDelegate, UNUserNotificationCenterDelegate {
    private var web: WKWebView!
    private var ready = false
    private var timerGeneration = 0
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor(red: 1, green: 0.97, blue: 0.98, alpha: 1)
        let controller = WKUserContentController()
        controller.add(self, name: "native")
        let raw = WorkoutStore.raw
        let seed = raw.isEmpty ? "" : "localStorage.setItem('liftlog-v1', \(WorkoutStore.literal(raw)));"
        let bridge = """
        window.isNativeIOS=true;
        try { \(seed) } catch(e) {}
        const send=(command,data)=>window.webkit.messageHandlers.native.postMessage({command,data});
        window.Android={
          load:()=>localStorage.getItem('liftlog-v1')||'',
          save:data=>{try{localStorage.setItem('liftlog-v1',data);send('save',data);return true;}catch(e){return false;}},
          startTimer:seconds=>send('startTimer',seconds),stopTimer:()=>send('stopTimer',null),
          haptic:()=>send('haptic',null),pinWidget:()=>send('widget',null),
          exportBackup:data=>send('export',data),importBackup:()=>send('import',null)
        };
        """
        controller.addUserScript(WKUserScript(source: bridge, injectionTime: .atDocumentStart, forMainFrameOnly: true))
        let config = WKWebViewConfiguration()
        config.userContentController = controller
        web = WKWebView(frame: .zero, configuration: config)
        web.navigationDelegate = self
        web.scrollView.contentInsetAdjustmentBehavior = .never
        web.isOpaque = false
        web.backgroundColor = view.backgroundColor
        view = web
        UNUserNotificationCenter.current().delegate = self
        NotificationCenter.default.addObserver(self, selector: #selector(quickStart), name: .init("liftlogQuickStart"), object: nil)
        if let root = Bundle.main.url(forResource: "Web", withExtension: nil) {
            web.loadFileURL(root.appendingPathComponent("index.html"), allowingReadAccessTo: root)
        }
    }
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) { ready = true; quickStart() }
    @objc private func quickStart() {
        guard ready, UserDefaults.standard.bool(forKey: "quickStartPending") else { return }
        UserDefaults.standard.removeObject(forKey: "quickStartPending")
        web.evaluateJavaScript("window.quickStart && window.quickStart()", completionHandler: nil)
    }
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        decisionHandler(navigationAction.request.url?.isFileURL == true ? .allow : .cancel)
    }
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard message.frameInfo.isMainFrame, let body = message.body as? [String: Any], let command = body["command"] as? String else { return }
        switch command {
        case "save":
            if let raw = body["data"] as? String, raw.utf8.count <= 5_000_000, let data = raw.data(using: .utf8), (try? JSONSerialization.jsonObject(with: data)) != nil {
                WorkoutStore.save(raw)
                #if !PERSONAL_BUILD
                WidgetCenter.shared.reloadAllTimelines()
                #endif
            }
        case "startTimer": if let seconds = body["data"] as? Int, (1...3600).contains(seconds) { startTimer(seconds) }
        case "stopTimer":
            timerGeneration += 1
            UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: ["liftlog-rest"])
            UNUserNotificationCenter.current().removeDeliveredNotifications(withIdentifiers: ["liftlog-rest"])
        case "haptic": UIImpactFeedbackGenerator(style: .soft).impactOccurred()
        case "widget":
            #if PERSONAL_BUILD
            alert("위젯 안내", "무료 Apple ID 테스트 버전입니다. 홈 화면 위젯은 Apple Developer 계정으로 Liftlog 버전을 설치하면 사용할 수 있어요.")
            #else
            alert("홈 화면에 추가 ♡", "아이폰 홈 화면을 길게 누르고 편집 → 위젯 추가 → 리프트로그를 선택하세요.")
            #endif
        case "export":
            if let raw = body["data"] as? String, raw.utf8.count <= 5_000_000 {
                do {
                    let url = FileManager.default.temporaryDirectory.appendingPathComponent("liftlog-backup.json")
                    try raw.write(to: url, atomically: true, encoding: .utf8)
                    present(UIDocumentPickerViewController(forExporting: [url], asCopy: true), animated: true)
                } catch { toast("백업 파일을 만들지 못했어요.") }
            }
        case "import":
            let picker = UIDocumentPickerViewController(forOpeningContentTypes: [.json], asCopy: true)
            picker.delegate = self
            present(picker, animated: true)
        default: break
        }
    }
    private func startTimer(_ seconds: Int) {
        timerGeneration += 1
        let generation = timerGeneration
        let end = Date().addingTimeInterval(Double(seconds))
        let center = UNUserNotificationCenter.current()
        center.removePendingNotificationRequests(withIdentifiers: ["liftlog-rest"])
        center.requestAuthorization(options: [.alert, .sound]) { allowed, _ in
            DispatchQueue.main.async {
                guard self.timerGeneration == generation else { return }
                guard allowed else { self.toast("알림을 허용하면 휴식 종료를 알려드려요."); return }
                let content = UNMutableNotificationContent()
                content.title = "휴식 끝 ♡"
                content.body = "다음 세트를 시작해 볼까요?"
                content.sound = .default
                let trigger = UNTimeIntervalNotificationTrigger(timeInterval: max(1, end.timeIntervalSinceNow), repeats: false)
                center.add(UNNotificationRequest(identifier: "liftlog-rest", content: content, trigger: trigger)) { error in
                    if error != nil { DispatchQueue.main.async { self.toast("타이머 알림을 설정하지 못했어요.") } }
                }
            }
        }
    }
    func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) { completionHandler([.banner, .sound]) }
    func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
        guard let url = urls.first else { return }
        let access = url.startAccessingSecurityScopedResource()
        defer { if access { url.stopAccessingSecurityScopedResource() } }
        do {
            let size = try url.resourceValues(forKeys: [.fileSizeKey]).fileSize ?? 0
            guard size <= 5_000_000 else { toast("백업은 5MB 이하 파일을 선택해 주세요."); return }
            let raw = try String(contentsOf: url, encoding: .utf8)
            web.evaluateJavaScript("window.importBackup(\(WorkoutStore.literal(raw)))", completionHandler: nil)
        } catch { toast("백업 파일을 읽지 못했어요.") }
    }
    private func toast(_ message: String) { web.evaluateJavaScript("window.toast && window.toast(\(WorkoutStore.literal(message)))", completionHandler: nil) }
    private func alert(_ title: String, _ message: String) {
        let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "확인", style: .default))
        present(alert, animated: true)
    }
}
