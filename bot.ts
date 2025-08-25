import { Telegraf, Context } from "telegraf";
import express from "express";

const BOT_TOKEN = process.env.BOT_TOKEN as string;
const WEBAPP_URL = process.env.WEBAPP_URL as string;

if (!BOT_TOKEN || !WEBAPP_URL) {
  throw new Error("BOT_TOKEN and WEBAPP_URL must be set in env");
}

const bot = new Telegraf<Context>(BOT_TOKEN);

// Send "Open App" button
bot.start((ctx) =>
  ctx.reply("Open the mini app:", {
    reply_markup: {
      inline_keyboard: [[{ text: "Open", web_app: { url: WEBAPP_URL } }]],
    },
  })
);

// Handle data sent from WebApp (tg.sendData)
bot.on("message", (ctx) => {
  const data = (ctx.message as any)?.web_app_data?.data;
  if (data) {
    ctx.reply(`Received: ${data}`);
  }
});

bot.launch();

// Optional: serve index.html from ./public
const app = express();
app.use(express.static("public"));
app.listen(3000, () => console.log("Web server running on http://localhost:3000"));
