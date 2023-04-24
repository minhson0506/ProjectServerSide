import mongoose from "mongoose"
import {deleteUser, getSingleUser, getUsers, login, loginBrute, postUser, putUser} from "./userFunction"
import app from "../src/app"
import {UserTest} from "../src/interfaces/User"
import randomstring from "randomstring"
import LoginMessageResponse from "../src/interfaces/LoginMessageResponse"
import {getNotFound} from "./testFunction"

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

    // test user
    // create user
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
