import React, { useState, useEffect } from "react";
import moment from "moment";
import Container from "react-bootstrap/Container";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Table from "react-bootstrap/Table";
import "./table.css";
import { css, cx } from "emotion";
const color = "white";

const TeamColors = {
	"2210410": {
		primary: "#00BEFE",
		secondary: "#000000",
		text: "#FFFFFF"
	},
	"2210413": {
		primary: "#FF9900",
		secondary: "#7ABA05",
		text: "#000000"
	},
	"2210416": {
		primary: "#D12631",
		secondary: "#FFFFFF",
		text: "#1E1B1B"
	},
	"2210419": {
		primary: "#8DBE23",
		secondary: "#231F20",
		text: "#FFFFFF"
	},
	"2210422": {
		primary: "#9EC803",
		secondary: "#35A701",
		text: "#0C2103"
	},
	"2210425": {
		primary: "#B81A2C",
		secondary: "#FFBD00",
		text: "#000000"
	}
};

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

	return (
		<Container>
			<div className="card">
				<Tabs defaultActiveKey={firstTeam && firstTeam.id}>
					{schedule &&
						Object.entries(schedule)
							.sort()
							.map((team, i) => {
								const { name: teamName, id: teamId, games } = team[1];
								const { primary, secondary, text } = TeamColors[teamId];
								return (
									<Tab eventKey={teamId} title={teamName} key={teamId}>
										<header
											className={css`
												background-color: ${primary};
												background: linear-gradient(
															to bottom,
															${primary} 0%,
															${primary} 38%,
															transparent 100%
														)
														no-repeat,
													${secondary};
												position: relative;
												display: flex;
												align-items: center;
												justify-content: center;
												text-align: center;
												padding: 3rem 0px;
												color: ${text};
												&::after {
													content: "";
													background: url("/img/logos/${teamId}.png") center
														center/100% no-repeat;
													opacity: 0.2;
													top: 0;
													left: 0;
													bottom: 0;
													right: 0;
													position: absolute;
													z-index: 0;
												}
												>* {
													z-index: 2;
												}
												img {
													height: 150px;
												}
											`}
										>
											<div className="container">
												<img
													src={`/img/logos/${teamId}.png`}
													alt={`${teamName} Logo`}
												/>
												<h1>{teamName}</h1>
												<h1 class="page-heading__title">
													Team <span class="highlight">Schedule</span>
												</h1>
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
