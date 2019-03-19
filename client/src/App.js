import React from "react";

const App = () => {
	fetch("/api/teams")
		.then(res => res.json())
		.then(teams => console.log(teams));
	return (
		<div>
			<h1>leagueapps</h1>
		</div>
	);
};

export default App;
