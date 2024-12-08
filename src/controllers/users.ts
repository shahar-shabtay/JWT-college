import User, { IUser } from '../models/users';
import createController from './baseController';

const userController = createController<IUser>(User);

export default userController;