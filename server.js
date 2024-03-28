const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const router = require("./routes/route.js");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const app = express();

app.use(helmet());

const corsOptions = {
	origin: "*",
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	optionsSuccessStatus: 200,
	allowedHeaders: "*",
	credentials: true,
	maxAge: 86400,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);

const port = process.env.PORT || 3132;
const host = process.env.HOST || "localhost";
app.listen(port, host, () => {
	try {
		console.log(`App is using environment \x1b[33m${process.env.NODE_ENV}\x1b[0m`);
		console.log(`App successfully started on \x1b[36mhttp://${host}:${port}\x1b[0m`);
	} catch (e) {
		console.error(`\x1b[41mApp failed to start: ${e.message}\x1b[0m`);
		process.exit(1);
	}
});
