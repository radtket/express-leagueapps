import React, { useEffect, useState } from "react";
import axios from "axios";
import { get, isEmpty, keyBy } from "lodash";
import moment from "moment";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Table from "react-bootstrap/Table";
import "./table.css";
import TeamHeader from "./components/TeamHeader";

function App() {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    axios("/hello")
      .then(({ data }) => {
        const teams = keyBy(data.teams, "teamId");

        return Object.values(
          data.games.reduce((all, games) => {
            const { team1, team2, team1Id, team2Id } = games;
            return {
              ...all,
              [team1]: {
                name: team1,
                id: team1Id,
                games: [...get(all, [team1, "games"], []), games],
                ...teams[team1Id],
              },
              [team2]: {
                name: team2,
                id: team2Id,
                games: [...get(all, [team2, "games"], []), games],
                ...teams[team2Id],
              },
            };
          }, {})
        ).sort();
      })
      .then((stuff) => {
        setSchedule(stuff);
      });
  }, []);

  if (isEmpty(schedule)) {
    return (
      <div
        style={{
          alignItems: "center",
          display: "flex",
          height: "100vh",
          justifyContent: "center",
        }}>
        <Spinner animation="grow" />
      </div>
    );
  }

  return (
    <Container>
      <div className="card">
        <Tabs defaultActiveKey={schedule[0].id}>
          {schedule &&
            Object.entries(schedule)
              .sort()
              .map((team) => {
                const { name: teamName, id: teamId, games } = team[1];

                return (
                  <Tab key={teamId} eventKey={teamId} title={teamName}>
                    <TeamHeader teamId={teamId} teamName={teamName} />
                    <Table
                      className="table table-hover team-schedule team-schedule--full"
                      responsive>
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
                          .sort(
                            (a, b) =>
                              moment(a.startTime).format("L") -
                              moment(b.startTime).format("L")
                          )
                          .map(
                            ({
                              gameId,
                              locationName,
                              team1,
                              team1Id,
                              team2,
                              team2Id,
                              startTime,
                            }) => (
                              <tr key={gameId}>
                                <td>
                                  {moment(startTime).format("dddd, MMMM D")}
                                </td>
                                <td>
                                  <span
                                    style={{
                                      display: "inline",
                                      marginRight: 4,
                                    }}>
                                    {team1 === teamName ? "vs" : "@"}
                                  </span>
                                  <div className="team-meta">
                                    <figure className="team-meta__logo">
                                      <img
                                        alt={`${teamName} Logo`}
                                        src={`/img/logos/${
                                          team1Id === teamId ? team2Id : team1Id
                                        }.png`}
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
                            )
                          )}
                      </tbody>
                    </Table>
                  </Tab>
                );
              })}
        </Tabs>
      </div>
    </Container>
  );
}

export default App;
