const { QueryTypes } = require("sequelize");
const { AspNetUsers, sequelize } = require("../models");
const checkRole = async (idUser, actionCode, limit) => {
	const admin = await AspNetUsers.findOne({ where: { Id: idUser, UserName: "admin" } });
	if (admin) {
		return true;
	} else {
		const userRoleQuery = await sequelize.query(
			`
			SELECT r."Id" as idRole, u."Id" as idUser
			FROM "RoleQuyens" r
			INNER JOIN "Link_User_RoleQuyen" lur ON lur."idRoleQuyen" = r."Id"
			INNER JOIN "AspNetUsers" u ON lur."idUser" = u."Id"
			WHERE u.id = :idUser
			`,
			{ replacements: { idUser }, type: QueryTypes.SELECT }
		);
		const groupUserRoleQuery = await sequelize.query(
			`
			SELECT r."Id" as idRole, u."Id" as idUser
			FROM "RoleQuyens" r
			INNER JOIN "Link_GroupUser_RoleQuyen" lgr ON lgr."idRoleQuyen" = r."Id"
			INNER JOIN "GroupUsers" g ON lgr."idGroupUser" = g."Id"
			INNER JOIN "Link_User_GroupUser" lug ON lug."idGroupUser" = g."Id"
			INNER JOIN "AspNetUsers" u ON lug."idUser" = u."Id"
			WHERE u.id = :idUser
			`,
			{ replacements: { idUser }, type: QueryTypes.SELECT }
		);
		const union = Array.from(
			new Set(userRoleQuery.map((item) => item.idRole).concat(groupUserRoleQuery.map((item) => item.idRole)))
		);
		const idRole = [...new Set(union.map((item) => item.idRole))];
		const roleRightActionQuery = await sequelize.query(
			`
			SELECT rr."idRight", a."Ma" AS "MaAction"
			FROM "Link_RightAction_RoleQuyen" rr
			INNER JOIN "DanhMucActions" a ON rr."idAction" = a."Id"
			INNER JOIN "DanhMucRights" r ON rr."idRight" = r."Id"
			WHERE rr."idRoleQuyen" IN (:idRole) AND rr."GioiHan" = :limit AND a."Ma" = :actionCode
			`,
			{
				replacements: {
					idRole,
					limit: limit,
					actionCode: actionCode,
				},
				type: QueryTypes.SELECT,
			}
		);
		const check = roleRightActionQuery.length > 0;
		if (check) {
			return true;
		} else {
			const tableName = sequelize.query(
				`
				SELECT table_name
				FROM information_schema.tables
				`,
				{ type: QueryTypes.SELECT }
			);
			if (actionCode === "QUANLYCONGVANDEN") {
				const listQuyenCongVanDen = await sequelize.query(
					`
					SELECT COUNT(*) as count
					FROM "Link_DanhSachDuAn_User" llu
					WHERE llu."idUser" = :idUser AND :tableName::text[] @> ARRAY[llu."TableDuAn"] AND llu."ViTriTrongDuAn" == "CongVanDen"
					`,
					{
						replacements: {
							idUser,
							tableName,
						},
					}
				);
				if (listQuyenCongVanDen > 0) return true;
				return false;
			} else if (actionCode === "QUANLYCONGVANDI") {
				const listQuyenCongVanDi = await sequelize.query(
					`
					SELECT COUNT(*) as count
					FROM "Link_DanhSachDuAn_Users" llu
					WHERE llu."idUser" = :idUser AND :tableName::text[] @> ARRAY[llu."TableDuAn"] AND llu."ViTriTrongDuAn" == "CongVanDi"
					`,
					{
						replacements: {
							idUser,
							tableName,
						},
					}
				);
				if (listQuyenCongVanDi > 0) return true;
				return false;
			}
			return false;
		}
	}
};

module.exports = checkRole;
