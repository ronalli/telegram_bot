import { PersonalCoin } from '../models/CryptoCoin.js';
import { PersonalAccount } from '../models/User.js';
import { User } from '../models/index.js';

export const findUser = async (id: string) => {
  try {
    const response = await User.findOne({ id: id });
    if (response) {
      return {
        message: 'Account found',
        success: true,
        data: response as PersonalAccount,
      };
    } else {
      return { message: 'Account not found', success: false };
    }
  } catch (error) {
    return { error, success: false };
  }
};

export const registerUser = async (name: string, id: string) => {
  try {
    const response = await findUser(id);
    if (!response.success) {
      const newUser: PersonalAccount = {
        name,
        id,
        crypto: [],
      };
      const accountDB = new User(newUser);
      await accountDB.save();
      return { message: 'Account created', success: true };
    } else {
      return { message: 'Account already exists!', success: true };
    }
  } catch (error) {
    return { error, success: false };
  }
};

export const updateUserInfo = async (id: string, coin: PersonalCoin) => {
  try {
    const response = await User.findOneAndUpdate(
      { id },
      { $push: { crypto: coin } }
    );
    return { message: 'Success add', success: true };
  } catch (error) {
    return { error, success: false };
  }
};

export const findOneCoin = async (id: string, coin: string) => {
  try {
    const response = await findUser(id);
    if (response.success && response.data?.crypto) {
      let coins = response.data.crypto.filter((el) => el.name === coin);
      return coins.length === 0
        ? { success: false, message: 'There is no information about the coin' }
        : { data: coins, success: true, message: 'Successfully received' };
    }
  } catch (error) {
    return { error, success: false };
  }
};
