import request from 'supertest';
import {ProfileTest} from '../src/interfaces/Profile';
import UploadMessageResponse from '../src/interfaces/UploadMessageResponse';

const postFile = async (url: string | Function, token: string, filename: string): Promise<UploadMessageResponse> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/upload')
            .set('Authorization', `Bearer ${token}`)
            .attach('file', 'test/' + filename)
            .expect(200, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    const uploadMessageResponse = res.body;
                    expect(uploadMessageResponse).toHaveProperty('message');
                    expect(uploadMessageResponse).toHaveProperty('data');
                    expect(uploadMessageResponse.data).toHaveProperty('filename');
                    expect(uploadMessageResponse.data).toHaveProperty('location');
                    resolve(uploadMessageResponse);
                }
            });
    });
};

const postProfile = async (url: string | Function, profile: ProfileTest, token: string): Promise<ProfileTest> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: `mutation CreateProfile($avatar: String, $cover: String, $about: String, $location: String, $interests: [String]) {
                    createProfile(avatar: $avatar, cover: $cover, about: $about, location: $location, interests: $interests) {
                        id
                        owner {
                            id
                            user_name
                            email
                        }
                        avatar
                        cover
                        about
                        location
                        interests
                    }
                }`,
                variables: profile
            })
            .expect(200, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    const profile = res.body.data.createProfile;
                    expect(profile).toHaveProperty('owner');
                    expect(profile.owner).toHaveProperty('id');
                    expect(profile.owner).toHaveProperty('user_name');
                    expect(profile.owner).toHaveProperty('email');
                    expect(profile).toHaveProperty('avatar');
                    expect(profile).toHaveProperty('cover');
                    expect(profile).toHaveProperty('about');
                    expect(profile).toHaveProperty('location');
                    expect(profile).toHaveProperty('interests');
                    resolve(profile);
                }
            }
        );
    });
};

export {postFile, postProfile};
