import mongoose, {Schema} from "mongoose";
import {Profile} from "../../interfaces/Profile";

const ProfileModel = new Schema<Profile>({
    owner: {
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
    location: {
        type: String,
        required: false,
    },
    interests: {
        type: [String],
        required: false,
    },
});

export default mongoose.model<Profile>('Profile', ProfileModel);