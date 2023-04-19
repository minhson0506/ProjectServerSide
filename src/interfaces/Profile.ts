import {Document, Types} from "mongoose";
import {User} from "./User";

interface Profile extends Document {
    user: Types.ObjectId | User;
    avatar: string;
    cover: string;
    about: string;
    location: string;
    interests: [string];
}

export {Profile}