import mongoose from "mongoose"
import {deleteUser, getSingleUser, getUsers, login, loginBrute, postUser, putUser} from "./userFunction"
import app from "../src/app"
import {UserTest} from "../src/interfaces/User"
import randomstring from "randomstring"
import {LoginMessageResponse} from "../src/interfaces/ResponseMessage"
import {getNotFound} from "./testFunction"
import {deleteProfile, getProfileById, getProfileByOwner, getProfiles, postFile, postProfile, updateProfile} from "./profileFunction"
import UploadMessageResponse from "../src/interfaces/UploadMessageResponse"
import {ProfileTest} from "../src/interfaces/Profile"

const uploadApp = process.env.UPLOAD_URL as string

describe('GET /graphql', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.DATABASE_URL as string)
    })

    afterAll(async () => {
        await mongoose.connection.close()
    })

    // test not found
    it('responds with a not found message', async () => {
        await getNotFound(app);
    });

    const testUser: UserTest = {
        user_name: 'Test User ' + randomstring.generate(7),
        email: randomstring.generate(9) + '@user.fi',
        password: 'testpassword',
    };

    let userData: LoginMessageResponse;
    let avatar: UploadMessageResponse;
    let cover: UploadMessageResponse;
    let profileData: ProfileTest;
    let profileId: string;

    // test create user
    it('should create a user', async () => {
        await postUser(app, testUser)
    })

    // login user
    it('should login a user', async () => {
        userData = await login(app, testUser)
    })

    // test get all users
    it('should return array of users', async () => {
        await getUsers(app);
    });

    // test get single user
    it('should return single user', async () => {
        await getSingleUser(app, userData.user.id!);
    });

    // test update user
    it('should update user', async () => {
        await putUser(app, userData.token!);
    });

    // test upload file
    it('should upload a file', async () => {
        avatar = await postFile(uploadApp, userData.token!, 'avatar.jpeg');
        cover = await postFile(uploadApp, userData.token!, 'cover.jpeg');
    });

    // test create profile
    it('should create a profile', async () => {
        profileData = {
            owner: userData.user.id,
            avatar: avatar.data.filename,
            cover: cover.data.filename,
            about: 'Test about',
            location: 'Test location',
            interests: ['Test interest 1', 'Test interest 2']
        };
        const profile = await postProfile(app, profileData, userData.token!);
        profileId = profile.id!;
    });

    // test get profiles
    it('should return array of profiles', async () => {
        await getProfiles(app);
    });

    // test get profile by Id
    it('should return single profile', async () => {
        await getProfileById(app, profileId);
    });

    // test get profile by user Id
    it('should return single profile by user Id', async () => {
        await getProfileByOwner(app, userData.user.id!);
    });

    // test update profile
    it('should update a profile', async () => {
        profileData.id = profileId;
        profileData.about = 'Updated about';
        profileData.location = 'Updated location';
        profileData.interests = ['Updated interest 1', 'Updated interest 2'];
        profileData.follows = [userData.user.id!];
        await updateProfile(app, profileData, userData.token!);
    });

    // test delete profile
    it('should delete a profile', async () => {
        await deleteProfile(app, profileId, userData.token!);
    });

    // test delete user
    it('should delete current user', async () => {
        await deleteUser(app, userData.token!);
    });

    // test brute force protectiom
    test('Brute force attack simulation', async () => {
        const maxAttempts = 20;
        const mockUser: UserTest = {
            user_name: 'Test User ' + randomstring.generate(7),
            email: randomstring.generate(9) + '@user.fi',
            password: 'notthepassword',
        };

        try {
            // Call the mock login function until the maximum number of attempts is reached
            for (let i = 0; i < maxAttempts; i++) {
                const result = await loginBrute(app, mockUser);
                if (result) throw new Error('Brute force attack unsuccessful');
            }

            // If the while loop completes successfully, the test fails
            throw new Error('Brute force attack succeeded');
        } catch (error) {
            console.log(error);
            // If the login function throws an error, the test passes
            expect((error as Error).message).toBe('Brute force attack unsuccessful');
        }
    }, 15000);
});
