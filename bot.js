import { Bot, Keyboard, session } from 'grammy';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
// import NodeCache from 'node-cache';
import axios from 'axios';
import { User } from './models/index.js';

dotenv.config();



const bot = new Bot(process.env.TOKEN);

const keyboard = new Keyboard()
  .text('Логин')
  .row()
  .text('Добавить монету')
  .text('Список')
  .row()
  .resized()
  .persistent();

mongoose
  .connect(
    `mongodb+srv://${process.env.USER_MG}:${process.env.PASSWORD_MG}@cluster0.kokvpr9.mongodb.net/`
  )
  .then(() => console.log('connected'))
  .catch((err) => console.log(err));

bot.use(session());

bot.command('start', async (ctx) => {
  ctx.reply('Welcome friend!');
  await ctx.reply('Touch please', {
    reply_markup: keyboard,
  });
});

bot.command('help', (ctx) => ctx.reply('This bot shows crypto analytic'));
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

bot.hears('list', async (ctx) => {
  try {
    const response = await axios.get(process.env.API_URL, {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.TOKEN_COINMARKET,
      },
    });
    if (myCache.set('coin', response.data, 3600))
      bot.api.sendMessage(ctx.msg.chat.id, 'good');
  } catch (error) {
    console.log(error);
  }
});

bot.on('message', async (ctx) => {
  if (ctx.message.text === 'Логин') {
    const id = ctx.msg.chat.id.toString();
    try {
      const [user] = await User.find({ id: id });
      // console.log(user);
      if (user) ctx.reply('User find!');
      else ctx.reply('Ooops!!');
    } catch (error) {
      console.log(error);
    }
  }
  if (ctx.message.text === 'Добавить монету') {
    await ctx.reply(
      'Введите через запятую: символьное обозначение монеты (например, ETC, BTC, ADA), стоимость монеты на момент покупки и количество монет'
    );
  }
});

bot.on(':text', async (ctx) => {
  console.log('fsdfsd');
});

bot.start();
