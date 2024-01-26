import { updateUserInfo } from '../controllers/user.controllers.js';

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
  await ctx.reply(`${response.message}`);
  return;
}
