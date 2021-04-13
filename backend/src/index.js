const express = require("express");
const { uuid } = require("uuidv4");

const PORT = 3333;

const app = express();
app.use(express.json());

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
