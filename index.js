const express = require("express");
const path = require("path");
const axios = require("axios");

const app = express();

const apiKey = "a92be92ac86c78982837e6545f42b26a";

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

// An api endpoint that returns a list of teams
app.get("/api/teams", (req, res) => {
	axios
		.get(
			`https://api.leagueapps.com/v1/sites/6970/programs/1039720/teams?la-api-key=${apiKey}`
		)
		.then(response => res.send(response.data));
});

// An api endpoint that returns a list of teams
app.get("/api/schedule", (req, res) => {
	axios
		.get(
			`https://api.leagueapps.com/v1/sites/6970/programs/1039720/schedule?la-api-key=${apiKey}`
		)
		.then(response => res.send(response.data.games));
});

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
	res.sendFile(path.join(`${__dirname}/client/build/index.html`));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`App is listening on port ${port}`);
