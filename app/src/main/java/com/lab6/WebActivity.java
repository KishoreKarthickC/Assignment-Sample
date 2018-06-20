package com.lab6;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class WebActivity extends AppCompatActivity{

    public WebView myWebView;
    public static String thirdCity="";
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_web);
        final String cityNames = getIntent().getStringExtra("cityNames");
        final String thirdCity = getIntent().getStringExtra("thirdCity");
        myWebView = (WebView) findViewById(R.id.webView);
        myWebView.addJavascriptInterface(new WebAppInterface(this, cityNames,thirdCity), "JSinterface");
        myWebView.getSettings().setJavaScriptEnabled(true);
        myWebView.getSettings().setDomStorageEnabled(true);
        myWebView.getSettings().setAllowUniversalAccessFromFileURLs(true);
        myWebView.getSettings().setUseWideViewPort(true);
        myWebView.getSettings().setLoadWithOverviewMode(true);
        myWebView.getSettings().setSupportZoom(true);
        myWebView.getSettings().setBuiltInZoomControls(true);
        myWebView.getSettings().setDisplayZoomControls(false);
        myWebView.loadUrl("file:///android_asset/www/index.html");
    }
    @Override
    public void onBackPressed() {
        Intent intent = new Intent();
        intent.putExtra("thirdCity", thirdCity);
        setResult(Activity.RESULT_OK,intent);

        finish();
    }

    public void setThirdCity(String City)
    {
        thirdCity = City;
        Log.v("thirdcity -- ", thirdCity);
    }
    @JavascriptInterface
    public String getThirdCity()
    {
        return thirdCity;
    }

}
