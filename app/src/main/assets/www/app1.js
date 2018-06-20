var initialDetails = ["London,UK", "Phoenix,US"];
var oldValues = {};
var newValues ={};
var newValuesDuplicate = {};
var tempCities = [];
var thirdCity = false;

function loadTable()
{
  var str = JSinterface.getSelectedCities();
  var city3 = JSinterface.getThirdCity();
  if(city3 != null)
  {
    initialDetails.push(city3);
  }
  modifyOptions(str);
  loadTableDetails(initialDetails);
}

function unixTostandard(sec)
{
   var utcSeconds = sec;
   var d = new Date(sec * 1000);
   //d.setUTCSeconds(utcSeconds);
   return d;
}
function compute()
{
    var minTemp = 1000;
    var minTempCity = "";
    var niceCity = "";
    var worstCity = "";
    var maxTemp = -500;
    var maxCloud  = 0;
    var maxCloudCity = "";
    var maxTempCity = "";
    var maxHumid = 0;
    var maxHumidCity = "";
    var avgTemp = 0;
    var avgHumidity = 0;
    var count =  Object.keys(newValues).length;
    for (var city in newValues)
    {
       if(newValues.hasOwnProperty(city))
          {
            avgTemp = Math.round((avgTemp + newValues[city].temp)/count)*100/100;
            avgHumidity = Math.round((avgHumidity + newValues[city].humidity)/count) *100/100;
            if(newValues[city].temp > maxTemp)
            {
              maxTemp = newValues[city].temp;
              maxTempCity = newValues[city].cityName;
            }
            if(newValues[city].humidity > maxHumid)
            {
              maxHumid = newValues[city].humidity;
              maxHumidCity = newValues[city].cityName;
            }
            if(minTemp > newValues[city].temp)
            {
              minTemp = newValues[city].temp;
              minTempCity = newValues[city].cityName;
            }
            if(maxCloud < newValues[city].cloud)
            {
              maxCloud = newValues[city].cloud;
              maxCloudCity = newValues[city].cityName;
            }
          }

    }

    document.getElementById("avgTemp").innerHTML = avgTemp;
    document.getElementById("hotCity").innerHTML = maxTempCity;
    document.getElementById("avgHumid").innerHTML = avgHumidity;
    document.getElementById("humidCity").innerHTML = maxHumidCity;
    document.getElementById("niceWeather").innerHTML = maxCloudCity;
    document.getElementById("worstWeather").innerHTML = maxTempCity;
    //document.getElementById("worstWeather").innerHTML = maxHumidCity;
    //document.getElementById("worstWeather").innerHTML = maxTempCity;
}

function thirdRow()
{
     thirdCity = true;
     for(var i=0; i < tempCities.length; i++)
     {
            var oldid = tempCities[i]+"_old";
            var newid = tempCities[i]+"_new";
            var row = document.getElementById(oldid);
            if(row != null)
            {
               var cityToBeDeleted = document.getElementById("tableId").lastChild.children[0].innerHTML;
               delete newValues[cityToBeDeleted];
               document.getElementById("tableId").deleteRow(-1);

            }
            row = document.getElementById(newid);
            if(row != null)
            {
               var cityToBeDeleted = document.getElementById("tableId").lastChild.children[0].innerHTML;
               delete newValues[cityToBeDeleted];
               document.getElementById("tableId").deleteRow(-1);
            }
     }

     tempCities = [];
     var city = document.getElementById("selectTag").value.trim();
     for(var i=0; i < tempCities.length; i++)
     {
       newValues[city] = null;
       oldValues[city] = null;
     }
     var url = urlBuilder(city);
     tempCities.push(city);
     ajaxResult(url, city);
   }

function refresh()
{
  loadTableDetails(initialDetails.concat(tempCities));
}

function loadTableDetails(cities)
{
      for(var i=0; i < cities.length; i++)
      {
          var url = "";
          url =urlBuilder(cities[i]);
          ajaxResult(url, cities[i]);
      }
}

function urlBuilder(str)
{
  var url="";
  url = "https://api.openweathermap.org/data/2.5/weather?q="+str+"&APPID=2ca12bc99db42e9a0116d515945774e9";
  return url;
}

function ajaxResult(address, city) {
  var request = new XMLHttpRequest();
  request.onreadystatechange =
    function()
     {
      showResponseText(request, city);
     };
  request.open("GET", address, true);
  request.send(null);
}

function showResponseText(request, city) {
  if((request.status >= 400))
  {
    if((request.status == 401))
         {
           document.getElementById("errorCode").innerHTML = " 401 Error!! Unauthorized Access";
         }
    if((request.status == 403))
         {
           document.getElementById("errorCode").innerHTML = " 403 Error!! Forbidden Access";
         }
    if((request.status == 404))
        {
               document.getElementById("errorCode").innerHTML = " 404 Error!! Not Found";
         }
    if((request.status == 405))
    {
        document.getElementById("errorCode").innerHTML = " 405 Error!! Method Not Allowed";
    }

  }
  if((request,status >= 500))
  {
     if((request.status == 500))
     {
        document.getElementById("errorCode").innerHTML = " 500 Error!! Internal Server Error";
     }
     if((request.status == 502))
     {
        document.getElementById("errorCode").innerHTML = " 502 Error!! Bad Gateway";
     }
  }
  if((request.readyState == 4) && (request.status == 200))
  {
    var values = JSON.parse(request.responseText);
    loadJSON(values, city);
    buildRows(city);
  }
}
function loadJSON(values, city)
{
   if(newValues[city] != null )
   {
     oldValues[city] = {};
     oldValues[city] = newValues[city];
   }
   var cityName = values["name"] +", " +values.sys["country"];
   newValues[city] = {};
   newValues[city].cityName = cityName;
   newValues[city].time = unixTostandard(values["dt"]);
   newValues[city].temp = Math.round((values.main["temp"] - 273.15) *100)/100;
   newValues[city].humidity  = values.main["humidity"];
   newValues[city].wind = Math.round((values.wind["speed"]*2.236)*100)/100;
   newValues[city].cloud = values.clouds["all"];
   newValues[city].dt = values["dt"];
   compute();
}

function buildRows(city)
{
  if(newValues[city] != null)
  {
    var id = newValues[city].cityName+"_new";
    var row = document.getElementById(id);
    var cityName, timeStamp, temp, humidity, wind, cloud;
    if(row == null)
    {
        var table = document.getElementById("tableId");
        var row = document.createElement("TR");
        row.setAttribute("id" , id);
        table.appendChild(row);
        cityName = row.insertCell(0);
        timeStamp = row.insertCell(1);
        temp = row.insertCell(2);
        humidity = row.insertCell(3);
        wind = row.insertCell(4);
        cloud = row.insertCell(5);
    }
    cityName = row.cells[0];
    timeStamp = row.cells[1];
    temp = row.cells[2];
    humidity = row.cells[3];
    wind = row.cells[4];
    cloud = row.cells[5];
    cityName.innerHTML =  newValues[city].cityName;
    timeStamp.innerHTML = newValues[city].time;
    temp.innerHTML = newValues[city].temp;
    humidity.innerHTML = newValues[city].humidity;
    wind.innerHTML = newValues[city].wind;
    cloud.innerHTML = newValues[city].cloud;
  }
  if(oldValues[city] != null)
  {
    var oldid = oldValues[city].cityName+"_old";
    var newid = oldValues[city].cityName+"_new";
    var row = document.getElementById(oldid);
    var cityName, timeStamp, temp, humidity, wind, cloud;
    if(row == null)
    {
        var table = document.getElementById("tableId");
        row = document.createElement("TR");
        row.setAttribute("id" , oldid);
        insertAfter(row, document.getElementById(newid));
        cityName = row.insertCell(0);
        timeStamp = row.insertCell(1);
        temp = row.insertCell(2);
        humidity = row.insertCell(3);
        wind = row.insertCell(4);
        cloud = row.insertCell(5);
    }
    cityName = row.cells[0];
    timeStamp = row.cells[1];
    temp = row.cells[2];
    humidity = row.cells[3];
    wind = row.cells[4];
    cloud = row.cells[5];
    if(newValues[city].dt == oldValues[city].dt)
    {
      cityName.innerHTML =  oldValues[city].cityName;
      timeStamp.innerHTML = oldValues[city].time;
      temp.innerHTML = "No Change";
      humidity.innerHTML = "No Change";
      wind.innerHTML = "No Change";
      cloud.innerHTML = "No Change";
    }
    else
    {
      cityName.innerHTML =  oldValues[city].cityName;
      timeStamp.innerHTML = oldValues[city].time;
      temp.innerHTML = oldValues[city].temp;
      humidity.innerHTML = oldValues[city].humidity;
      wind.innerHTML = oldValues[city].wind;
      cloud.innerHTML = oldValues[city].cloud;
    }
  }
  if(thirdCity)
  {
      JSinterface.setCity(tempCities[0]);
  }
}

function modifyOptions(str)
{
   var newCities = str.split(";");
    var selectTag = document.getElementById("selectTag");
    for(var i=0; i < newCities.length; i++)
    {
      var optionElement = document.createElement("option");
      optionElement.innerHTML = newCities[i];
      optionElement.value = newCities[i];
      selectTag.appendChild(optionElement);
    }
}

function insertAfter(newElement, targetElement) {
    var parent = targetElement.parentNode;
    if (parent.lastChild == targetElement) {
        parent.appendChild(newElement);
    } else {
        parent.insertBefore(newElement, targetElement.nextSibling);
    }
}


