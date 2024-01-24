import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  id: String,
  crypto: [
    {
      date: Date,
      name: String,
      value: String,
      number: String,
    },
  ],
});

const User = mongoose.model('User', UserSchema);

export default User;
