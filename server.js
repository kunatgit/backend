const http = require("http");
const port = process.env.port || 3001;


const app = require("./app");


// const server = http.createServer(app);
app.listen(port);
console.log("");
console.log("-------- Server Online ---------");
console.log("Server started on port : ", port);
console.log("--------------------------------");
console.log("");
