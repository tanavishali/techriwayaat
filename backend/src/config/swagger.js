const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Contact Form API",
      version: "1.0.0",
      description: "API for submitting contact form messages",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}/api`,
        description: "Local server",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
