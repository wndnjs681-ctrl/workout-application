import SwiftUI
import WidgetKit

struct WorkoutEntry: TimelineEntry {
    let date: Date
    let count: Int
    let goal: Int
    let last: String
}
struct WorkoutProvider: TimelineProvider {
    func placeholder(in context: Context) -> WorkoutEntry { WorkoutEntry(date: Date(), count: 2, goal: 3, last: "하체 운동") }
    func getSnapshot(in context: Context, completion: @escaping (WorkoutEntry) -> Void) { completion(entry()) }
    func getTimeline(in context: Context, completion: @escaping (Timeline<WorkoutEntry>) -> Void) {
        completion(Timeline(entries: [entry()], policy: .after(Date().addingTimeInterval(900))))
    }
    private func entry() -> WorkoutEntry {
        let raw = WorkoutStore.raw.data(using: .utf8) ?? Data()
        let state = (try? JSONSerialization.jsonObject(with: raw)) as? [String: Any] ?? [:]
        let sessions = state["sessions"] as? [[String: Any]] ?? []
        var calendar = Calendar.current
        calendar.firstWeekday = 2
        let start = calendar.dateInterval(of: .weekOfYear, for: Date())?.start ?? Date()
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.dateFormat = "yyyy-MM-dd"
        let count = sessions.filter { session in
            guard let date = formatter.date(from: session["date"] as? String ?? "") else { return false }
            return date >= start && date <= Date()
        }.count
        let latest = sessions.sorted { ($0["date"] as? String ?? "") > ($1["date"] as? String ?? "") }.first
        let settings = state["settings"] as? [String: Any] ?? [:]
        return WorkoutEntry(date: Date(), count: count, goal: settings["goal"] as? Int ?? 3, last: latest?["name"] as? String ?? "첫 운동을 기록해 보세요")
    }
}
struct WorkoutWidgetView: View {
    let entry: WorkoutEntry
    private let berry = Color(red: 0.68, green: 0.18, blue: 0.41)
    var body: some View {
        VStack(alignment: .leading, spacing: 9) {
            HStack { Text("리프트로그").font(.caption.bold()); Spacer(); Image(systemName: "heart.fill") }
            Text("이번 주 \(entry.count)회 ♡").font(.title2.bold())
            Text("목표 \(entry.goal)회 · 차곡차곡 쌓는 나의 힘").font(.caption2)
            Spacer(minLength: 0)
            Text(entry.last).font(.caption).lineLimit(1)
            Text("운동 시작하기 →").font(.caption.bold())
        }.foregroundColor(berry).padding(14).widgetBackground()
            .widgetURL(URL(string: "liftlog://workout"))
    }
}
extension View {
    @ViewBuilder func widgetBackground() -> some View {
        let color = Color(red: 1, green: 0.97, blue: 0.98)
        if #available(iOS 17.0, *) { self.containerBackground(color, for: .widget) }
        else { self.background(color) }
    }
}
@main
struct LiftlogWidget: Widget {
    let kind = "LiftlogWidget"
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: WorkoutProvider()) { WorkoutWidgetView(entry: $0) }
            .configurationDisplayName("나의 운동 ♡")
            .description("이번 주 운동 기록을 확인하고 바로 시작하세요.")
            .supportedFamilies([.systemSmall, .systemMedium])
    }
}
