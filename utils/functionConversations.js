export async function addCoin(conversation, ctx) {
  await ctx.reply('Hello! What is your name?');
  const { message } = await conversation.wait();
  await ctx.reply(`Good day ${message.text}`);
}
