const Messages = require("../schemas/messages")
const Users = require("../schemas/users")
const moment = require('moment')
require('dotenv').config({ path: '.env' })
const { Telegraf } = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)

exports.sendScheduleMessage = async () => {
    const unpublishedMessages = await Messages.find({ isPublished: false })
    if (!unpublishedMessages.length) return
    const today = moment()
    const messagesWithPreviousDate = unpublishedMessages.filter(message => {
        if (today.isAfter(moment(message.date, 'YYYY MM DD HH:mm'))) {
            return true
        } else {
            return false
        }
    })
    const users = await Users.find({ status: 'ACTIVE' })
    await Promise.all(users.map(user => {
        return messagesWithPreviousDate.map(message => {
            return bot.telegram.sendMessage(user.id, message.string,{parse_mode:'HTML'});
        })
    }).flat()
    )
    await Promise.all(messagesWithPreviousDate.map(message => {
        const {_id} = message;
        return Messages.findByIdAndUpdate({ _id }, { isPublished: true })
    }))
}