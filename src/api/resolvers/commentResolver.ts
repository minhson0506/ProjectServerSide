import {GraphQLError} from "graphql";
import commentModel from "../models/commentModel";
import {UserIdWithToken} from "../../interfaces/User";
import {Comment} from "../../interfaces/Comment";
import {Types} from "mongoose";

export default {
    Query: {
        comments: async() => {
            return await commentModel.find();
        },
        commentById: async(parent: undefined, args: {id: string}) => {
            return await commentModel.findById(args.id);
        },
        commentsByPicture: async(parent: undefined, args: {pictureId: string}) => {
            return await commentModel.find({picture: args.pictureId});
        },
        commentsByOwner: async(parent: undefined, args: {ownerId: string}) => {
            return await commentModel.find({owner: args.ownerId});
        },
    },
    Mutation: {
        createComment: async(parent: undefined, args: Comment, user: UserIdWithToken) => {
            if (!user.token) {
                throw new GraphQLError('Unauthorized', {extensions: {code: 'UNAUTHORIZED'}});
            }
            const comment = new commentModel({...args, owner: new Types.ObjectId(user.id)});
            return await comment.save();
        },
        updateComment: async(parent: undefined, args: Comment, user: UserIdWithToken) => {
            if (!user.token) {
                throw new GraphQLError('Unauthorized', {extensions: {code: 'UNAUTHORIZED'}});
            }
            const comment = await commentModel.findById(args.id);
            if (!comment) {
                throw new GraphQLError('Comment not found', {extensions: {code: 'NOT_FOUND'}});
            }
            if (comment.owner.toString() !== user.id.toString()) {
                throw new GraphQLError('Unauthorized', {extensions: {code: 'UNAUTHORIZED'}});
            }
            return await commentModel.findByIdAndUpdate(args.id, args, {new: true});
        },
        deleteComment: async(parent: undefined, args: {id: string}, user: UserIdWithToken) => {
            if (!user.token) {
                throw new GraphQLError('Unauthorized', {extensions: {code: 'UNAUTHORIZED'}});
            }
            const comment = await commentModel.findById(args.id);
            if (!comment) {
                throw new GraphQLError('Comment not found', {extensions: {code: 'NOT_FOUND'}});
            }
            if (comment.owner.toString() !== user.id.toString()) {
                throw new GraphQLError('Unauthorized', {extensions: {code: 'UNAUTHORIZED'}});
            }
            return await commentModel.findByIdAndDelete(args.id);
        },
    },
}