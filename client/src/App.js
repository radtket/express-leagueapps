import React, { useState, useEffect } from "react";
import slugify from "slugify";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

const App = () => {
	const [schedule, setSchedule] = useState([]);

	const getSchedule = async () => {
		const res = await fetch("/api/schedule");
		const data = await res.json();
		const teamGames = await data.reduce((teams, team) => {
			const { team1, team2, team1Id, team2Id } = team;
			teams[team1] = teams[team1] || {
				name: team1,
				id: team1Id,
				games: []
			};
			teams[team2] = teams[team2] || {
				name: team2,
				id: team2Id,
				games: []
			};
			teams[team1].games.push(team);
			teams[team2].games.push(team);
			// console.log(team);
			return teams;
		}, {});

		setSchedule(teamGames);
	};

	useEffect(() => {
		getSchedule();
	}, []);

	const firstTeam = Object.values(schedule)[0];

	console.log(schedule);

	return (
		<Container>
			<Tabs defaultActiveKey={firstTeam && firstTeam.id}>
				{schedule &&
					Object.entries(schedule)
						.sort()
						.map((team, i) => {
							const { name: teamName, id: teamId } = team[1];
							return (
								<Tab eventKey={teamId} title={teamName} key={teamId}>
									<h1>{teamName}</h1>
								</Tab>
							);
						})}
			</Tabs>
		</Container>
	);
};

export default App;
