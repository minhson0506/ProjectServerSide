import {GraphQLError} from "graphql";
import {UserIdWithToken} from "../../interfaces/User";
import profileModel from "../models/profileModel";
import {Types} from "mongoose";
import {Profile} from "../../interfaces/Profile";

export default {
    Query: {
        profiles: async () => {
            return await profileModel.find();
        },
        profileById: async (parent: undefined, args: {id: string}) => {
            return await profileModel.findById(args.id);
        },
        profileByOwner: async (parent: undefined, args: UserIdWithToken) => {
            return await profileModel.find({owner: args.id});
        },
    },
    Mutation: {
        createProfile: async (parent: undefined, args: Profile, user: UserIdWithToken) => {
            if (!user.token) {
                throw new GraphQLError('Unauthorized', {extensions: {code: 'UNAUTHORIZED'}});
            }
            const profile = new profileModel({ ...args, owner: new Types.ObjectId(user.id)});
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
            if (profile.owner.toString() !== user.id) {
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
            if (profile.owner.toString() !== user.id) {
                throw new GraphQLError('Unauthorized', {extensions: {code: 'UNAUTHORIZED'}});
            }
            return await profileModel.findByIdAndDelete(args.id);
        },
        addFollow: async (parent: undefined, args: {id: string}, user: UserIdWithToken) => {
            if (!user.token) {
                throw new GraphQLError('Unauthorized', {extensions: {code: 'UNAUTHORIZED'}});
            }
            const profile = await profileModel.findById(args.id);
            if (!profile) {
                throw new GraphQLError('Profile not found', {extensions: {code: 'NOT_FOUND'}});
            }
            if (profile.owner.toString() === user.id) {
                throw new GraphQLError('Unauthorized', {extensions: {code: 'UNAUTHORIZED'}});
            }
            if (profile.follows.includes(new Types.ObjectId(args.id))) {
                throw new GraphQLError('Already following', {extensions: {code: 'ALREADY_FOLLOWING'}});
            }
            return await profileModel.findByIdAndUpdate(args.id, {$push: {followers: user.id}}, {new: true});
        },
        removeFollow: async (parent: undefined, args: {id: string}, user: UserIdWithToken) => {
            if (!user.token) {
                throw new GraphQLError('Unauthorized', {extensions: {code: 'UNAUTHORIZED'}});
            }
            const profile = await profileModel.findById(args.id);
            if (!profile) {
                throw new GraphQLError('Profile not found', {extensions: {code: 'NOT_FOUND'}});
            }
            if (profile.owner.toString() === user.id) {
                throw new GraphQLError('Unauthorized', {extensions: {code: 'UNAUTHORIZED'}});
            }
            if (!profile.follows.includes(new Types.ObjectId(args.id))) {
                throw new GraphQLError('Not following', {extensions: {code: 'NOT_FOLLOWING'}});
            }
            return await profileModel.findByIdAndUpdate(args.id, {$pull: {followers: user.id}}, {new: true});
        }
    },
}