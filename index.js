const express = require("express");
require('dotenv').config({ path: '.env' })
const { sendScheduleMessage } = require('./crone_jobes/sendScheduleMessage')
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

const CronJob = require('cron').CronJob;
const job = new CronJob('* 1 * * * *', sendScheduleMessage, null, true, 'Europe/Kiev');

const app = express();
mongoose.connect(process.env.MONGODB_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

mongoose.connection.on('connected', () => {
    console.log('DB is connected')
});
mongoose.set('useFindAndModify', false);

job.start();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json());
app.use("/api", require("./api"));

app.listen(4000, () => {
    console.log("server is running on port 4000");
});