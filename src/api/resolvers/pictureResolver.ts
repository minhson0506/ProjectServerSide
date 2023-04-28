import {GraphQLError} from "graphql";
import {Picture} from "../../interfaces/Picture";
import {UserIdWithToken} from "../../interfaces/User";
import pictureModel from "../models/pictureModel";
import {Types} from "mongoose";
import {Comment} from "../../interfaces/Comment";

export default {
    Comment: {
        picture: async (parent: Comment) => {
            return await pictureModel.findById(parent.picture);
        },
    },
    Query: {
        // get all pictures
        pictures: async () => {
            return await pictureModel.find();
        },
        // get picture by id
        pictureById: async (parent: undefined, args: {id: string}) => {
            return await pictureModel.findById(args.id);
        },
        // get pictures by owner
        picturesByOwner: async (parent: undefined, args: {owner: string}) => {
            return await pictureModel.find({owner: args.owner});
        },
    },
    Mutation: {
        // create picture
        createPicture: async ( parent: undefined, args: Picture, user: UserIdWithToken) => {
            if (!user.token) {
                throw new GraphQLError('Unauthorized', {extensions: {code: 'UNAUTHORIZED'}});
            }
            const picture = new pictureModel({ ...args, owner: new Types.ObjectId(user.id)});
            return await picture.save();
        },
        // update picture
        updatePicture: async (parent: undefined, args: Picture, user: UserIdWithToken) => {
            if (!user.token) {
                throw new GraphQLError('Unauthorized', {extensions: {code: 'UNAUTHORIZED'}});
            }
            // get picture from id
            const picture = await pictureModel.findById(args.id);
            if (!picture) {
                throw new GraphQLError('Picture not found', {extensions: {code: 'NOT_FOUND'}});
            }
            if (picture.owner.toString() !== user.id.toString()) {
                throw new GraphQLError('Unauthorized', {extensions: {code: 'UNAUTHORIZED'}});
            }
            return await pictureModel.findByIdAndUpdate(args.id, args, {new: true});
        },
        // delete picture
        deletePicture: async (parent: undefined, args: {id: string}, user: UserIdWithToken) => {
            if (!user.token) {
                throw new GraphQLError('Unauthorized', {extensions: {code: 'UNAUTHORIZED'}});
            }
            const picture = await pictureModel.findById(args.id);
            if (!picture) {
                throw new GraphQLError('Picture not found', {extensions: {code: 'NOT_FOUND'}});
            }
            if (picture.owner.toString() !== user.id.toString()) {
                throw new GraphQLError('Unauthorized', {extensions: {code: 'UNAUTHORIZED'}});
            }
            return await pictureModel.findByIdAndDelete(args.id);
        },
    },
};

