//Load HTTP module
const http = require("http");
const fs = require("fs");
const path = require("path");
const hostname = "0.0.0.0";
const port = 8080;

//Create HTTP server and listen on port 3000 for requests
const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, req.url === "/" ? "./src/index.html" : req.url);

    let contentType = "";

    // Determine the content type based on the file extension
    switch (path.extname(filePath)) {
        case ".html":
            contentType = "text/html";
            break;
        case ".css":
            contentType = "text/css";
            break;
        case ".js":
            contentType = "text/javascript";
            break;
        default:
            contentType = "application/octet-stream";
    }

    fs.readFile(filePath, "utf8", (err, content) => {
        if (err) {
            if (err.code === "ENOENT") {
                // File not found
                res.statusCode = 404;
                res.end("File not found");
            } else {
                // Server error
                res.statusCode = 500;
                res.end("Server error");
            }
        } else {
            res.statusCode = 200;
            res.setHeader("Content-Type", contentType);
            res.end(content);
        }
    });
});

//listen for request on port 3000, and as a callback function have the port listened on logged
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
