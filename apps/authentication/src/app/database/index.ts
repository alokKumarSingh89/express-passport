import { connect } from 'mongoose';

const uri = 'mongodb://alok:alok@localhost:27017/express-auth';

export default async () => {
  return connect(uri);
};
