package com.lab6;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.Toast;
import java.util.ArrayList;
import java.util.Locale;

public class MainActivity extends AppCompatActivity {


    public ArrayList<String> selectedCities = new ArrayList<>();
    public static String cities;
    public String thirdCity = "";
    Button button,showWeatherButton,changeButton;
    Context c;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        showWeatherButton = (Button) findViewById(R.id.showWeather);
        changeButton = (Button) findViewById(R.id.selectedCities);

        changeButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(getApplicationContext(),
                        "Elements added to the drop down", Toast.LENGTH_LONG).show();
            }
        });
        showWeatherButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                Intent webIntent = new Intent(MainActivity.this, WebActivity.class);
                StringBuilder sb = new StringBuilder();
                for(int i=0; i < selectedCities.size(); i++) {
                    sb.append(selectedCities.get(i));
                    sb.append(";");
                }
                sb.setLength(sb.length()-1);
                webIntent.putExtra("cityNames" , sb.toString());
                webIntent.putExtra("thirdCity", thirdCity);
                startActivityForResult(webIntent,1);
            }
        });
    }


    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == 1) {
            if(resultCode == Activity.RESULT_OK) {
                thirdCity = data.getStringExtra("thirdCity");
                Log.v("thirdcity in main -- ", thirdCity);

            }
        }
    }
    public void onCheckboxClicked(View view) {
        if(((CheckBox)view).getText().equals(thirdCity))
        {
            ((CheckBox) view).setChecked(true);
            Toast.makeText(this, "You Cannot remove this city ", Toast.LENGTH_SHORT).show();
            ((CheckBox) view).setChecked(true);
            return;
        }

        if(!((CheckBox) view).isChecked())
        {
            selectedCities.remove(((CheckBox)view).getText());
            Toast.makeText(this, ((CheckBox)view).getText()+"removed "+selectedCities.size(), Toast.LENGTH_SHORT).show();
            ((CheckBox) view).setChecked(false);
            return;
        }
        if(selectedCities.size() <= 4)
        {
                boolean checked = ((CheckBox) view).isChecked();
                switch(view.getId()) {
                    case R.id.Chennai:
                        if(checked)
                        {
                            selectedCities.add("Chennai, IN");
                            Toast.makeText(this, "Chennai added "+selectedCities.size(), Toast.LENGTH_SHORT).show();
                        }
                        else
                        {
                            selectedCities.remove("Chennai, IN");
                            Toast.makeText(this, "Chennai removed "+selectedCities.size(), Toast.LENGTH_SHORT).show();
                        }
                        break;
                    case R.id.Denver:
                        if(checked)
                        {
                            selectedCities.add("Denver, US");
                            Toast.makeText(this, "Denver added "+selectedCities.size(), Toast.LENGTH_SHORT).show();
                        }
                        else
                        {
                            selectedCities.remove("Denver, US");
                            Toast.makeText(this, "Denver removed "+selectedCities.size(), Toast.LENGTH_SHORT).show();
                        }
                        break;
                    case R.id.Vegas:
                        if(checked)
                        {
                            selectedCities.add("Las Vegas, US");
                            Toast.makeText(this, "Vegas added "+selectedCities.size(), Toast.LENGTH_SHORT).show();
                        }
                        else
                        {
                            selectedCities.remove("Las Vegas, US");
                            Toast.makeText(this, "Vegas removed "+selectedCities.size(), Toast.LENGTH_SHORT).show();
                        }
                        break;
                    case R.id.SD:
                        if(checked)
                        {
                            selectedCities.add("San Diego, US");
                            Toast.makeText(this, "SD added "+selectedCities.size(), Toast.LENGTH_SHORT).show();
                        }
                        else
                        {
                            selectedCities.remove("San Diego, US");
                            Toast.makeText(this, "SD added "+selectedCities.size(), Toast.LENGTH_SHORT).show();
                        }
                        break;
                    case R.id.Tucson:
                        if(checked)
                        {
                            selectedCities.add("Tucson, US");
                            Toast.makeText(this, "Tucson added "+selectedCities.size(), Toast.LENGTH_SHORT).show();
                        }
                        else
                        {
                            selectedCities.remove("Tucson, US");
                            Toast.makeText(this, "Tucson removed "+selectedCities.size(), Toast.LENGTH_SHORT).show();
                        }
                        break;
                    case R.id.Delhi:
                        if(checked)
                        {
                            selectedCities.add("New Delhi, IN");
                            Toast.makeText(this, "Delhi added "+selectedCities.size(), Toast.LENGTH_SHORT).show();
                        }
                        else
                        {
                            selectedCities.remove("New Delhi, IN");
                            Toast.makeText(this, "Delhi removed "+selectedCities.size(), Toast.LENGTH_SHORT).show();
                        }
                        break;
                    case R.id.Sydney:
                        if(checked)
                        {
                            selectedCities.add("Sydney, AU");
                            Toast.makeText(this, "Sydney added "+selectedCities.size(), Toast.LENGTH_SHORT).show();
                        }
                        else
                        {
                            selectedCities.remove("Sydney, AU");
                            Toast.makeText(this, "Sydney removed "+selectedCities.size(), Toast.LENGTH_SHORT).show();
                        }
                        break;
                    case R.id.LA:
                        if(checked)
                        {
                            selectedCities.add("Los Angeles, US");
                            Toast.makeText(this, "LA added "+selectedCities.size(), Toast.LENGTH_SHORT).show();
                        }
                        else
                        {
                            selectedCities.remove("Los Angeles, US");
                            Toast.makeText(this, "LA removed "+selectedCities.size(), Toast.LENGTH_SHORT).show();
                        }
                        break;
                    case R.id.NY:
                        if(checked)
                        {
                            selectedCities.add("New York, US");
                            Toast.makeText(this, "NY added "+selectedCities.size(), Toast.LENGTH_SHORT).show();
                        }
                        else
                        {
                            selectedCities.remove("New York, US");
                            Toast.makeText(this, "NY removed "+selectedCities.size(), Toast.LENGTH_SHORT).show();
                        }
                        break;
                    case R.id.Paris:
                        if(checked)
                        {
                            selectedCities.add("Paris, FR");
                            Toast.makeText(this, "Paris added "+selectedCities.size(), Toast.LENGTH_SHORT).show();
                        }
                        else
                        {
                            selectedCities.remove("Paris, FR");
                            Toast.makeText(this, "Paris removed "+selectedCities.size(), Toast.LENGTH_SHORT).show();
                        }
                        break;
            }
        }
        else
        {
            Toast.makeText(this, "Please limit to 5 cities", Toast.LENGTH_SHORT).show();
            ((CheckBox) view).setChecked(false);
        }

    }
}
