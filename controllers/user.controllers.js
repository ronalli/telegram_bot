import { User } from '../models/index.js';

export const findUser = async (id) => {
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

export const registerUser = async (name, id) => {
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

export const updateUserInfo = async (id, coin) => {
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
