const http = require("http");
const Todo = require("./controller");
const PORT = process.env.PORT || 5000;

const server = http.createServer(async (req, res) => {
  //set the request route
  if (req.url === "/api" && req.method === "GET") {
    const todos = await new Todo().getTodos();
    // set the status code, and content-type
    res.writeHead(200, { "Content-Type": "application/json" });
    // send the data
    res.end(JSON.stringify(todos));
  }

  // If no route present
  else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

server.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`);
});
