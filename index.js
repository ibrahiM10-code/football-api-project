import bodyParser from "body-parser";
import express from "express";
import morgan from "morgan";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config({path: "./.env"});

const app = express();
const apiUrl = "https://api-football-v1.p.rapidapi.com";


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(morgan("dev"));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/findFixture", async (req, res) => {
    const teamId = req.body.teamInput;
    const config = {
        params: {
            "team": teamId,
            "next": 1
        },
        headers: {
            "X-RapidApi-Key": process.env.APIKEY,
            "X-RapidApi-Host": process.env.APIHOST
        }
    };

    try {
        const result = await axios.get(`${apiUrl}/v3/fixtures`, config);
        const {teams: {home, away}, fixture, league} = result.data.response[0];
        console.log("Match data displayed correctly!");
        res.render("gameDay.ejs", {
            homeTeam: home,
            awayTeam: away,
            fixture: fixture,
            league: league
        });

    } catch (error) {
        console.error(error.message);
    }

});

app.listen(3000, () => {
    console.log("Server started at port 3000.");
});