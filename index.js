const { Bot, webhookCallback } = require("grammy");
const express = require("express");

require("dotenv").config();

const bot = new Bot(process.env.BOT_TOKEN);

bot.command("start", (ctx) => ctx.reply("Selamat Datang di Bot Hendartea!"));
bot.command("info", (ctx) => ctx.reply("Hai, Saya adalah bot-nya Bapak Mahendar Dwi Payana (hendartea_bot_telegram)"));
bot.command("fitri", (ctx) => ctx.reply("Hai Fitri istri majikan yang paling dicintainya...❤️ ️"))
// bot.on("message", (ctx) => ctx.reply("Got another message!"));
bot.on("message", async (ctx) => {
    // Get the text of the message.
    const text = ctx.msg.text;
    const chatId = ctx.msg.chat.id;
    // console.log(chatId, text);
    // // Send the reply.
    await bot.api.sendMessage(chatId, 'Hai hanya balas pesan anda yaitu : ' + text);
});

if (process.env.NODE_ENV === "production") {
    const app = express();
    app.use(express.json());
    app.use(webhookCallback(bot, "express"));

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Bot listening on port ${PORT}`);
    });
} else {
    bot.start();
}

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));