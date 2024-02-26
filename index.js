const { Bot, webhookCallback } = require("grammy");
const express = require("express");

require("dotenv").config();

const bot = new Bot(process.env.BOT_TOKEN);

const dataDoa = async () => {
    const response = await fetch("https://doa-doa-api-ahmadramadhan.fly.dev/api");
    const data = await response.json();
    return data;
}

// dataDoa().then((data) => {
//     const random = Math.floor(Math.random() * data.length);
//     console.log({ id: data[random].id, doa: data[random].doa, ayat: data[random].ayat, latih: data[random].latihan, artinya: data[random].artinya });
// })

bot.command("doa", async (ctx) => {
    try {
        const data = await dataDoa();
        const randomIndex = Math.floor(Math.random() * data.length);
        const randomDoa = data[randomIndex].doa;
        const randomAyat = data[randomIndex].ayat;
        const randomArtinya = data[randomIndex].artinya;
        const randomLatin = data[randomIndex].latin;

        await ctx.reply("Hai, ini doa : " + randomDoa + "\n" + "Ayat : " + randomAyat + "\n" + "Artinya : " + randomArtinya + "\n" + "Latin : " + randomLatin);
    } catch (error) {
        console.error("Error fetching doa data:", error);
        await ctx.reply("Maaf, terjadi kesalahan saat mengambil data doa.");
    }
})

bot.command("start", (ctx) => ctx.reply("Selamat Datang di Bot Hendartea!"));
bot.command("info", (ctx) => ctx.reply("Hai, Saya adalah bot-nya Bapak Mahendar Dwi Payana (hendartea_bot_telegram)"));
bot.command("fitri", (ctx) => ctx.reply("Hai Fitri istri majikan yang paling dicintainya...❤️ ️"))
bot.on("message", async (ctx) => {
    const text = ctx.msg.text;
    const chatId = ctx.msg.chat.id;
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
