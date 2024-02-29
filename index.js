const { Bot, webhookCallback } = require("grammy");
const express = require("express");
const axios = require("axios");

require("dotenv").config();

const bot = new Bot(process.env.BOT_TOKEN);

const dataDoa = async () => {
    const response = await fetch("https://doa-doa-api-ahmadramadhan.fly.dev/api");
    const data = await response.json();
    return data;
}


bot.command("doa", async (ctx) => {
    try {
        const data = await dataDoa();
        const randomIndex = Math.floor(Math.random() * data.length);
        const randomDoa = data[randomIndex].doa;
        const randomAyat = data[randomIndex].ayat;
        const randomArtinya = data[randomIndex].artinya;
        const randomLatin = data[randomIndex].latin;

        const replyMessage = `Doa : ${randomDoa}\nAyat : ${randomAyat}\nArtinya : ${randomArtinya}\nLatin : ${randomLatin}`;

        await ctx.reply(replyMessage);
    } catch (error) {
        console.error("Error fetching doa data:", error);
        await ctx.reply("Maaf, terjadi kesalahan saat mengambil data doa.");
    }
})

bot.command("start", (ctx) => ctx.reply(`
        Selamat datang di bot hendartea_bot. Jalankan perintah ini di Telegram. \n
        /doa : untuk melihat Doa harian \n
        /info : untuk melihat info \n
`));
bot.command("info", (ctx) => ctx.reply("Hai, Saya adalah bot-nya Bapak Mahendar Dwi Payana (hendartea_bot_telegram)"));
bot.command("fitri", (ctx) => ctx.reply("Hai Fitri istri majikan yang paling dicintainya...❤️ ️"))

// from rapitapi.com filepursuit
bot.command("buku", async (ctx) => {
    try {
        const query = ctx.message.text.split(" ").slice(1).join(" "); // Mengambil argumen setelah perintah '/buku'

        // Membuat opsi dengan query yang diberikan pengguna
        const options = {
            method: 'GET',
            url: 'https://filepursuit.p.rapidapi.com/',
            params: {
                q: query, // Menggunakan nilai query dari pengguna
                filetype: 'pdf',
                type: 'ebook',
                sort: 'asc',
                start: '5'
            },
            headers: {
                'X-RapidAPI-Key': process.env.RAPIT_API,
                'X-RapidAPI-Host': process.env.RAPIT_HOST
            }
        };

        const response = await axios.request(options);
        const books = response.data;

        if (books.status === "success" && books.files_found.length > 0) {
            // Mengambil satu buku secara acak dari daftar buku yang ditemukan
            const randomIndexBooks = Math.floor(Math.random() * books.files_found.length);
            const randomBook = books.files_found[randomIndexBooks];

            await ctx.reply(`Nama file: ${randomBook.file_name}\nLink: ${randomBook.file_link}`);
            console.log(books);
        } else {
            await ctx.reply("Maaf, tidak ada buku yang ditemukan dengan kata kunci tersebut.");
        }
    } catch (error) {
        console.error("Error fetching book data:", error);
        await ctx.reply("Maaf, terjadi kesalahan saat mengambil data buku.");
    }
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
