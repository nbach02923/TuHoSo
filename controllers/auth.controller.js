require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const authenticate = async (req, res) => {
	try {
		const user = await User.findOne({
			where: {
				UserName: req.body.userName,
				IsLocked: false,
			},
			attributes: ["id", "UserName", "Password", "SecretKey"],
		});
		if (!user || !(await bcrypt.compare(req.body.password, user.Password))) {
			return res.status(400).json({ message: "Not allowed" });
		}
		const accessToken = jwt.sign({ id: user.id, userName: user.UserName }, user.SecretKey, {
			expiresIn: process.env.EXPIRE_TIME,
			algorithm: process.env.ALG,
		});
		return res.json({ accessToken });
	} catch (e) {
		return res.status(500).json({ message: e.message });
	}
};

module.exports = authenticate;
