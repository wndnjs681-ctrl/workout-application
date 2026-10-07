package kr.liftlog.app;

import android.app.*;
import android.appwidget.*;
import android.content.*;
import android.graphics.Color;
import android.net.Uri;
import android.os.*;
import android.view.*;
import android.webkit.*;
import android.widget.Toast;
import java.io.*;
import java.nio.charset.StandardCharsets;
import org.json.JSONObject;

public class MainActivity extends Activity {
    private WebView web;
    private static final int EXPORT=10, IMPORT=11;
    private String exportData;
    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setStatusBarColor(Color.rgb(17,21,30));
        getWindow().setNavigationBarColor(Color.rgb(17,21,30));
        web = new WebView(this);
        web.setBackgroundColor(Color.rgb(17,21,30));
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        web.getSettings().setJavaScriptEnabled(true);
        web.getSettings().setDomStorageEnabled(true);
        web.getSettings().setAllowFileAccess(false);
        web.getSettings().setAllowContentAccess(false);
        web.getSettings().setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        web.addJavascriptInterface(new Bridge(), "Android");
        web.setWebViewClient(new WebViewClient() {
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                Uri uri=request.getUrl();
                if (!"app.liftlog.local".equals(uri.getHost())) return new WebResourceResponse("text/plain", "UTF-8", new ByteArrayInputStream(new byte[0]));
                String path=uri.getPath();
                if(path==null || path.contains("..")) return null;
                String name=path.equals("/")?"index.html":path.substring(1);
                String mime=name.endsWith(".css")?"text/css":name.endsWith(".js")?"application/javascript":"text/html";
                try { return new WebResourceResponse(mime,"UTF-8",getAssets().open(name)); }
                catch(IOException e) { return new WebResourceResponse("text/plain","UTF-8",new ByteArrayInputStream(new byte[0])); }
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) { return true; }
            @Override public void onPageFinished(WebView view,String url) { handleLaunch(getIntent()); }
        });
        setContentView(web);
        web.setOnApplyWindowInsetsListener((view,insets)-> {
            if(Build.VERSION.SDK_INT>=30) {
                android.graphics.Insets bars=insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
                android.graphics.Insets ime=insets.getInsets(WindowInsets.Type.ime());
                view.setPadding(bars.left,bars.top,bars.right,Math.max(bars.bottom,ime.bottom));
            } else view.setPadding(insets.getSystemWindowInsetLeft(),insets.getSystemWindowInsetTop(),insets.getSystemWindowInsetRight(),insets.getSystemWindowInsetBottom());
            return Build.VERSION.SDK_INT>=30 ? WindowInsets.CONSUMED : insets.consumeSystemWindowInsets();
        });
        web.loadUrl("https://app.liftlog.local/");
    }
    private void handleLaunch(Intent intent) {
        if(intent!=null && intent.getBooleanExtra("startWorkout",false)) {
            intent.removeExtra("startWorkout");
            web.evaluateJavascript("window.quickStart && window.quickStart()",null);
        }
    }
    @Override protected void onNewIntent(Intent intent) { super.onNewIntent(intent);setIntent(intent);handleLaunch(intent); }
    @Override protected void onResume(){super.onResume();if(web!=null)web.onResume();}
    @Override protected void onPause(){if(web!=null)web.onPause();super.onPause();}
    @Override protected void onDestroy(){if(web!=null)web.destroy();super.onDestroy();}
    @Override public void onBackPressed(){web.evaluateJavascript("window.handleBack && window.handleBack()",result->{if("false".equals(result))super.onBackPressed();});}
    private void message(String text){runOnUiThread(()->Toast.makeText(this,text,Toast.LENGTH_LONG).show());}
    public class Bridge {
        @JavascriptInterface public String load(){return getSharedPreferences("liftlog",MODE_PRIVATE).getString("data","");}
        @JavascriptInterface public boolean save(String data){
            try{new JSONObject(data);if(data.length()>5000000)return false;
                boolean ok=getSharedPreferences("liftlog",MODE_PRIVATE).edit().putString("data",data).commit();
                if(ok)WorkoutWidget.refresh(MainActivity.this);return ok;
            }catch(Exception e){return false;}
        }
        @JavascriptInterface public void startTimer(int seconds){
            if(seconds<1 || seconds>3600)return;
            runOnUiThread(()->{
                if(Build.VERSION.SDK_INT>=33 && checkSelfPermission("android.permission.POST_NOTIFICATIONS")!=android.content.pm.PackageManager.PERMISSION_GRANTED)requestPermissions(new String[]{"android.permission.POST_NOTIFICATIONS"},12);
                Intent i=new Intent(MainActivity.this,RestTimerService.class).putExtra("seconds",seconds);
                startForegroundService(i);
            });
        }
        @JavascriptInterface public void stopTimer(){stopService(new Intent(MainActivity.this,RestTimerService.class));}
        @JavascriptInterface public void haptic(){runOnUiThread(()->web.performHapticFeedback(HapticFeedbackConstants.CONFIRM));}
        @JavascriptInterface public void pinWidget(){runOnUiThread(()->{
            AppWidgetManager m=getSystemService(AppWidgetManager.class);
            if(m.isRequestPinAppWidgetSupported())m.requestPinAppWidget(new ComponentName(MainActivity.this,WorkoutWidget.class),null,null);
            else message("홈 화면을 길게 눌러 위젯 → 리프트로그를 선택하세요.");
        });}
        @JavascriptInterface public void exportBackup(String data){runOnUiThread(()->{
            exportData=data;
            Intent i=new Intent(Intent.ACTION_CREATE_DOCUMENT).setType("application/json").addCategory(Intent.CATEGORY_OPENABLE).putExtra(Intent.EXTRA_TITLE,"liftlog-backup.json");
            startActivityForResult(i,EXPORT);
        });}
        @JavascriptInterface public void importBackup(){runOnUiThread(()->startActivityForResult(new Intent(Intent.ACTION_OPEN_DOCUMENT).setType("application/json").addCategory(Intent.CATEGORY_OPENABLE),IMPORT));}
    }
    @Override protected void onActivityResult(int request,int result,Intent intent){
        super.onActivityResult(request,result,intent);
        if(result!=RESULT_OK || intent==null || intent.getData()==null)return;
        try{
            if(request==EXPORT){try(OutputStream stream=getContentResolver().openOutputStream(intent.getData())){if(stream==null)throw new IOException();stream.write(exportData.getBytes(StandardCharsets.UTF_8));}message("백업을 저장했습니다.");}
            if(request==IMPORT){
                String data;
                try(InputStream stream=getContentResolver().openInputStream(intent.getData());ByteArrayOutputStream out=new ByteArrayOutputStream()){
                    if(stream==null)throw new IOException();byte[] buf=new byte[4096];int n;
                    while((n=stream.read(buf))!=-1){out.write(buf,0,n);if(out.size()>5000000)throw new IOException("too large");}
                    data=out.toString("UTF-8");
                }
                web.evaluateJavascript("window.importBackup("+JSONObject.quote(data)+")",null);
            }
        }catch(Exception e){message("파일을 읽거나 저장하지 못했습니다. 다시 시도해 주세요.");}
    }
}
