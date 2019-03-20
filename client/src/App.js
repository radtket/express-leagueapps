import React, { useState, useEffect } from "react";
import moment from "moment";
import Container from "react-bootstrap/Container";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Table from "react-bootstrap/Table";
import "./table.css";
import TeamHeader from "./components/TeamHeader";

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
										<TeamHeader
											primaryColor={primary}
											secondaryColor={secondary}
											textColor={text}
											teamId={teamId}
											teamName={teamName}
										/>

										<Table
											responsive
											className="table table-hover team-schedule team-schedule--full"
										>
											<thead>
												<tr>
													<th>Date</th>
													<th>Opponent</th>
													<th>Time</th>
													<th>Venue</th>
												</tr>
											</thead>
											<tbody>
												{games
													.sort(function(a, b) {
														return (
															moment(a.startTime).format("L") -
															moment(b.startTime).format("L")
														);
													})
													.map(game => {
														const {
															gameId,
															locationName,
															team1,
															team1Id,
															team2,
															team2Id,
															startTime
														} = game;

														console.log(moment(startTime).format("L"));

														return (
															<tr key={gameId}>
																<td>
																	{moment(startTime).format("dddd, MMMM D")}
																</td>
																<td>
																	<span
																		style={{
																			display: "inline",
																			marginRight: 4
																		}}
																	>
																		{team1 === teamName ? "vs" : "@"}
																	</span>
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
