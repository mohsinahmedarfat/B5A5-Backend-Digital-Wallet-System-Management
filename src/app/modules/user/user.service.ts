import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  
  const user = await User.create(payload);
//   const { name, email } = payload;
//   const user = await User.create({ name, email });

  return user;
};

export const UserServices = {
  createUser,
};