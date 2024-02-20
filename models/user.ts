import { Schema, model } from 'mongoose';
import { ObjectId } from 'mongodb';

type Coin = {
  date: Date;
  name: string;
  price: string;
  number: string;
  _id?: ObjectId;
};

export interface PersonalAccount {
  name: string;
  id: string;
  crypto: [Coin];
}

const UserSchema = new Schema<PersonalAccount>({
  name: String,
  id: String,
  crypto: [
    {
      date: Date,
      name: String,
      price: String,
      number: String,
      _id: ObjectId,
    },
  ],
});

const User = model('User', UserSchema);

export default User;
