var http = require('http');
var fs = require('fs');
var url = require('url');
var LRU = require("lru-cache");
var cache;
var options = {
    local_port: '8081',
    server: '192.168.0.39',
    port: '80',
    max_requests: 10,
    cache_size: 200,
    freshness: 10
};
LRUCache(); //Cache Implementation

function parseCookies(request) {
    var cookieslist = {};
    requestCookies = request.headers.cookie;
    if (requestCookies) {
        requestCookies.split(';').forEach(function(cookie) {
            var chunk = cookie.split('=');
            cookieslist[chunk.shift().trim()] = decodeURI(chunk.join('='));
        });
    }
    return cookieslist;
}
http.createServer(function(request, response) {
    var pathname = url.parse(request.url).pathname;
    var epochTime = new Date().getTime() + 1000*60*10;
    if (pathname.indexOf("admin/") != -1) {
        cacheAPI(request, response);
    } else if(pathname.indexOf("favicon") != -1) {
      response.end();
    }
    else {
        if (cache.get(pathname) == undefined) {
            console.log("Cache not found");
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
                var post = http.request(postOptions, function(resPost) {
                    var headerString = JSON.stringify(resPost.headers);
                    var headerObj = JSON.parse(headerString);
                    Str = headerObj["content-type"];
                    status_code = resPost.statusCode;
                    var epochTimeNew = new Date().getTime();
                    var timeNew = epochTimeNew.toString();
                    var contentLength = resPost.headers["content-length"];
                    resPost.on('data', function(chunk) {
                        body += chunk;
                        if (!cookies.count) {
                            response.setHeader('Set-Cookie', ['time=' + timeNew, 'count=1']);
                            response.writeHead(status_code, {
                                "Content-Type": Str,
                                "Content-Length": contentLength
                            });
                            response.write(body);
                        } else {
                            var count;
                            var cookies_time;
                            var newCount;
                            count = parseInt(cookies.count);
                            //cookies_time = parseInt(cookies.time);
                            var currentTime = epochTimeNew;
                            if (currentTime < epochTime && count < postOptions.maxRequests) {
                                newCount = ++count;
                                response.setHeader('Set-Cookie', ['time=' + timeNew, 'count=' + newCount.toString()]);
                                response.writeHead(status_code, {
                                    "Content-Type": Str,
                                    "Content-Length": contentLength
                                });
                                response.write(chunk);
                            } else if (currentTime > epochTime) {
                                epochTime = new Date().getTime() + 600000;
                                response.setHeader('Set-Cookie', ['time=' + timeNew, 'count=1']);
                            } else {
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
                    resPost.on('end', function() {
                        if (status_code >= 400 && status_code < 500) {
                            response.writeHead(statusCode, {
                                "Content-Type": "text/html"
                            });
                            response.write(body);
                        } else if (status_code == 200) {
                            var respObject = {
                                value: body,
                                headers: resPost.headers
                            };
                            cache.set(pathname, respObject);
                            console.log("cache is set");
                        }

                    });
                    resPost.on('error', function() {
                        console.log(error);
                    });
                });
                var payload = '';
                request.on('data', function(data) {
                    payload += data;
                });
                post.write(payload);
                post.end();
            } else {
                var request_options = {
                    hostname: options.server,
                    port: options.port,
                    path: pathname,
                    maxRequests: options.max_requests,
                    client_response: response,
                }
                var cookies = parseCookies(request);
                var getReq = http.get(request_options, function(res) {
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
                        http.get(redirect_options, function(resp) {
                            var headerString1 = JSON.stringify(resp.headers);
                            var headerObj1 = JSON.parse(headerString1);
                            var Str1 = headerObj1["content-type"];
                            var re = /([^;]+)(?:;.*)?/;
                            var contentType = re.exec(Str1);
                            var contentLength = resp.headers['content-length'];
                            resp.on('data', function(chunk) {
                                response.writeHead(res.statusCode, {
                                    "Content-Type": contentType[1],
                                    "Content-Length": contentLength
                                });
                                response.write(chunk);

                            });
                            resp.on('end', function() {

                            });
                        });

                    } else if (res.statusCode == 200) {
                        var content = '';
                        res.on('data', function(chunk) {
                            content += chunk;
                            if (!cookies.count) {
                                var epochTimeNew = new Date().getTime();
                                var timeNew = epochTimeNew.toString();
                                response.setHeader('Set-Cookie', ['time=' + timeNew, 'count=1']);
                                response.writeHead(res.statusCode, {
                                    "Content-Type": contentType[1],
                                    "content-length": contentLength
                                });
                                response.write(chunk);
                            } else {
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
                                } else if (currentTime > epochTime) {
                                    epochTime = new Date().getTime() + 600000;
                                    response.setHeader('Set-Cookie', ['time=' + currentTime.toString(), 'count=1']);
                                    response.write(chunk);
                                } else {
                                    var tooManyReqMsg = "Error 429 -- Too Many requests";
                                    response.writeHead(429, {
                                        "Content-Type": "text/html",
                                        "Content-Length": tooManyReqMsg.length
                                    });
                                    response.write(tooManyReqMsg);
                                    response.end();
                                }
                            }
                        });

                        res.on('end', function() {
                                var respObject = {
                                    value: content,
                                    headers: res.headers
                                };
                                cache.set(pathname, respObject);
                                console.log("cache is set");
                        });
                    } // else if code 200
                    else {
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
                    } // other status codes
                });
                getReq.end();
            } // ends get part

        } else {
            //handle if cache is present
            console.log("Cache found, Serving from cache");
            var cacheObject = cache.get(pathname);
            response.writeHead('200', {
                'Content-Type': cacheObject.headers['content-type']
            });
            response.end(cacheObject.value);
        }
    } // end of else - not API


}).listen(options.local_port,function(){
  console.log('Server running at ',options.local_port);
});


//Cache Implementation


function LRUCache() {
    var cache_options = {
        max: options.cache_size * 1024,
        length: function(n, key) {
            return n.value.length;
        },
        dispose: function(key, n) {
            console.log("key removed", key);
        },
        maxAge: 1000 * 60
    };
    cache = LRU(cache_options);
    console.log("Cache initialized");
    
    setInterval(proactiveStalenessCleaner, options.freshness * 1000);
    
}

//In this implementation, there is a built-in staleness feature, but it is "lazy" in the sense that it removes a stale item only
// when it is accessed. Add a proactive staleness cleaner that checks the cache every <freshness> seconds, where "<freshness>" is
// a new value for your options.

function proactiveStalenessCleaner() {
    console.log("Sweeping the cache for old entries");
    cache.prune();
}

function cacheAPI(request, response) {
    var urlObject = url.parse(request.url, true, false);
    if (request.method == 'GET') {
        if (urlObject.pathname == '/admin/cache') {
            if (cache.get(urlObject.query.key) == undefined) {
                response.writeHead("404", {
                    'Content-Type': 'text/html'
                });
                response.end("404 Key Not Found");
            } else {
                response.writeHead(200, cache.get(urlObject.query.key).headers);
                response.end(cache.get(urlObject.query.key).value);
            }
        } else {
            response.writeHead("404", {
                'Content-Type': 'text/html'
            });
            response.end("Method not found");
        }
    } else if (request.method == 'POST') {
        if (urlObject.pathname == '/admin/reset') {
            cache.reset();
            response.writeHead("200", {
                'Content-Type': 'text/html'
            });
            response.end("Cache Reset Successful");
        } else {
            response.writeHead("404", {
                'Content-Type': 'text/html'
            });
            response.end("Method not found");
        }
    } else if (request.method == 'DELETE') {
        if (urlObject.pathname == '/admin/cache') {
            if (cache.get(urlObject.query.key) != undefined) {
                cache.del(urlObject.query.key);
                response.writeHead("200", {
                    'Content-Type': 'text/html'
                });
                response.end("Deleted Successfully");
            } else {
                response.writeHead("404", {
                    'Content-Type': 'text/html'
                });
                response.end("Key Not found");
            }
        } else {
            response.writeHead("404", {
                'Content-Type': 'text/html'
            });
            response.end("Method not found");
        }
    } else if (request.method == 'PUT') {
        if (urlObject.pathname == '/admin/cache') {
            var respObject = {
                value: urlObject.query.value,
                headers: {
                    'Content-Type': 'text/html'
                }
            };
            cache.set(urlObject.query.key, respObject);
            if (cache.get(urlObject.query.key) != undefined) {
                response.end("Inserted " + urlObject.query.key + " : " + cache.get(urlObject.query.key));
            } else {
                response.end("Not inserted in cache as cache size is less than size of given content");
            }
        } else {
            response.writeHead("404", {
                'Content-Type': 'text/html'
            });
            response.end("Method not found");
        }
    } else {
        response.writeHead("404", {
            'Content-Type': 'text/html'
        });
        response.end("Method not found");
    }
    console.log('final cache', cache);
}