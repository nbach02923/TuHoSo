const { default: axios } = require("axios");

const verifyToken = async (req, res, next) => {
	const response = await axios.get("http://103.130.212.35:2369/SmartEOSAPI/QuanTri/GetCurrentUser", {
		headers: {
			Authorization: req.headers.authorization
		},
	});
	if (!response.data.Id) {
		return res.status(401).json(response.data);
	}
	req.user = response.data;
	next();
};

module.exports = verifyToken;
