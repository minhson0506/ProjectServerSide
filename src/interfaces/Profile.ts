import {Document, Types} from "mongoose";
import {User} from "./User";

interface Profile extends Document {
    owner: Types.ObjectId | User;
    avatar: string;
    cover: string;
    about: string;
    location: string;
    interests: string[];
    follows: (Types.ObjectId | User)[];
}

interface ProfileTest {
    id?: string;
    owner?: Types.ObjectId | User;
    avatar?: string;
    cover?: string;
    about?: string;
    location?: string;
    interests?: string[];
}

export {Profile, ProfileTest}