const express = require("express");
const router = express.Router();
const moment = require('moment')
const Messages = require("./schemas/messages")
const Users = require("./schemas/users")
const { Telegraf } = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)

router.get("/messages", (req, res) => {
    Messages.find({}).then(films => res.send(films))
});

router.post("/messages", (req, res) => {
    Messages.create(req.body)
        .then(message => {
            res.send(message)
        });
});

router.put("/messages/:id", (req, res) => {
    Messages.findByIdAndUpdate({ _id: req.params.id }, req.body)
        .then(() => {
            Messages.findOne({ _id: req.params.id })
                .then(message => {
                    res.send(message);
                });
        });
});

router.delete("/messages/:id", (req, res) => {
    Messages.deleteOne({ _id: req.params.id })
        .then(message => {
            res.send(message)
        });
});

router.get("/users", (req, res) => {
    Users.find({}).then(users => res.send(users))
});

router.post('/latecomer', async (req, res) => {
    const { body } = req;
    const { chat_id } = body
    try {
        const publishedMessages = await Messages.find({ isPublished: true })
        const sortedPublishedMessages = publishedMessages.sort((a, b) => {
            if (moment(a.date, 'YYYY MM DD HH:mm').isAfter(moment(b.date, 'YYYY MM DD HH:mm'))) return 1
            if (moment(b.date, 'YYYY MM DD HH:mm').isAfter(moment(a.date, 'YYYY MM DD HH:mm'))) return -1
            return 0
        })
        for (let index = 0; index < sortedPublishedMessages.length; index++) {
            const message = sortedPublishedMessages[index]
            await bot.telegram.sendMessage(chat_id, message.string, { parse_mode: 'HTML' });
        }
        res.send(sortedPublishedMessages)
    } catch (err) {
        console.error(err)
    }

})

router.post("/users", async (req, res) => {
    const { body } = req
    try {
        const newBody = {
            ...body,
            latecomer: moment(body.authDate, 'YYYY MM DD HH:mm').isAfter(moment(process.env.START_DATE, 'YYYY MM DD HH:mm'))
        }
        const newUser = await Users.findOneAndUpdate({ id: body.id }, newBody, { upsert: true, new: true });
        res.send(newUser)
    } catch (err) {
        console.error(err)
    }

});

module.exports = router;
