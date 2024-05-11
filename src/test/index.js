// const path = require("path");
// const fs = require("fs");

// const createWriteStream = (fileName = '') => {
//     const res = fs.mkdirSync(`${__dirname}/downlaod/index.js`, { recursive: true });
//     console.log(res, 'sadasdsadas')
//     // fs.mkdirSync(`${__dirname}/downloads/sadsa`, { recursive: true });
//     // const dirPath = path.join(__dirname)
//     // console.log(dirPath, 'dirPathdirPathdirPathdirPathdirPath', path.resolve())
//     // fs.mkdir(dirPath, { recursive: true }, (err) => {
//     //     if (err) {
//     //         return console.error('Error creating directory:', err);
//     //     }
//     //     // 创建文件流
//     //     const stream = fs.createWriteStream(`${__dirname}/${fileName}`);

//     //     stream.on('error', function (err) {
//     //         console.error('Error in write stream:', err);
//     //     });

//     //     stream.write('Hello, World!');
//     //     stream.end();
//     // })
// }
// createWriteStream('text.js')

var http = require("http");

http.createServer(function (req, res) {
    var fileName = "." + req.url;

    if (fileName === "./stream") {
        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": '*',
        });
        // res.write("retry: 10000\n");
        // res.write("event: connecttime\n");
        // res.write("data: " + (new Date()) + "\n\n");
        // res.write("data: " + (new Date()) + "\n\n");

        interval = setInterval(function () {
            res.write("data: " + (new Date()) + "\n\n");
        }, 1000);

        // req.connection.addListener("close", function () {
        //     clearInterval(interval);
        // }, false);
    }
}).listen(8844, "127.0.0.1")