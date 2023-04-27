import {Document, Types} from "mongoose";
import {User} from "./User";

interface Picture extends Document {
    title: string;
    description: string;
    filename: string;
    owner: Types.ObjectId | User;
}

interface PictureTest {
    id?: string;
    title?: string;
    description?: string;
    filename?: string;
    owner?: Types.ObjectId | User;
}

export {Picture, PictureTest}