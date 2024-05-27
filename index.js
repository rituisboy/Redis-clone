const net = require("net");
const readline = require("readline");


const store = {};
const server = net.createServer((connection) => {
  connection.write("\x1b[33mredis-cli > \r\x1b[0m");
  connection.write("\x1b[12C"); // Move cursor

  const rl = readline.createInterface({
    input: connection,
    output: connection,
    terminal: false,
  });
  rl.on("line", (line) => {
    connection.write(handleCommand(line) + "\r\n");
    connection.write("\x1b[33mredis-cli > \r\x1b[0m");
    connection.write("\x1b[12C");
  });
});

const handleCommand = (res) => {
  res = res.replace("\r\n", "");
  res = handleBackSpace(res);
  res = res.split(" ");

  const command = res[0];
  switch (command) {
    case "set": {
      store[res[1]] = res[2];
      return "\x1b[32mOK \x1b[0m";
    }
    case "get": {
      return `\x1b[34m${store[res[1]]}\x1b[0m`;
    }
    default: {
      return "\x1b[31mInvalid command\x1b[0m";
    }
  }
};

const handleBackSpace = (s) => {
  let result = [];
  for (let i of s) {
    if (i == "\b") {
      if (result) result.pop();
    } else {
      result.push(i);
    }
  }
  return result.join("");
};

server.listen(8080, () => {
  console.log("server is listening");
});
