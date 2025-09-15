const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Users Api",
    description: "Users Api",
  },
  host: "localhost:3001",
  schemes: ["http", "https"],
};

const outputFile = "./swagger.json";
const endpointsFile = ["./routes/index.js"];

// this will generate swagger.json
swaggerAutogen(outputFile, endpointsFile, doc);
