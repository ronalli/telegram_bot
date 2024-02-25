import { MyContext, MyConversation } from './../types/Context.js';
import {
  findOneCoin,
  updateUserInfo,
} from '../controllers/user.controllers.js';
import { formatInfoCoin } from './helpFunctions.js';
import CustomKeyboard from './keyboard.js';
import { Coin } from '../models/User.js';

export async function addCoin(conversation: MyConversation, ctx: MyContext) {
  if (!ctx.session.auth) {
    await ctx.reply("You don't auth, bye!");
    return;
  }
  await ctx.reply("Name's coin: ");
  const name = await conversation.wait();
  await ctx.reply('Сoin price');
  const price = await conversation.wait();
  await ctx.reply('Number coins');
  const number = await conversation.wait();
  if (name?.message?.text && price?.message?.text && number?.message?.text) {
    const coin: Coin = {
      name: name.message.text.toUpperCase(),
      price: price.message.text,
      number: number.message.text,
      date: new Date(),
    };
    const response = await conversation.external(() =>
      updateUserInfo(ctx.session.info, coin)
    );

    if (!response.success) return ctx.reply('Ooops! Try later');
    await ctx.reply(`${response.message}`, {
      reply_markup: CustomKeyboard.keyboard,
    });
    return;
  }
  return;
}

export async function searchCoin(conversation: MyConversation, ctx: MyContext) {
  const id = ctx.session.info;
  await ctx.reply(`Please, write name's coin`);
  const name = await conversation.wait();
  const response = await conversation.external(() => {
    if (name.message?.text) {
      return findOneCoin(id, name.message?.text.toUpperCase());
    }
  });
  if (response) {
    response.success &&
      response?.data?.forEach(async (el) => {
        await ctx.reply(formatInfoCoin(el));
      });
    await ctx.reply(`${response.message}`, {
      reply_markup: CustomKeyboard.keyboard,
    });
  }
  return;
}
