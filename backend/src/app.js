const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");

const routes = require("./routes");
const swaggerSpec = require("./config/swagger");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(helmet());
app.use(morgan("dev"));
const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header (Postman, curl, etc.)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        /^https:\/\/techriwayaat.*\.vercel\.app$/.test(origin)
      ) {
        return callback(null, true);
      }

      console.log("Blocked Origin:", origin);
      return callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
