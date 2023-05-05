import mongoose, {Schema} from "mongoose";
import {Comment} from "../../interfaces/Comment";

const commentModel = new Schema<Comment>({
    text: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    picture: {
        type: Schema.Types.ObjectId,
        ref: 'Picture',
        required: true,
    },
    timestamp: {
        type: Date,
        required: true,
    },
});

export default mongoose.model<Comment>('Comment', commentModel);