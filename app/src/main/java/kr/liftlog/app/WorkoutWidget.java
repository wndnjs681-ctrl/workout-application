package kr.liftlog.app;
import android.app.*;
import android.appwidget.*;
import android.content.*;
import android.widget.RemoteViews;
import org.json.*;
import java.time.*;
import java.time.temporal.TemporalAdjusters;
public class WorkoutWidget extends AppWidgetProvider {
    public static void refresh(Context context){AppWidgetManager m=AppWidgetManager.getInstance(context);int[] ids=m.getAppWidgetIds(new ComponentName(context,WorkoutWidget.class));new WorkoutWidget().onUpdate(context,m,ids);}
    @Override public void onUpdate(Context context,AppWidgetManager manager,int[] ids){
        int count=0;String last="첫 운동을 기록해 보세요";
        try{
            JSONObject data=new JSONObject(context.getSharedPreferences("liftlog",Context.MODE_PRIVATE).getString("data","{}"));
            JSONArray sessions=data.optJSONArray("sessions");LocalDate today=LocalDate.now();LocalDate monday=today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
            if(sessions!=null){long newest=0;for(int j=0;j<sessions.length();j++){
                JSONObject s=sessions.getJSONObject(j);LocalDate date=LocalDate.parse(s.getString("date"));
                if(!date.isBefore(monday) && !date.isAfter(today))count++;
                if(s.optLong("finishedAt")>newest){newest=s.optLong("finishedAt");last=s.optString("date")+" · "+s.optString("name","운동");}
            }}
            if(!data.isNull("draft") && data.optJSONObject("draft")!=null)last="진행 중인 운동이 있어요 · 탭해서 이어하기";
        }catch(Exception ignored){}
        for(int id:ids){RemoteViews views=new RemoteViews(context.getPackageName(),R.layout.workout_widget);views.setTextViewText(R.id.widget_count,"이번 주 "+count+"회");views.setTextViewText(R.id.widget_last,last);
            Intent start=new Intent(context,MainActivity.class).putExtra("startWorkout",true).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP|Intent.FLAG_ACTIVITY_CLEAR_TOP);
            PendingIntent action=PendingIntent.getActivity(context,3,start,PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);
            views.setOnClickPendingIntent(R.id.widget_start,action);
            views.setOnClickPendingIntent(R.id.widget_count,PendingIntent.getActivity(context,4,new Intent(context,MainActivity.class),PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE));manager.updateAppWidget(id,views);
        }
    }
}
