import express from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
const port = process.env.PORT;
const app = express();
app.use(express.json());

//mock users in database
const DATABASE_USERS = [
	{
		username: "admin",
		password: "admin123",
	},
	{
		username: "user",
		password: "user123",
	},
];

//mock data to access
const DATABASE_DATA = [
	{ id: 1, content: "secret 1" },
	{ id: 2, content: "secret 2" },
];
//Mock function to check if login is valid
function checkPassword(username, password) {
	for (const user of DATABASE_USERS) {
		if (user.username == username && user.password == password) {
			return true;
		}
	}
	return false;
}

app.get("/data", (req, res) => {
	const token = req.headers.authorization.split(" ")[1];
	try {
		const payload = jwt.verify(token, process.env.SECRET_TOKEN);
		res.json(DATABASE_DATA);
	} catch (error) {
		res.status(401).json({ error: "Invalid token" });
	}
});

app.post("/login", (req, res) => {
	const { username, password } = req.body;
	if (checkPassword(username, password)) {
		const token = jwt.sign({ username }, process.env.SECRET_TOKEN);
		res.json({ token });
	} else {
		res.status(401).json({ error: "Wrong username or password" });
	}
});

app.listen(port, () => {
	console.log("server started at port: ", port);
});
