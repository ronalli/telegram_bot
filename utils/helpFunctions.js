export const formatData = async (data) => {
  const obj = {};
  data.forEach((el) => {
    obj[el.symbol] = el;
  });
  return obj;
};

export const dataFusion = async (response, arrayCoin) => {
  const stack = {};
  const { crypto: data } = arrayCoin;
  data.forEach((el) => {
    if (response[el.name]) {
      if (stack.hasOwnProperty(el.name)) {
        stack[el.name] = {
          price:
            Number(stack[el.name].price) + Number(el.price) * Number(el.number),
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
  return stack;
};

export const printInfo = async (stack, response, ctx) => {
  for (let [key, value] of Object.entries(stack)) {
    const price = response[key]?.quote['USD'].price;
    if (price) {
      let averagePrice = value.price / value.number;
      let profitPercentage =
        Math.floor(
          ((Number(price) - averagePrice) / averagePrice) * 100 * 1000
        ) / 1000;
      let profitPrice =
        Math.floor((Number(price) - averagePrice) * value.number * 1000) / 1000;
      await ctx.reply(
        `gain ${key}: ${profitPercentage}%, profit: ${profitPrice}$`
      );
    } else {
      await ctx.reply(`This coin ${key} not found`);
    }
  }
  return 'Data received successfully';
};
