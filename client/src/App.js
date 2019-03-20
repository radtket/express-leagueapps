import React, { useState, useEffect } from "react";
import moment from "moment";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Table from "react-bootstrap/Table";
import "./table.css";

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
			<div className="card">
				<Tabs defaultActiveKey={firstTeam && firstTeam.id}>
					{schedule &&
						Object.entries(schedule)
							.sort()
							.map((team, i) => {
								const { name: teamName, id: teamId, games } = team[1];
								return (
									<Tab eventKey={teamId} title={teamName} key={teamId}>
										<header className="team-header">
											<div className="container">
												<img
													src={`/img/logos/${teamId}.png`}
													alt={`${teamName} Logo`}
												/>
												<h1>{teamName}</h1>
											</div>
										</header>
										<Table
											responsive
											className="table table-hover team-schedule team-schedule--full"
										>
											<thead>
												<tr>
													<th>Date</th>
													<th>Versus</th>
													<th>Status</th>
													<th>Time</th>
													<th>Venue</th>
												</tr>
											</thead>
											<tbody>
												{games.map(game => {
													const {
														gameId,
														locationName,
														locationId,
														stateLabel,
														team1,
														team1Id,
														team2,
														team2Id,
														startTime
													} = game;
													return (
														<tr key={gameId}>
															<td>{moment(startTime).format("dddd, MMM D")}</td>
															<td>
																<div className="team-meta">
																	<figure className="team-meta__logo">
																		<img
																			src={`/img/logos/${
																				team1Id === teamId ? team2Id : team1Id
																			}.png`}
																			alt={`${teamName} Logo`}
																		/>
																	</figure>
																	<div className="team-meta__info">
																		<h6 className="team-meta__name">
																			{team1 === teamName ? team2 : team1}
																		</h6>
																	</div>
																</div>
															</td>
															<td>{team1Id === teamId ? "Home" : "Away"}</td>
															<td>
																{`${moment(startTime).format("hh:mm A")} EST`}
															</td>
															<td>{locationName}</td>
														</tr>
													);
												})}
											</tbody>
										</Table>
									</Tab>
								);
							})}
				</Tabs>
			</div>
		</Container>
	);
};

export default App;
