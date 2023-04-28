import request from 'supertest';
import {PictureTest} from '../src/interfaces/Picture';

const getPictures = async (url: string | Function): Promise<PictureTest[]> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-Type', 'application/json')
            .send({
                query: `query Query {
                    pictures {
                        id
                        title
                        description
                        filename
                    }
                }`,
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                }
                const pictures = response.body.data.pictures;
                expect(pictures).toBeInstanceOf(Array);
                pictures.forEach((picture: PictureTest) => {
                    expect(picture).toHaveProperty('id');
                    expect(picture).toHaveProperty('title');
                    expect(picture).toHaveProperty('description');
                    expect(picture).toHaveProperty('filename');
                });
                resolve(pictures);
            }
            );
    }
    );
};

const getPictureById = async (url: string | Function, id: string): Promise<PictureTest> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-Type', 'application/json')
            .send({
                query: `query Query($pictureByIdId: ID!) {
                    pictureById(id: $pictureByIdId) {
                        id
                        title
                        description
                        filename
                    }
                }`,
                variables: {
                    pictureByIdId: id,
                },
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                }
                const picture = response.body.data.pictureById;
                expect(picture).toHaveProperty('id');
                expect(picture).toHaveProperty('title');
                expect(picture).toHaveProperty('description');
                expect(picture).toHaveProperty('filename');
                resolve(picture);
            }
            );
    });
}

const getPictureByOwner = async (url: string | Function, owner: string): Promise<PictureTest[]> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-Type', 'application/json')
            .send({
                query: `query Query($pictureByOwnerOwner: ID!) {
                    pictureByOwner(owner: $pictureByOwnerOwner) {
                        id
                        title
                        description
                        filename
                    }
                }`,
                variables: {
                    owner: owner,
                },
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                }
                const pictures = response.body.data.pictureByOwner;
                expect(pictures).toBeInstanceOf(Array);
                pictures.forEach((picture: PictureTest) => {
                    expect(pictures[0]).toHaveProperty('id');
                    expect(pictures[0]).toHaveProperty('title');
                    expect(pictures[0]).toHaveProperty('description');
                    expect(pictures[0]).toHaveProperty('filename');
                });
                resolve(pictures);
            }
            );
    });
}

const postPicture = async (url: string | Function, picture: PictureTest, token: string): Promise<PictureTest> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: `mutation Mutation($title: String!, $description: String!, $filename: String!) {
                    createPicture(title: $title, description: $description, filename: $filename) {
                        id
                        title
                        description
                        filename
                        owner {
                            id
                            user_name
                            email
                        }
                    }
                }`,
                variables: picture,
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                }
                const picture = response.body.data.createPicture;
                expect(picture).toHaveProperty('id');
                expect(picture).toHaveProperty('title');
                expect(picture).toHaveProperty('description');
                expect(picture).toHaveProperty('filename');
                resolve(picture);
            }
            );
    });
}

const updatePicture = async (url: string | Function, picture: PictureTest, token: string): Promise<PictureTest> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: `mutation Mutation($id: ID!, $title: String, $description: String) {
                    updatePicture(id: $id, title: $title, description: $description) {
                        id
                        title
                        description
                        filename
                        owner {
                            id
                            user_name
                            email
                        }
                    }
                }`,
                variables: picture,
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                }
                const picture = response.body.data.updatePicture;
                expect(picture).toHaveProperty('id');
                expect(picture).toHaveProperty('title');
                expect(picture).toHaveProperty('description');
                expect(picture).toHaveProperty('filename');
                resolve(picture);
            }
            );
    });
}

const deletePicture = async (url: string | Function, id: string, token: string): Promise<PictureTest> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: `mutation Mutation($deletePictureId: ID!) {
                    deletePicture(id: $deletePictureId) {
                        id
                        title
                        description
                        filename
                    }
                }`,
                variables: {
                    deletePictureId: id,
                },
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                }
                const picture = response.body.data.deletePicture;
                expect(picture).toHaveProperty('id');
                expect(picture).toHaveProperty('title');
                expect(picture).toHaveProperty('description');
                expect(picture).toHaveProperty('filename');
                resolve(picture);
            }
            );
    });
}

export {getPictures, getPictureById, getPictureByOwner, postPicture, updatePicture, deletePicture}