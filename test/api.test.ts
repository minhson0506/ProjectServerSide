import mongoose from "mongoose"
import {postUser} from "./userFunction"
import app from "../src/app"
import {UserTest} from "../src/interfaces/User"
import randomstring from "randomstring"

describe('GET /graphql', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.DATABASE_URL as string)
    })

    afterAll(async () => {
        await mongoose.connection.close()
    })

    const testUser: UserTest = {
        user_name: 'Test User ' + randomstring.generate(7),
        email: randomstring.generate(9) + '@user.fi',
        password: 'testpassword',
      };

    // test user
    // create user
    it('should create a user', async () => {
        await postUser(app, testUser)
    })
})