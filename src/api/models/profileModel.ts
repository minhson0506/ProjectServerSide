import {Schema, mongo} from "mongoose";
import {Profile} from "../../interfaces/Profile";

const ProfileModel = new Schema<Profile>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    avatar: {
        type: String,
        required: false,
    },
    cover: {
        type: String,
        required: false,
    },
    about: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    interests: {
        type: [String],
        required: false,
    },
});

export default mongo.model<Profile>('Profile', ProfileModel);