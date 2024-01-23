import { User } from '../models/index.js';

export const findUser = async (id) => {
  try {
    const response = await User.find({ id: id });
    return { message: 'Account found', success: true };
  } catch (error) {
    return { error, success: false };
  }
};

export const registerUser = async (name, id) => {
  try {
    const newUser = {
      name,
      id,
      crypto: [],
    };
    const accountDB = new User(newUser);
    await accountDB.save();
    return { message: 'Account created', success: true };
  } catch (error) {
    return { error, success: false };
  }
};
