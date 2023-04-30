import request from 'supertest';
import {CommentTest} from '../src/interfaces/Comment';

const getComments = async (url: string | Function): Promise<CommentTest[]> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-Type', 'application/json')
            .send({
                query: `query Query {
                    comments {
                        id
                        text
                        owner {
                            id
                            user_name
                            email
                        }
                        picture {
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
                    }
                }`,
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                }
                const comments = response.body.data.comments;
                expect(comments).toBeInstanceOf(Array);
                comments.forEach((comment: Comment) => {
                    expect(comment).toHaveProperty('id');
                    expect(comment).toHaveProperty('text');
                    expect(comment).toHaveProperty('owner');
                    expect(comment).toHaveProperty('picture');
                });
                resolve(comments);
            }
            );
    }
    );
}

const getCommentById = async (url: string | Function, id: string): Promise<CommentTest> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-Type', 'application/json')
            .send({
                query: `query Query($commentByIdId: ID!) {
                    commentById(id: $commentByIdId) {
                        id
                        text
                        owner {
                            id
                            user_name
                            email
                        }
                        picture {
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
                    }
                }`,
                variables: {
                    commentByIdId: id,
                },
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                }
                const comment = response.body.data.commentById;
                expect(comment).toHaveProperty('id');
                expect(comment).toHaveProperty('text');
                expect(comment).toHaveProperty('owner');
                expect(comment).toHaveProperty('picture');
                resolve(comment);
            }
            );
    });
}

const getCommentsByPictureId = async (url: string | Function, id: string): Promise<CommentTest[]> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-Type', 'application/json')
            .send({
                query: `query Query($pictureId: ID!) {
                    commentsByPicture(pictureId: $pictureId) {
                        id
                        text
                        owner {
                            id
                            user_name
                            email
                        }
                        picture {
                            id
                            title
                            description
                            filename
                        }
                        timestamp
                    }
                }`,
                variables: {
                    pictureId: id,
                },
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                }
                const comments = response.body.data.commentsByPicture;
                expect(comments).toBeInstanceOf(Array);
                comments.forEach((comment: Comment) => {
                    expect(comment).toHaveProperty('id');
                    expect(comment).toHaveProperty('text');
                    expect(comment).toHaveProperty('owner');
                    expect(comment).toHaveProperty('picture');
                });
                resolve(comments);
            }
            );
    });
}

const getCommentsByOwnerId = async (url: string | Function, id: string): Promise<CommentTest[]> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-Type', 'application/json')
            .send({
                query: `query Query($ownerId: ID!) {
                    commentsByOwner(ownerId: $ownerId) {
                        id
                        text
                        owner {
                            id
                            user_name
                            email
                        }
                        picture {
                            id
                            title
                            description
                            filename
                        }
                        timestamp
                        }
                }`,
                variables: {
                    ownerId: id,
                },
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                }
                const comments = response.body.data.commentsByOwner;
                expect(comments).toBeInstanceOf(Array);
                comments.forEach((comment: Comment) => {
                    expect(comment).toHaveProperty('id');
                    expect(comment).toHaveProperty('text');
                    expect(comment).toHaveProperty('owner');
                    expect(comment).toHaveProperty('picture');
                });
                resolve(comments);
            }
            );
    });
}

const postComment = async (url: string | Function, comment: CommentTest, token: string): Promise<CommentTest> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: `mutation Mutation($text: String!, $picture: ID!, $timestamp: DateTime!) {
                    createComment(text: $text, picture: $picture, timestamp: $timestamp) {
                        id
                        text
                        owner {
                            id
                            user_name
                            email
                        }
                        picture {
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
                    }
                }`,
                variables: comment,
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                }
                const comment = response.body.data.createComment;
                expect(comment).toHaveProperty('id');
                expect(comment).toHaveProperty('text');
                expect(comment).toHaveProperty('owner');
                expect(comment).toHaveProperty('picture');
                resolve(comment);
            }
            );
    });
}

const updateComment = async (url: string | Function, comment: CommentTest, token: string): Promise<CommentTest> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: `mutation Mutation($updateCommentId: ID!, $text: String!, $timestamp: DateTime!) {
                    updateComment(id: $updateCommentId, text: $text, timestamp: $timestamp) {
                        id
                        text
                        owner {
                            id
                            user_name
                            email
                        }
                        picture {
                            id
                            title
                            description
                            filename
                        }
                        timestamp
                        }
                }`,
                variables: {
                    text: comment.text,
                    updateCommentId: comment.id,
                    timestamp: comment.timestamp
                }
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                }
                const comment = response.body.data.updateComment;
                expect(comment).toHaveProperty('id');
                expect(comment).toHaveProperty('text');
                expect(comment).toHaveProperty('owner');
                expect(comment).toHaveProperty('picture');
                resolve(comment);
            }
            );
    });
}

const deleteComment = async (url: string | Function, id: string, token: string): Promise<CommentTest> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: `mutation Mutation($deleteCommentId: ID!) {
                    deleteComment(id: $deleteCommentId) {
                        id
                        text
                        owner {
                            id
                            user_name
                            email
                        }
                        picture {
                            id
                            title
                            description
                            filename
                        }
                        timestamp
                        }
                }`,
                variables: {
                    deleteCommentId: id,
                }
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                }
                const comment = response.body.data.deleteComment;
                expect(comment).toHaveProperty('id');
                expect(comment).toHaveProperty('text');
                expect(comment).toHaveProperty('owner');
                expect(comment).toHaveProperty('picture');
                resolve(comment);
            }
            );
    });
}

export { getComments, getCommentById, getCommentsByPictureId, getCommentsByOwnerId, postComment, updateComment, deleteComment};
