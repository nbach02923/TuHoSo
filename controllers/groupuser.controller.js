const { GroupShareTuHoSoes, Link_GroupShareTuHoSo_User, AspNetUsers, Link_FolderTuHoSo_Group } = require("../models");
const { Op, Sequelize } = require("sequelize");

const getGroupUser = async (req, res) => {
	try {
		const groups = await GroupShareTuHoSoes.findAll({
			order: [["Ten", "ASC"]],
		});
		const links = await Link_GroupShareTuHoSo_User.findAll();
		const users = await AspNetUsers.findAll();
		const sharedFolderDetails = await Link_FolderTuHoSo_Group.findAll({
			attributes: [
				"idGroupShareTuHoSo",
				"idFolderTuHoSo",
				[Sequelize.fn("MAX", Sequelize.col("MaQuyen")), "MaQuyen"],
			],
			group: ["idGroupShareTuHoSo", "idFolderTuHoSo"],
		});
		const result = groups.map((group) => {
			const groupSharedFolderDetails = sharedFolderDetails.filter((sf) => sf.idGroupShareTuHoSo === group.Id);
			const groupUsers = links
				.filter((link) => link.idGroupUser === group.Id)
				.map((link) => {
					const user = users.find((u) => u.Id === link.isUser);
					if (!user) return null;
					const userSharedFolderDetails = groupSharedFolderDetails.filter(
						(sf) => sf.idGroupShareTuHoSo === group.Id
					);
					const sharedTo = userSharedFolderDetails
						.map((sf) => `${sf.idFolderTuHoSo};${sf.MaQuyen || ""}`)
						.join(";");
					return { ...user.toJSON(), SharedTo: sharedTo || "" };
				})
				.filter((user) => user !== null);
			return { ...group.toJSON(), Users: groupUsers };
		});
		return res.status(200).json({ Detail: "Get group users successfully", Error: 7, Value: result });
	} catch (e) {
		return res.status(500).json({ Detail: e.message, Error: 9, sError: "LoiServer", Value: null });
	}
};

module.exports = {
	getGroupUser,
};
