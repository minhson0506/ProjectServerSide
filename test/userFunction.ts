import request from 'supertest';
import expect from 'expect';
import {UserTest} from "../src/interfaces/User";
import {LoginMessageResponse} from '../src/interfaces/ResponseMessage';
import ErrorResponse from '../src/interfaces/ErrorResponse';
import randomstring from 'randomstring';

// create users
const postUser = async (url: string | Function, user: UserTest): Promise<UserTest> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-Type', 'application/json')
            .send({
                query: `mutation Mutation($user: UserInput!) {
                    register(user: $user) {
                        message
                        user {
                            id
                            user_name
                            email
                        }
                    }
                }`,
                variables: {
                    user: {
                        user_name: user.user_name,
                        email: user.email,
                        password: user.password,
                    },
                },
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                }
                const userData = response.body.data.register;
                expect(userData).toHaveProperty('message');
                expect(userData).toHaveProperty('user');
                expect(userData.user).toHaveProperty('id');
                expect(userData.user.user_name).toBe(user.user_name);
                expect(userData.user.email).toBe(user.email);
                resolve(response.body.data.register);
            }
            );
    });
};

const getUsers = async (url: string | Function): Promise<UserTest[]> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-Type', 'application/json')
            .send({
                query: `query Query {
                    users {
                        id
                        user_name
                        email
                    }
                }`,
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                }
                const users = response.body.data.users;
                expect(users).toBeInstanceOf(Array);
                expect(users[0]).toHaveProperty('id');
                expect(users[0]).toHaveProperty('user_name');
                expect(users[0]).toHaveProperty('email');
                resolve(users);
            }
            );
    });
};

const getSingleUser = async (url: string | Function, id: string): Promise<UserTest> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-Type', 'application/json')
            .send({
                query: `query Query($userByIdId: ID!) {
                    userById(id: $userByIdId) {
                        id
                        user_name
                        email
                    }
                }`,
                variables: {
                    userByIdId: id,
                },
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                }
                const user = response.body.data.userById;
                expect(user).toHaveProperty('id');
                expect(user).toHaveProperty('user_name');
                expect(user).toHaveProperty('email');
                resolve(user);
            }
            );
    });
};

const login = async (url: string | Function, user: UserTest): Promise<LoginMessageResponse> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-Type', 'application/json')
            .send({
                query: `mutation Mutation($credentials: Credentials!) {
                    login(credentials: $credentials) {
                        message
                        token
                        user {
                            id
                            user_name
                            email
                        }
                    }
                }`,
                variables: {
                    credentials: {
                        username: user.email,
                        password: user.password,
                    },
                },
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const loginData = response.body.data.login;
                    expect(loginData).toHaveProperty('message');
                    expect(loginData).toHaveProperty('token');
                    expect(loginData).toHaveProperty('user');
                    expect(loginData.user).toHaveProperty('id');
                    expect(loginData.user.user_name).toBe(user.user_name);
                    expect(loginData.user.email).toBe(user.email);
                    resolve(response.body.data.login);
                }
            }
            );
    });
};

const loginBrute = async (url: string | Function, user: UserTest): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-Type', 'application/json')
            .send({
                query: `mutation Mutation($credentials: Credentials!) {
                    login(credentials: $credentials) {
                        message
                        token
                        user {
                            id
                            user_name
                            email
                        }
                    }
                }`,
                variables: {
                    credentials: {
                        username: user.email,
                        password: user.password,
                    },
                },
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    if (
                        response.body.errors?.[0]?.message ===
                        "You are trying to access 'login' too often"
                    ) {
                        console.log('brute blocked', response.body.errors[0].message);
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            });
    });
};

const putUser = (url: string | Function, token: string) => {
    return new Promise((resolve, reject) => {
        const newValue = 'Test Loser ' + randomstring.generate(7);
        request(url)
            .post('/graphql')
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .send({
                query: `mutation UpdateUser($user: UserModify!) {
                    updateUser(user: $user) {
                        message
                        user {
                            id
                            user_name
                            email
                        }
                    }
                }`,
                variables: {
                    user: {
                        user_name: newValue,
                    },
                },
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const userData = response.body.data.updateUser;
                    expect(userData).toHaveProperty('message');
                    expect(userData).toHaveProperty('user');
                    expect(userData.user).toHaveProperty('id');
                    expect(userData.user.user_name).toBe(newValue);
                    resolve(response.body.data.updateUser);
                }
            });
    });
};

const deleteUser = (
    url: string | Function,
    token: string
): Promise<ErrorResponse> => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Authorization', 'Bearer ' + token)
            .send({
                query: `mutation DeleteUser {
                    deleteUser {
                        message
                        user {
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
                } else {
                    const userData = response.body.data.deleteUser;
                    expect(userData).toHaveProperty('message');
                    expect(userData).toHaveProperty('user');
                    resolve(response.body.data.deleteUser);
                }
            });
    });
};

const checkToken = (url: string | Function, token: string) => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .send({
                query: `query Query {
                    checkToken {
                        message
                        user {
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
                } else {
                    const userData = response.body.data.checkToken;
                    expect(userData).toHaveProperty('message');
                    expect(userData).toHaveProperty('user');
                    expect(userData.user).toHaveProperty('id');
                    resolve(response.body.data.checkToken);
                }
            });
    });
};

const searchUser = (url: string | Function, search: string, token: string) => {
    return new Promise((resolve, reject) => {
        request(url)
            .post('/graphql')
            .set('Content-type', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .send({
                query: `query Query($search: String!) {
                    searchUsers(search: $search) {
                        id
                        user_name
                        email
                    }
                }`,
                variables: {
                    search: search,
                },
            })
            .expect(200, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    const userDatas = response.body.data.searchUsers;
                    expect(userDatas).toBeInstanceOf(Array);
                    userDatas.forEach((userData: UserTest) => {
                        expect(userData).toHaveProperty('id');
                        expect(userData).toHaveProperty('user_name');
                        expect(userData).toHaveProperty('email');
                    });
                    resolve(userDatas);
                }
            });
    });
};

export {postUser, getUsers, getSingleUser, login, loginBrute, putUser, deleteUser, checkToken, searchUser};