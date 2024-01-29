import { Bot, session } from 'grammy';
import dotenv from 'dotenv';
import { connectDB, getCoin } from './utils/api.js';
import { myCache } from './utils/cache.js';
import { keyboard } from './utils/keyboard.js';
import { conversations, createConversation } from '@grammyjs/conversations';
import { addCoin } from './utils/functionConversations.js';
import { findUser, registerUser } from './controllers/user.controllers.js';
import db from './db.json' assert { type: 'json' };
import { formatData } from './utils/helpFunctions.js';

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
  if (ctx.session.auth) {
    const response = await formatData(db.data);
    const stack = {};
    const { id } = ctx.msg.chat;
    const { data } = await findUser(id);
    data.crypto.forEach((el) => {
      if (response[el.name]) {
        if (stack.hasOwnProperty(el.name)) {
          stack[el.name] = {
            price:
              Number(stack[el.name].price) +
              Number(el.price) * Number(el.number),
            number: stack[el.name].number + Number(el.number),
          };
        } else {
          stack[el.name] = {
            price: Number(el.price) * Number(el.number),
            number: Number(el.number),
          };
        }
      } else {
        stack[el.name] = `This coin not found`;
      }
    });

    for (let [key, value] of Object.entries(stack)) {
      const price = response[key]?.quote['USD'].price;
      if (price) {
        let averagePrice = value.price / value.number;
        let profitPercentage =
          ((Number(price) - averagePrice) / averagePrice) * 100;
        let profitPrice = (Number(price) - averagePrice) * value.number;

        await ctx.reply(
          `gain ${key}: ${
            Math.floor(profitPercentage * 1000) / 1000
          }%, profit: ${Math.floor(profitPrice * 1000) / 1000}$`
        );
      } else {
        await ctx.reply(`This coin ${key} not found`);
      }
    }
    return ctx.reply('Data received successfully');
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

bot.hears('Login', async (ctx) => {
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

bot.hears('Add coin', async (ctx) => {
  await ctx.api.sendMessage(
    ctx.msg.chat.id,
    'Enter the symbolic designation of the coin (for example, ETC, BTC, ADA), the value of the coin at the time of purchase (USD) and the number of coins'
  );
  await ctx.conversation.enter('addCoin');
});

bot.start();
