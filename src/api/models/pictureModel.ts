import mongoose, {Schema} from "mongoose";
import {Picture} from "../../interfaces/Picture";

const pictureModel = new Schema<Picture>({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    filename: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    timestamp: {
        type: Date,
        required: true,
    },
});

export default mongoose.model<Picture>('Picture', pictureModel);