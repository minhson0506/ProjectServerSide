import mongoose, {Types} from "mongoose"
import {checkToken, deleteUser, getSingleUser, getUsers, login, loginBrute, postUser, putUser, searchUser} from "./userFunction"
import app from "../src/app"
import {UserTest} from "../src/interfaces/User"
import randomstring from "randomstring"
import {LoginMessageResponse} from "../src/interfaces/ResponseMessage"
import {getNotFound} from "./testFunction"
import {addFollow, deleteProfile, getProfileById, getProfileByOwner, getProfiles, postFile, postProfile, removeFollow, updateProfile} from "./profileFunction"
import UploadMessageResponse from "../src/interfaces/UploadMessageResponse"
import {ProfileTest} from "../src/interfaces/Profile"
import {PictureTest} from "../src/interfaces/Picture"
import {deletePicture, getPictureById, getPictures, postPicture, updatePicture} from "./pictureFunction"
import {CommentTest} from "../src/interfaces/Comment"
import {deleteComment, getCommentById, getComments, getCommentsByOwnerId, getCommentsByPictureId, postComment, updateComment} from "./commentFunction"

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

    // test create user
    it('should create a user', async () => {
        await postUser(app, testUser)
    })

    // login user
    it('should login a user', async () => {
        userData = await login(app, testUser)
    })

    // test search user
    it('should return array of users with searching', async () => {
        await searchUser(app, "test", userData.token!)
    })

    // test get all users
    it('should return array of users', async () => {
        await getUsers(app);
    });

    // test get single user
    it('should return single user', async () => {
        await getSingleUser(app, userData.user.id!);
    });

    // test check token
    it('should return user data when checking token', async () => {
        await checkToken(app, userData.token!);
    });

    // test update user
    it('should update user', async () => {
        await putUser(app, userData.token!);
    });

    let avatar: UploadMessageResponse;
    let cover: UploadMessageResponse;

    // test upload file
    it('should upload a file', async () => {
        avatar = await postFile(uploadApp, userData.token!, 'avatar.jpeg');
        cover = await postFile(uploadApp, userData.token!, 'cover.jpeg');
    });

    let profileData: ProfileTest;
    let profileId: string;
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

    // test remove follow from profile
    it('should remove follow from a profile', async () => {
        await removeFollow(app, userData.user.id, userData.token!);
    });

    // test add follow to profile
    it('should add follow to a profile', async () => {
        await addFollow(app, userData.user.id, userData.token!);
    });

    // test delete profile
    it('should delete a profile', async () => {
        await deleteProfile(app, profileId, userData.token!);
    });

    let pictureData: PictureTest
    let picture: UploadMessageResponse;
    // test create picture
    it('should create a picture', async () => {
        picture = await postFile(uploadApp, userData.token!, 'picture.jpg');
        pictureData = {
            title: 'Test picture',
            description: 'Test description',
            filename: picture.data.filename,
            timestamp: new Date(),
        };
        const result = await postPicture(app, pictureData, userData.token!);
        pictureData.id = result.id!;
    });

    // test get pictures
    it('should return array of pictures', async () => {
        await getPictures(app);
    });

    // test get picture by Id
    it('should return single picture', async () => {
        await getPictureById(app, pictureData.id!);
    });

    // test get picture by user Id
    it('should return single picture by user Id', async () => {
        await getProfileByOwner(app, userData.user.id!);
    });

    // test update picture
    it('should update a picture', async () => {
        pictureData.title = 'Updated title';
        pictureData.description = 'Updated description';
        await updatePicture(app, pictureData, userData.token!);
    });

    let commentData: CommentTest;
    // test create comment 
    it('should create a comment', async () => {
        commentData = {
            text: 'Test comment',
            picture: new Types.ObjectId(pictureData.id),
            timestamp: new Date(),
        }
        const response = await postComment(app, commentData, userData.token!);
        commentData.id = response.id!;
    });

    // test get comments
    it('should return array of comments', async () => {
        await getComments(app);
    });

    // test get comment by Id
    it('should return single comment', async () => {
        await getCommentById(app, commentData.id!);
    });

    // test get comment by picture Id
    it('should return comments by picture Id', async () => {
        await getCommentsByPictureId(app, pictureData.id!);
    });

    // test get comment by user Id
    it('should return comments by user Id', async () => {
        await getCommentsByOwnerId(app, userData.user.id!);
    });

    // test update comment
    it('should update a comment', async () => {
        commentData.text = 'Updated comment';
        await updateComment(app, commentData, userData.token!);
    });

    // test delete comment
    it('should delete a comment', async () => {
        await deleteComment(app, commentData.id!, userData.token!);
    });
    // test delete picture
    it('should delete a picture', async () => {
        await deletePicture(app, pictureData.id!, userData.token!);
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
