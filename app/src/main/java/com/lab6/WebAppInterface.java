package com.lab6;

import android.app.Activity;
import android.content.Context;
import android.util.Log;
import android.webkit.JavascriptInterface;

import java.util.ArrayList;

public class WebAppInterface{

    WebActivity mContext;
    MainActivity context;
    String cities;
    String city3 ="";
    WebAppInterface(WebActivity c){
        mContext = (WebActivity) c;
    }
    WebAppInterface(WebActivity c, String cities,String city3)
    {
        mContext = (WebActivity) c;
        this.cities = cities;
        this.city3= city3;
    }

    @JavascriptInterface
    public String getSelectedCities()
    {
        //String cityList = String.join(",", cities);
        Log.v("Webapp", cities);
        return cities;
    }

    @JavascriptInterface
    public  void setCity(String city)
    {
        mContext.setThirdCity(city);
    }

    @JavascriptInterface
    public  String getThirdCity()
    {
        return city3;
    }
}
