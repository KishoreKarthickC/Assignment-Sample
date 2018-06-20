var http = require('http');
var fs = require('fs');
var url = require('url');
var options = {
  local_port: '8081',
  server: 'loggeranuj.herokuapp.com',
  port: '80',
  max_requests: 10
};
function parseCookies(request) {
  var cookieslist = {};
  requestCookies = request.headers.cookie;
  if (requestCookies) {
    requestCookies.split(';').forEach(function (cookie) {
      var chunk = cookie.split('=');
      cookieslist[chunk.shift().trim()] = decodeURI(chunk.join('='));
    });
  }
  return cookieslist;
}
http.createServer(function (request, response) {
  var pathname = url.parse(request.url).pathname;
  var epochTime = new Date().getTime() + 60000;
  if (request.method == 'POST') {
    var body = '';
    var Str = "";
    var postOptions = {
      hostname: options.server,
      port: options.port,
      path: pathname,
      method: request.method,
      maxRequests: options.max_requests,
      client_response: response
    }

    var status_code;
    var cookies = parseCookies(request);
    var post = http.request(postOptions, function (resPost) {
      var headerString = JSON.stringify(resPost.headers);
      var headerObj = JSON.parse(headerString);
      Str = headerObj["content-type"];
      var contentLength = resPost.headers["content-length"];
      status_code = resPost.statusCode;
      var epochTimeNew = new Date().getTime();
      var timeNew = epochTimeNew.toString();
      resPost.on('data', function (chunk) {
        body += chunk;
        if (!cookies.count) {
          // timeNew = epochTimeNew.toString();

          response.setHeader('Set-Cookie', ['time=' + timeNew, 'count=1']);
          // response.writeHead(res.statusCode, { "Content-Type": contentType[1] });
          response.writeHead(res.statusCode, { "Content-Type": Str, "Content-Length": contentLength });
          response.write(chunk);
        }
        else {
          var count;
          var cookies_time;
          var newCount;
          count = parseInt(cookies.count);
          //cookies_time = parseInt(cookies.time);
          var currentTime = epochTimeNew;
          if (currentTime < epochTime && count < postOptions.maxRequests) {
            newCount = ++count;
            response.setHeader('Set-Cookie', ['time=' + timeNew, 'count=' + newCount.toString()]);
           // response.writeHead(res.statusCode, { "Content-Type": contentType[1] });
            response.writeHead(status_code, { "Content-Type": Str,  "Content-Length": contentLength});
            response.write(chunk);
          }
          else if (currentTime > epochTime) {
            epochTime = new Date().getTime() + 600000;
            response.setHeader('Set-Cookie', ['time=' + timeNew, 'count=1']);
          }
          else {
            var tooManyReqMsg = "Error 429 -- Too Many requests";
            response.writeHead(429, {
                "Content-Type": "text/html",
                "Content-Length": contentLength
            });
            response.write(tooManyReqMsg);
            response.end();
          }
        }
      });
      resPost.on('error', function () {
        console.log(error);
      });
    });
    var payload = '';
    request.on('data', function(data) {
        payload += data;
    });
    post.write(payload);
    post.end();
  }
  else {
    var request_options = {
      hostname: options.server,
      port: options.port,
      path: pathname,
      maxRequests: options.max_requests,
      client_response: response,
    }
    var cookies = parseCookies(request);
    http.get(request_options, function (res) {
      var headerString = JSON.stringify(res.headers);
      var epochTimeNew = new Date().getTime();
      var headerObj = JSON.parse(headerString);
      var Str = headerObj["content-type"];
      var re = /([^;]+)(?:;.*)?/;
      var contentType = re.exec(Str);
      var contentLength = res.headers['content-length'];
      if (res.statusCode >= 300 && res.statusCode < 400) {
        var hostName = url.parse(res.headers.location).hostname;
        var pathName = url.parse(res.headers.location).pathname;
        var queryString = url.parse(res.headers.location).query;
        var portNumber = url.parse(res.headers.location).port;
        var redirect_options = {
          hostname: hostName,
          port: portNumber,
          path: pathName,
          client_response: response
        }
        http.get(redirect_options, function (resp) {
          var headerString1 = JSON.stringify(resp.headers);
          var headerObj1 = JSON.parse(headerString1);
          var Str1 = headerObj1["content-type"];
          var re = /([^;]+)(?:;.*)?/;
          var contentType = re.exec(Str1);
          var contentLength = resp.headers['content-length'];
          resp.on('data', function (chunk) {
            response.writeHead(res.statusCode, {
              "Content-Type": contentType[1],
              "Content-Length": contentLength
          });
          response.write(chunk);

          });
          resp.on('end', function () {

          });
        });
      } else if (res.statusCode == 200) {
        res.on('data', function (chunk) {          
          if (!cookies.count) {
            var epochTimeNew = new Date().getTime();
            var timeNew = epochTimeNew.toString();
            response.setHeader('Set-Cookie', ['time=' + timeNew, 'count=1']);
            response.writeHead(res.statusCode, {
              "Content-Type": contentType[1],
              "content-length": contentLength
          });
            response.write(chunk);
          }
          else {
            var count;
            var cookies_time;
            var newCount;
            count = parseInt(cookies.count);
            cookies_time = parseInt(cookies.time);
            var epochTimeNew = new Date().getTime();
            var currentTime = epochTimeNew;
            if (currentTime < epochTime && count < request_options.maxRequests) {
              newCount = ++count;
              response.setHeader('Set-Cookie', ['time=' + currentTime.toString(), 'count=' + newCount.toString()]);
              response.writeHead(res.statusCode, {
                "Content-Type": contentType[1],
                "content-length": contentLength
            });
              response.write(chunk);
            }
            else if (currentTime > epochTime) {
              epochTime = new Date().getTime() + 600000;
              response.setHeader('Set-Cookie', ['time=' + currentTime.toString(), 'count=1']);
              response.write(chunk);
            }
            else {
              var tooManyReqMsg = "Error 429 -- Too Many requests";
              response.writeHead(429, {
                  "Content-Type": "text/html",
                  "Content-Length": tooManyReqMsg.length
              });
              response.write(tooManyReqMsg);
              response.end();
              
            }
            response.end();
          }
        });
      }
      else{
        var content = '';
        res.on('data', function(data) {
         content += data;
        });
        res.on('end', function() {
           response.writeHead(res.statusCode, {
                   "Content-Type": "text/html",
                   "Content-Length":content.length
               });
               response.write(content);
        });
      }
      res.on('end', function () {
      });
    });
  }
}).listen(options.local_port);
console.log('Server running at http://127.0.0.1/', options.local_port);