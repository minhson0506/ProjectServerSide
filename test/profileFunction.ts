import request from 'supertest';
import {ProfileTest} from '../src/interfaces/Profile';
import UploadMessageResponse from '../src/interfaces/UploadMessageResponse';

const getProfiles = async (url: string | Function): Promise<ProfileTest> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-Type', 'application/json')
            .send({
                query: `query Query {
                    profiles {
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
                        follows {
                            id
                            user_name
                            email
                        }
                    }
                }`,
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                }
                const profiles = response.body.data.profiles;
                expect(profiles).toBeInstanceOf(Array);
                expect(profiles[0]).toHaveProperty('id');
                expect(profiles[0]).toHaveProperty('owner');
                expect(profiles[0]).toHaveProperty('avatar');
                expect(profiles[0]).toHaveProperty('cover');
                expect(profiles[0]).toHaveProperty('about');
                expect(profiles[0]).toHaveProperty('location');
                expect(profiles[0]).toHaveProperty('interests');
                expect(profiles[0]).toHaveProperty('follows');
                resolve(profiles);
            }
            );
    });
};

const getProfileById = async (url: string | Function, id: string): Promise<ProfileTest> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-Type', 'application/json')
            .send({
                query: `query Query($profileByIdId: ID!) {
                    profileById(id: $profileByIdId) {
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
                        follows {
                            id
                            user_name
                            email
                        }
                    }
                }`,
                variables: {
                    profileByIdId: id,
                },
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                }
                const profile = response.body.data.profileById;
                expect(profile).toHaveProperty('id');
                expect(profile).toHaveProperty('owner');
                expect(profile).toHaveProperty('avatar');
                expect(profile).toHaveProperty('cover');
                expect(profile).toHaveProperty('about');
                expect(profile).toHaveProperty('location');
                expect(profile).toHaveProperty('interests');
                expect(profile).toHaveProperty('follows');
                resolve(profile);
            }
            );
    });
};

const getProfileByOwner = async (url: string | Function, ownerId: string): Promise<ProfileTest[]> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-Type', 'application/json')
            .send({
                query: `query Query($owner: ID!) {
                    profileByOwner(owner: $owner) {
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
                        follows {
                            id
                            user_name
                            email
                        }
                    }
                }`,
                variables: {
                    owner: ownerId,
                },
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                }
                const profiles = response.body.data.profileByOwner;
                expect(profiles).toBeInstanceOf(Array);
                profiles.forEach((profile: ProfileTest) => {
                    expect(profile).toHaveProperty('id');
                    expect(profile).toHaveProperty('owner');
                    expect(profile).toHaveProperty('avatar');
                    expect(profile).toHaveProperty('cover');
                    expect(profile).toHaveProperty('about');
                    expect(profile).toHaveProperty('location');
                    expect(profile).toHaveProperty('interests');
                    expect(profile).toHaveProperty('follows');
                });
                resolve(profiles);
            }
            );
    });
};

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
                    expect(profile).toHaveProperty('id');
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

const updateProfile = async (url: string | Function, profile: ProfileTest, token: string): Promise<ProfileTest> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: `mutation UpdateProfile($id: ID!, $avatar: String, $cover: String, $about: String, $location: String, $interests: [String], $follows: [ID]) {
                    updateProfile(id: $id, avatar: $avatar, cover: $cover, about: $about, location: $location, interests: $interests, follows: $follows) {
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
                        follows {
                            id
                            user_name
                            email
                        }
                    }
                }`,
                variables: profile
            })
            .expect(200, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    const profileUpdated = res.body.data.updateProfile;
                    expect(profileUpdated).toHaveProperty('id');
                    expect(profileUpdated).toHaveProperty('owner');
                    expect(profileUpdated.owner).toHaveProperty('id');
                    expect(profileUpdated.owner).toHaveProperty('user_name');
                    expect(profileUpdated.owner).toHaveProperty('email');
                    expect(profileUpdated).toHaveProperty('avatar');
                    expect(profileUpdated).toHaveProperty('cover');
                    expect(profileUpdated).toHaveProperty('about');
                    expect(profileUpdated).toHaveProperty('location');
                    expect(profileUpdated).toHaveProperty('interests');
                    expect(profileUpdated).toHaveProperty('follows');
                    expect(profileUpdated.follows).toBeInstanceOf(Array);
                    expect(profileUpdated.follows[0]).toHaveProperty('id');
                    expect(profileUpdated.follows[0]).toHaveProperty('user_name');
                    expect(profileUpdated.follows[0]).toHaveProperty('email');
                    expect(profileUpdated.about).toBe(profile.about);
                    expect(profileUpdated.location).toBe(profile.location);
                    expect(profileUpdated.interests).toBeInstanceOf(Array);
                    expect(profileUpdated.interests[0]).toBe(profile.interests![0]);
                    expect(profileUpdated.follows[0].id).not.toBeNull();
                    resolve(profileUpdated);
                }
            }
            );
    });
};

const deleteProfile = async (url: string | Function, id: string, token: string): Promise<ProfileTest> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: `mutation DeleteProfile($deleteProfileId: ID!) {
                    deleteProfile(id: $deleteProfileId) {
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
                        follows {
                            id
                            user_name
                            email
                        }
                    }
                }`,
                variables: {deleteProfileId: id}
            })
            .expect(200, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    const profile = res.body.data.deleteProfile;
                    expect(profile).toHaveProperty('id');
                    expect(profile).toHaveProperty('owner');
                    expect(profile.owner).toHaveProperty('id');
                    expect(profile.owner).toHaveProperty('user_name');
                    expect(profile.owner).toHaveProperty('email');
                    expect(profile).toHaveProperty('avatar');
                    expect(profile).toHaveProperty('cover');
                    expect(profile).toHaveProperty('about');
                    expect(profile).toHaveProperty('location');
                    expect(profile).toHaveProperty('interests');
                    expect(profile).toHaveProperty('follows');
                    resolve(profile);
                }
            }
            );
    });
};

export {postFile, postProfile, updateProfile, deleteProfile, getProfiles, getProfileById, getProfileByOwner};
