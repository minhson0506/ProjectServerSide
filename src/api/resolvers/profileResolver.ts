import {GraphQLError} from "graphql";
import {User, UserIdWithToken} from "../../interfaces/User";
import profileModel from "../models/profileModel";
import {Types} from "mongoose";
import {Profile} from "../../interfaces/Profile";
import {LoginMessageResponse, ProfileMessageResponse} from "../../interfaces/ResponseMessage";

export default {
    Query: {
        profiles: async () => {
            return await profileModel.find();
        },
        profileById: async (parent: undefined, args: {id: string}) => {
            return await profileModel.findById(args.id);
        },
        profileByOwner: async (parent: undefined, args: {owner: string}) => {
            return await profileModel.find({owner: args.owner});
        },
    },
    Mutation: {
        createProfile: async (parent: undefined, args: Profile, user: UserIdWithToken) => {
            if (!user.token) {
                throw new GraphQLError('Unauthorized', {extensions: {code: 'UNAUTHORIZED'}});
            }
            const profile = new profileModel({...args, owner: new Types.ObjectId(user.id)});
            return await profile.save();
        },
        updateProfile: async (parent: undefined, args: Profile, user: UserIdWithToken) => {
            if (!user.token) {
                throw new GraphQLError('Unauthorized', {extensions: {code: 'UNAUTHORIZED'}});
            }
            const profile = await profileModel.findById(args.id);
            if (!profile) {
                throw new GraphQLError('Profile not found', {extensions: {code: 'NOT_FOUND'}});
            }
            if (profile.owner._id.toString() !== user.id) {
                throw new GraphQLError('Unauthorized', {extensions: {code: 'UNAUTHORIZED'}});
            }
            return await profileModel.findByIdAndUpdate(args.id, args, {new: true});
        },
        deleteProfile: async (parent: undefined, args: {id: string}, user: UserIdWithToken) => {
            if (!user.token) {
                throw new GraphQLError('Unauthorized', {extensions: {code: 'UNAUTHORIZED'}});
            }
            const profile = await profileModel.findById(args.id);
            if (!profile) {
                throw new GraphQLError('Profile not found', {extensions: {code: 'NOT_FOUND'}});
            }
            if (profile.owner._id.toString() !== user.id) {
                throw new GraphQLError('Unauthorized', {extensions: {code: 'UNAUTHORIZED'}});
            }
            return await profileModel.findByIdAndDelete(args.id);
        },
        addFollow: async (parent: undefined, args: {id: string}, user: UserIdWithToken) => {
            if (!user.token) {
                throw new GraphQLError('Unauthorized', {extensions: {code: 'UNAUTHORIZED'}});
            }
            const profile = await profileModel.find({owner: new Types.ObjectId(user.id)});
            if (!profile) {
                throw new GraphQLError('Profile not found', {extensions: {code: 'NOT_FOUND'}});
            }
            if (profile[0].owner.toString() !== user.id) {
                throw new GraphQLError('Unauthorized', {extensions: {code: 'UNAUTHORIZED'}});
            }
            if (profile[0].follows.includes(new Types.ObjectId(args.id))) {
                throw new GraphQLError('Already following', {extensions: {code: 'ALREADY_FOLLOWING'}});
            }
            return await profileModel.findByIdAndUpdate(profile[0].id, {$push: {follows: user.id}}, {new: true});
        },
        removeFollow: async (parent: undefined, args: {id: string}, user: UserIdWithToken) => {
            if (!user.token) {
                throw new GraphQLError('Unauthorized', {extensions: {code: 'UNAUTHORIZED'}});
            }
            const profile = await profileModel.find({owner: new Types.ObjectId(user.id)});
            if (!profile) {
                throw new GraphQLError('Profile not found', {extensions: {code: 'NOT_FOUND'}});
            }
            if (profile[0].owner.toString() !== user.id) {
                throw new GraphQLError('Unauthorized', {extensions: {code: 'UNAUTHORIZED'}});
            }
            if (!profile[0].follows.includes(new Types.ObjectId(args.id))) {
                throw new GraphQLError('Not following', {extensions: {code: 'NOT_FOLLOWING'}});
            }
            return await profileModel.findByIdAndUpdate(profile[0].id, {$pull: {follows: user.id}}, {new: true});
        }
    },
}