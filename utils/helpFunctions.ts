import { Coin, PersonalAccount } from '../models/User';
import { CoinServer, FormatCoin } from '../types/CoinServerResponse';
import { DataFusion, IObjectData } from '../types/Coins';
import { MyContext } from '../types/Context';

export const formatMainData = async (data: CoinServer[]) => {
  const obj: FormatCoin = {};
  data.forEach((el) => {
    obj[el.symbol] = el;
  });
  return obj;
};

export const dataFusion = async (
  response: FormatCoin,
  user: PersonalAccount
) => {
  const stack: DataFusion = {};
  const { crypto: data } = user;
  data.forEach((el) => {
    if (response[el.name]) {
      if (stack.hasOwnProperty(el.name) && typeof stack[el.name] === 'object') {
        stack[el.name] = {
          price:
            Number((stack[el.name] as IObjectData).price) +
            Number(el.price) * Number(el.number),
          number: (stack[el.name] as IObjectData).number + Number(el.number),
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

export const printInfo = async (
  stack: DataFusion,
  response: FormatCoin,
  ctx: MyContext
) => {
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

export const formatInfoCoin = (element: Coin) => {
  return `${element.name}, date: ${element.date.toLocaleDateString()}, price: ${
    element.price
  }$, number: ${element.number}, sum: ${
    Math.floor(+element.price * +element.number * 1000) / 1000
  }$`;
};
