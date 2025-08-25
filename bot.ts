import "dotenv/config";
import express from "express";
import { Telegraf, Context } from "telegraf";

const BOT_TOKEN = process.env.BOT_TOKEN as string;
const WEBAPP_URL = process.env.WEBAPP_URL as string;

if (!BOT_TOKEN || !WEBAPP_URL) {
  throw new Error("BOT_TOKEN and WEBAPP_URL must be set in env");
}

const bot = new Telegraf<Context>(BOT_TOKEN);

// Start command: send a button to open mini app
// bot.start((ctx) =>
//   ctx.reply("Open the mini app:", {
//     reply_markup: {
//       inline_keyboard: [[{ text: "Open Mini App", web_app: { url: WEBAPP_URL } }]],
//     },
//   })
// );

// Receive data sent via WebApp
bot.on("message", (ctx) => {
  const data = (ctx.message as any)?.web_app_data?.data;
  if (data) {
    console.log('%cbot.ts:27 data', 'color: #007acc;', data);
    const parsed = JSON.parse(data);
    const note = parsed.note;
    ctx.reply(`Received your note: ${note}`);
  }
});

bot.launch();

// Optional: serve web app from ./public
const app = express();
app.use(express.static("public"));
app.listen(3000, () => console.log("Web server running on http://localhost:3000"));
