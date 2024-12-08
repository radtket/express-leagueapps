import express from "express";
import ViteExpress from "vite-express";
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.leagueapps.com/v1/sites/6970/programs/1039720",
  params: {
    "la-api-key": "a92be92ac86c78982837e6545f42b26a",
  },
});

const app = express();

app.get("/express-leagueapps/hello", async (req, res) => {
  const woo = await Promise.all([api.get("/schedule"), api.get("/teams")]).then(
    ([
      {
        data: { games },
      },
      { data: teams },
    ]) => ({
      games,
      teams,
    })
  );

  res.send(woo);
});
ViteExpress.config({ mode: "production" });

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);
