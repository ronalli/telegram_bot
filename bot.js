import { Bot, Keyboard, session } from 'grammy';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from './models/index.js';
import { connectDB, getCoin } from './utils/api.js';
import { myCache } from './utils/cache.js';

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

connectDB()
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
  const response = await getCoin();
  if (response.message)
    return ctx.reply('Произошла ошибка, давайте попробуем позже');
  if (myCache.get('coin')) {
    return ctx.reply('Данные актуальные!');
  }
  if (myCache.set('coin', response, 3600))
    return ctx.reply('Данные получены успешно!');
});

bot.on('message', async (ctx) => {
  if (ctx.message.text === 'Логин') {
    const id = ctx.msg.chat.id.toString();
    try {
      const [user] = await User.find({ id: id });
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

bot.start();
