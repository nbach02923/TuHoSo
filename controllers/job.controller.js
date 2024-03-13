const { ChucVus } = require("../models");

const getJobTitle = async (req, res) => {
	try {
		const jobTitle = req.query.id ? await ChucVus.findByPk(req.query.id) : await ChucVus.findAll();
		if (!jobTitle) {
			return res.status(404).json({ message: "Job title not found" });
		}
		return res.json(jobTitle);
	} catch (e) {
		return res.status(500).json({ message: e.message });
	}
};
const createJobTitle = async (req, res) => {
	try {
		const jobTitle = await JobTitle.findByPk(req.query.id);
		if (!jobTitle) {
			return res.status(404).json({ message: "Job title not found" });
		}
		await JobTitle.create({
			Name: req.body.name,
			JobCode: req.body.jobCode,
		});
		return res.status(201).json({ message: "Job title created successfully" });
	} catch (e) {
		return res.status(500).json({ message: e.message });
	}
};
const updateJobTitle = async (req, res) => {
	try {
		const jobTitle = await JobTitle.findByPk(req.query.id);
		if (!jobTitle) {
			return res.status(404).json({ message: "Job title not found" });
		}
		await jobTitle.update({
			Name: req.body.name,
			JobCode: req.body.jobCode,
		});
		return res.status(200).json({ message: "Job title updated successfully" });
	} catch (e) {}
};
const deleteJobTitle = async (req, res) => {
	try {
		const jobTitle = await JobTitle.findByPk(req.query.id);
		if (!jobTitle) {
			return res.status(404).json({ message: "Job title not found" });
		}
		await jobTitle.destroy();
		return res.status(200).json({ message: "Job title deleted successfully" });
	} catch (e) {
		return res.status(500).json({ message: e.message });
	}
};

module.exports = {
	getJobTitle,
};
