import { User } from '../models/index.js';

export const findUser: any = async (id: any) => {
  try {
    const response = await User.findOne({ id: id });
    if (response) {
      return { message: 'Account found', success: true, data: response };
    } else {
      return { message: 'Account not found', success: false };
    }
  } catch (error) {
    return { error, success: false };
  }
};

export const registerUser = async (name: any, id: any) => {
  try {
    const response = await findUser(id);
    if (!response.success) {
      const newUser = {
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

export const updateUserInfo = async (id: any, coin: any) => {
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

export const findOneCoin = async (id: any, coin: any) => {
  try {
    const response: any = await findUser(id);
    if (response.success) {
      let coins = response.data.crypto.filter((el: any) => el.name === coin);
      return coins.length === 0
        ? { success: false, message: 'There is no information about the coin' }
        : { data: coins, success: true, message: 'Successfully received' };
    }
  } catch (error) {
    return { error, success: false };
  }
};
