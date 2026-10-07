import Foundation

enum WorkoutStore {
    static let key = "liftlog-v1"
    static let group = "group.kr.liftlog.app"
    static var defaults: UserDefaults {
        #if PERSONAL_BUILD
        return .standard
        #else
        return UserDefaults(suiteName: group) ?? .standard
        #endif
    }
    static var raw: String { defaults.string(forKey: key) ?? UserDefaults.standard.string(forKey: key) ?? "" }
    static func save(_ raw: String) {
        defaults.set(raw, forKey: key)
        UserDefaults.standard.set(raw, forKey: key)
    }
    static func literal(_ text: String) -> String {
        let data = try! JSONSerialization.data(withJSONObject: [text], options: [.fragmentsAllowed])
        return String(data: data, encoding: .utf8)! + "[0]"
    }
}
