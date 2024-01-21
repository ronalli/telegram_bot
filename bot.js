import { Bot, session } from 'grammy';
import dotenv from 'dotenv';
import { User } from './models/index.js';
import { connectDB, getCoin } from './utils/api.js';
import { myCache } from './utils/cache.js';
import { keyboard } from './utils/keyboard.js';
import { conversations, createConversation } from '@grammyjs/conversations';
import { addCoin } from './utils/functionConversations.js';

dotenv.config();

const bot = new Bot(process.env.TOKEN_BOT);
bot.use(
  session({
    initial: () => ({}),
  })
);

bot.use(conversations());
bot.use(createConversation(addCoin));

connectDB()
  .then(() => console.log('connected'))
  .catch((err) => console.log(err));

bot.command('start', async (ctx) => {
  await ctx.reply('Welcome friend! Touch please', {
    reply_markup: keyboard,
  });
});

bot.command('help', (ctx) => ctx.reply('This bot shows crypto_analytic'));
bot.command('save', async (ctx) => {
  const userAccount = {
    name: ctx.msg.chat.first_name,
    id: ctx.msg.chat.id,
    crypto: [
      {
        date: Date.now(),
        name: 'ETC',
        priceStart: '500',
        rate: '300',
        gain: '1000',
      },
    ],
  };
  const account = new User(userAccount);

  try {
    await account.save();
    console.log('saved');
  } catch (error) {
    console.log(error);
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
    try {
      const [user] = await User.find({ id: id });
      if (user) ctx.reply('User find!');
      else ctx.reply('Ooops!!');
    } catch (error) {
      console.log(error);
    }
  }

  if (ctx.message.text === 'Add coin') {
    await ctx.api.sendMessage(
      ctx.msg.chat.id,
      'Enter, separated by commas: the symbolic designation of the coin (for example, ETC, BTC, ADA), the value of the coin at the time of purchase and the number of coins'
    );
    await ctx.conversation.enter('addCoin');
  }
});

bot.start();
