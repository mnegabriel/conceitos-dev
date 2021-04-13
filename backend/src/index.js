const express = require("express");
const { uuid, isUuid } = require("uuidv4");

const PORT = 3333;

const app = express();

app.use(express.json());

function logRequest(req, res, next) {
	const { method, url } = req;

	const logLabel = `[${method.toUpperCase()}]: ${url}`;
	console.log(logLabel);

	return next();
}

function validateProjectID(req, res, next) {
	const { id } = req.params;

	if (!isUuid(id)) {
		return res.status(400).json({ error: "Invalid project ID." });
	}

	return next();
}

app.use(logRequest);
app.use("/projects/:id", validateProjectID);

const projects = [];

app.get("/projects", (req, res) => {
	const { title } = req.query;

	const results = title
		? projects.filter((project) => project.title.includes(title))
		: projects;

	res.json(results);
});

app.post("/projects", (req, res) => {
	const { title, author } = req.body;

	const newProject = {
		id: uuid(),
		title,
		author,
	};

	projects.push(newProject);

	return res.json(newProject);
});

app.put("/projects/:id", (req, res) => {
	const { title, author } = req.body;
	const { id } = req.params;

	const selectedProject = projects.find((project) => project.id === id);

	if (selectedProject === undefined) {
		return res.status(400).json({ error: "Project not Found" });
	}

	if (title) selectedProject.title = title;
	if (author) selectedProject.author = author;

	projects.map((project) => {
		if (project.id === id) {
			return selectedProject;
		}
		return project;
	});

	return res.json(selectedProject);
});

app.delete("/projects/:id", (req, res) => {
	const { id } = req.params;

	const projectIndex = projects.findIndex((project) => project.id === id);

	if (projectIndex < 0) {
		return res.status(400).json({ error: "Project not Found" });
	}

	projects.splice(projectIndex, 1);

	return res.status(204).send();
});

app.listen(PORT, () => console.log(`🎉 Backend started on port ${PORT}`));
