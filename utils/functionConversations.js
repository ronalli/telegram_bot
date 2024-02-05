import {
  findOneCoin,
  updateUserInfo,
} from '../controllers/user.controllers.js';
import { formatInfoCoin } from './helpFunctions.js';
import { keyboard } from './keyboard.js';

export async function addCoin(conversation, ctx) {
  if (!ctx.session.auth) {
    await ctx.reply("You don't auth, bye!");
    return;
  }
  await ctx.reply("Name's coin: ");
  const {
    msg: { text: name },
  } = await conversation.wait();
  await ctx.reply('Сoin price');
  const {
    msg: { text: price },
  } = await conversation.wait();
  await ctx.reply('Number coins');
  const {
    msg: { text: number },
  } = await conversation.wait();

  const coin = {
    name: name.toUpperCase(),
    price,
    number,
    date: new Date(),
  };
  const response = await conversation.external(() =>
    updateUserInfo(ctx.session.info, coin)
  );
  if (!response.success) return ctx.reply('Ooops! Try later');
  await ctx.reply(`${response.message}`, { reply_markup: keyboard });
  return;
}

export async function searchCoin(conversation, ctx) {
  const id = ctx.session.info;
  await ctx.reply(`Please, write name's coin`);
  const {
    msg: { text: name },
  } = await conversation.wait();
  const response = await conversation.external(() =>
    findOneCoin(id, name.toUpperCase())
  );
  if (response.success) {
    response.data.forEach(async (el) => {
      await ctx.reply(formatInfoCoin(el));
    });
  }
  await ctx.reply(`${response.message}`, { reply_markup: keyboard });
  return;
}
