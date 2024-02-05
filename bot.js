import { Bot, session } from 'grammy';
import dotenv from 'dotenv';
import * as api from './utils/api.js';
import { myCache } from './utils/cache.js';
import { inlineKeyboard, keyboard } from './utils/keyboard.js';
import { conversations, createConversation } from '@grammyjs/conversations';
import { addCoin, searchCoin } from './utils/functionConversations.js';
import { findUser, registerUser } from './controllers/user.controllers.js';
import db from './db.json' assert { type: 'json' };
import {
  dataFusion,
  formatInfoCoin,
  formatMainData,
  printInfo,
} from './utils/helpFunctions.js';

dotenv.config();

const bot = new Bot(process.env.TOKEN_BOT);

bot.use(
  session({
    initial: () => ({ auth: false, info: null }),
  })
);

bot.use(conversations());
bot.use(createConversation(addCoin));
bot.use(createConversation(searchCoin));

api
  .connect()
  .then(() => console.log('connected'))
  .catch((err) => console.log(err));

bot.command('start', async (ctx) => {
  await ctx.reply('Welcome friend! Touch please', {
    reply_markup: keyboard,
  });
});

bot.command('help', (ctx) =>
  ctx.reply('This bot shows crypto_analytic', { reply_markup: inlineKeyboard })
);
bot.command('save', async (ctx) => {
  const { first_name: name, id } = ctx.msg.chat;
  const response = await registerUser(name, id);
  if (response.success) {
    ctx.reply(`${response.message}`);
  } else {
    ctx.response('Ooops!');
  }
});

bot.callbackQuery('ff', (ctx) => ctx.reply('good'));

bot.hears('📋 List', async (ctx) => {
  if (ctx.session.auth) {
    const response = await formatMainData(db.data);
    const { id } = ctx.msg.chat;
    const { data } = await findUser(id);
    const stack = await dataFusion(response, data);
    const respo = await printInfo(stack, response, ctx);
    return ctx.reply(`${respo}`);
  } else {
    return ctx.reply("You don't auth, bye!", { reply_markup: keyboard });
  }
});

// bot.hears('List', async (ctx) => {
//   const response = await getCoin();
//   if (response.message)
//     return ctx.reply(`An error occurred, let's try again later`);
//   if (myCache.get('coin')) {
//     return ctx.reply('The data is up to date!');
//   }
//   if (myCache.set('coin', response, 3600)) {
//     const { id } = ctx.msg.chat;
//     const { data } = await findUser(id);
//     console.log(data.crypto);
//     data.crypto.forEach((el) => {
//       console.log(myCache.get('coin'));
//     });
//     return ctx.reply('Data received successfully');
//   }
// });

bot.hears('🔐 Login', async (ctx) => {
  const id = ctx.msg.chat.id.toString();
  const response = await findUser(id);
  if (response.success) {
    ctx.session.auth = true;
    ctx.session.info = id;
    ctx.reply(`${response.message}`);
  } else {
    ctx.reply(`${response.message}`);
  }
});

bot.hears('👁 All transaction', async (ctx) => {
  if (ctx.session.auth) {
    const id = ctx.session.info;
    const {
      data: { crypto },
    } = await findUser(id);
    crypto.forEach(async (el) => {
      await ctx.reply(formatInfoCoin(el));
    });
  } else {
    return ctx.reply("You don't auth, bye!", { reply_markup: keyboard });
  }
});

bot.hears('🔍 Search coin', async (ctx) => {
  if (ctx.session.auth) {
    await ctx.conversation.enter('searchCoin');
  } else {
    return ctx.reply("You don't auth, bye!", { reply_markup: keyboard });
  }
});

bot.hears('🆗 Add coin', async (ctx) => {
  await ctx.api.sendMessage(
    ctx.msg.chat.id,
    'Enter the symbolic designation of the coin (for example, ETC, BTC, ADA), the value of the coin at the time of purchase (USD) and the number of coins'
  );
  await ctx.conversation.enter('addCoin');
});

bot.start();
