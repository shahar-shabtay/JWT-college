import Comment, { IComment } from '../models/comments';
import createController from './baseController';

const commentController = createController<IComment>(Comment);

export default commentController;