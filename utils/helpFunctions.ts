// import { Response } from '../types/Coins';

export const formatMainData = async (data: any) => {
  const obj: any = {};
  data.forEach((el: any) => {
    obj[el.symbol] = el;
  });
  return obj;
};

export const dataFusion = async (response: any, arrayCoin: any) => {
  const stack: any = {};
  const { crypto: data } = arrayCoin;
  data.forEach((el: any) => {
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

type Elem = {
  price: number;
  number: number;
};

type Stack = Elem[];

export const printInfo = async (stack: Stack, response: any, ctx: any) => {
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

export const formatInfoCoin = (element: any) => {
  return `${element.name}, date: ${element.date.toLocaleDateString()}, price: ${
    element.price
  }$, number: ${element.number}, sum: ${
    Math.floor(element.price * element.number * 1000) / 1000
  }$`;
};
