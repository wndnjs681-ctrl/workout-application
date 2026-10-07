package kr.liftlog.app;
import android.app.*;
import android.content.*;
import android.os.*;
import android.media.*;

public class RestTimerService extends Service {
    private final Handler handler=new Handler(Looper.getMainLooper());
    private long deadline;
    private PowerManager.WakeLock wakeLock;
    private static final String CHANNEL="rest_countdown", DONE="rest_done";
    @Override public void onCreate(){super.onCreate();
        NotificationManager manager=getSystemService(NotificationManager.class);
        NotificationChannel countdown=new NotificationChannel(CHANNEL,"휴식 타이머 진행",NotificationManager.IMPORTANCE_LOW);
        countdown.setSound(null,null);manager.createNotificationChannel(countdown);
        manager.createNotificationChannel(new NotificationChannel(DONE,"휴식 완료",NotificationManager.IMPORTANCE_HIGH));
        wakeLock=getSystemService(PowerManager.class).newWakeLock(PowerManager.PARTIAL_WAKE_LOCK,"liftlog:rest");
    }
    @Override public int onStartCommand(Intent intent,int flags,int id){
        if(intent==null){stopSelf();return START_NOT_STICKY;}
        if("stop".equals(intent.getAction())){stopSelf();return START_NOT_STICKY;}
        int seconds=Math.max(1,Math.min(3600,intent.getIntExtra("seconds",90)));
        deadline=SystemClock.elapsedRealtime()+seconds*1000L;
        handler.removeCallbacksAndMessages(null);
        if(wakeLock.isHeld())wakeLock.release();wakeLock.acquire((seconds+5)*1000L);
        getSystemService(NotificationManager.class).cancel(102);
        PendingIntent open=PendingIntent.getActivity(this,0,new Intent(this,MainActivity.class),PendingIntent.FLAG_IMMUTABLE|PendingIntent.FLAG_UPDATE_CURRENT);
        PendingIntent stop=PendingIntent.getService(this,1,new Intent(this,RestTimerService.class).setAction("stop"),PendingIntent.FLAG_IMMUTABLE|PendingIntent.FLAG_UPDATE_CURRENT);
        Notification notification=new Notification.Builder(this,CHANNEL).setSmallIcon(kr.liftlog.app.R.drawable.ic_notification)
            .setContentTitle("리프트로그 · 휴식 중").setContentText("숨을 고르고 다음 세트를 준비하세요")
            .setWhen(System.currentTimeMillis()+seconds*1000L).setUsesChronometer(true).setChronometerCountDown(true)
            .setContentIntent(open).setOngoing(true).setOnlyAlertOnce(true).addAction(new Notification.Action.Builder(null,"건너뛰기",stop).build()).build();
        startForeground(101,notification);handler.postDelayed(finish,seconds*1000L);return START_NOT_STICKY;
    }
    private final Runnable finish=()->{
        if(SystemClock.elapsedRealtime()<deadline){handler.postDelayed(this.finish,deadline-SystemClock.elapsedRealtime());return;}
        PendingIntent open=PendingIntent.getActivity(this,0,new Intent(this,MainActivity.class),PendingIntent.FLAG_IMMUTABLE|PendingIntent.FLAG_UPDATE_CURRENT);
        Notification n=new Notification.Builder(this,DONE).setSmallIcon(R.drawable.ic_notification).setContentTitle("휴식 끝! 다음 세트 시작")
            .setContentText("리프트로그에서 다음 세트를 기록하세요.").setContentIntent(open).setAutoCancel(true).build();
        getSystemService(NotificationManager.class).notify(102,n);
        Vibrator v=getSystemService(Vibrator.class);if(v!=null)v.vibrate(VibrationEffect.createOneShot(400,VibrationEffect.DEFAULT_AMPLITUDE));
        stopSelf();
    };
    @Override public void onDestroy(){handler.removeCallbacksAndMessages(null);if(wakeLock!=null && wakeLock.isHeld())wakeLock.release();stopForeground(STOP_FOREGROUND_REMOVE);super.onDestroy();}
    @Override public IBinder onBind(Intent i){return null;}
}
