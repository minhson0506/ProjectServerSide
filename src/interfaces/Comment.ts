import {Document, Types} from "mongoose";
import {User} from "./User";
import {Picture} from "./Picture";

interface Comment extends Document {
    text: string;
    owner: Types.ObjectId | User;
    picture: Types.ObjectId | Picture;
    timestamp: Date;
}

interface CommentTest {
    id?: string;
    text?: string;
    owner?: Types.ObjectId | User;
    picture?: Types.ObjectId | Picture;
    timestamp?: Date;
}

export {Comment, CommentTest}
