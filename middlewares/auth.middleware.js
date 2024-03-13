const jwt = require("jsonwebtoken");
const { User } = require("../models");
const http = require("http");

const verifyToken = async (req, res, next) => {
	const destination = {
		hostname: "103.130.212.35",
		port: "2369",
		path: "/SmartEOSAPI/QuanTri/GetCurrentUser",
		method: "GET",
		headers: req.headers,
	};
	const request = http.request(destination, (response) => {
		let data = "";
		response.on("data", (chunk) => {
			data += chunk;
		});
		response.on("end", () => {
			const responseData = JSON.parse(data);
			if (responseData.sError) {
				return res.status(401).json(responseData);
			}
			req.user = responseData
			next();
		});
	});
	request.on("error", (e) => {
		return res.status(500).json({ message: e.message });
	});
	request.end();
};

module.exports = verifyToken;
