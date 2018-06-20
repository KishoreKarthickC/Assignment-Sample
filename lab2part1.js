var http = require('http');
var fs = require('fs');
var url = require('url');
var options = {
    local_port: '8081',
    server: '192.168.0.39',
    port: '80'
};
http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");
    console.log("the method is " + request.method);
    if (request.method != 'GET') {
        var errMsg = "Error 405 : Method not allowed other than GET";
        response.writeHead(405, { "Content-Type": "text/html" });
        response.write(errMsg);
        response.end();
    }
    else {

        var request_options = {
            hostname: options.server,
            port: options.port,
            path: pathname,
            client_response: response
        }

        var extReq = http.get(request_options, function (res) {
            var str = '';
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.on('data', function (chunk) {
                str += chunk;
            });
            res.on('end', function () {
                var responseCode = res.statusCode;
                if (responseCode == 200) {
                    response.writeHead(responseCode, { "Content-Type": "text/html" });
                    response.write(str);
                    response.end();
                }
                else if (responseCode >= 400 || responseCode <= 500) {
                    response.writeHead(responseCode, { "Content-Type": "text/html" });
                    response.write(str);
                }
                else if (responseCode >= 300) {
                    response.writeHead(responseCode, { "Content-Type": "text/html" });
                    response.write(str);
                }
            });
            console.log("The status code is " + res.statusCode);
        });
        extReq.end();
    }

}).listen(options.local_port, function () {
    console.log('Server running on:', options.local_port);
});
