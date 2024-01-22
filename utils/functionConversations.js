export async function addCoin(conversation, ctx) {
  if (!ctx.session.auth) {
    await ctx.reply("You don't auth, bye!");
    return;
  }
  await ctx.reply("Name's coin: ");
  const {
    msg: { text: name },
  } = await conversation.wait();
  await ctx.reply('Сoin value');
  const {
    msg: { text: value },
  } = await conversation.wait();
  await ctx.reply('Number coins');
  const {
    msg: { text: number },
  } = await conversation.wait();
  await ctx.reply('Сoin information added successfully');
  return;
}
