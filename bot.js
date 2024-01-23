import { Bot, session } from 'grammy';
import dotenv from 'dotenv';
import { User } from './models/index.js';
import { connectDB, getCoin } from './utils/api.js';
import { myCache } from './utils/cache.js';
import { keyboard } from './utils/keyboard.js';
import { conversations, createConversation } from '@grammyjs/conversations';
import { addCoin } from './utils/functionConversations.js';
import { findUser, registerUser } from './controllers/user.controllers.js';

dotenv.config();

const bot = new Bot(process.env.TOKEN_BOT);

bot.use(
  session({
    initial: () => ({ auth: false, info: null }),
  })
);

bot.use(conversations());
bot.use(createConversation(addCoin));

connectDB()
  .then(() => console.log('connected'))
  .catch((err) => console.log(err));

bot.command('start', async (ctx) => {
  console.log(ctx.session);
  await ctx.reply('Welcome friend! Touch please', {
    reply_markup: keyboard,
  });
});

bot.command('help', (ctx) => ctx.reply('This bot shows crypto_analytic'));
bot.command('save', async (ctx) => {
  const { first_name: name, id } = ctx.msg.chat;
  const response = await registerUser(name, id);
  if (response.success) {
    ctx.reply(`${response.message}`);
  } else {
    ctx.response('Ooops!');
  }
});

bot.hears('List', async (ctx) => {
  const response = await getCoin();
  if (response.message)
    return ctx.reply(`An error occurred, let's try again later`);
  if (myCache.get('coin')) {
    return ctx.reply('The data is up to date!');
  }
  if (myCache.set('coin', response, 3600))
    return ctx.reply('Data received successfully');
});

bot.on('message', async (ctx) => {
  if (ctx.message.text === 'Login') {
    const id = ctx.msg.chat.id.toString();
    const response = await findUser(id);
    if (response.success) {
      ctx.session.auth = true;
      ctx.session.info = id;
      ctx.reply(`${response.message}`);
    } else {
      ctx.reply('User not found!');
    }
  }

  if (ctx.message.text === 'Add coin') {
    await ctx.api.sendMessage(
      ctx.msg.chat.id,
      'Enter the symbolic designation of the coin (for example, ETC, BTC, ADA), the value of the coin at the time of purchase (USD) and the number of coins'
    );
    await ctx.conversation.enter('addCoin');
  }
});

bot.start();
