import { compare, hash } from 'bcrypt';
import { Schema, model } from 'mongoose';
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
UserSchema.pre('save', async function (next) {
  const hasspassword = await hash(this.password, 10);
  this.passpord = hasspassword;
  next();
});
UserSchema.methods.isValidPassword = async function (password) {
  // const user = this;
  const isSame = await compare(password, this.password);
  return isSame;
};
UserSchema.statics.findOneById = async function (_id: string) {
  return this.findOne({ _id });
};
export default model('users', UserSchema);
