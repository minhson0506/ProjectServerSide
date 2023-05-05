# Project Server-side Scripting Framework

[Servers app](https://sond-serverproject.azurewebsites.net/graphql)

The app is a social media platform for travelers. Users can create profiles, share their travel experiences, and connect with other travelers. The backend will be implemented with Node.js and GraphQL, using a NoSQL database (MongoDB) for CRUD functionality.

To ensure that mutations are authenticated, we will implement a JWT-based authentication system. Users will be required to log in to access certain features of the app, such as creating posts, commenting on posts, and sending direct messages to other users.

To enable real-time chat functionality, we will use the WebSocket API. Users will be able to send messages to other users in real-time, and receive push notifications when they receive a new message.

In terms of testing, we will write unit tests for the backend, covering all mutations and authentication and authorization functionality.

## Structure

<p align="center">
  <img src="https://user-images.githubusercontent.com/73076333/236406489-8f96f58f-4087-4b7c-9453-fb4e02852145.png" width="750">
  <img src="https://user-images.githubusercontent.com/73076333/236406492-cb04d6b7-814d-4f44-a0ff-f52a1c81bb79.png" width="750">
  <img src="https://user-images.githubusercontent.com/73076333/236406476-00d6e846-8874-47f6-b657-0ae7cce3772b.png" width="750">
  <img src="https://user-images.githubusercontent.com/73076333/236406484-b5efde4d-086b-44a4-b61c-563f7ce44bc3.png" width="750">
</p>

## Stack:
- NodeJS with TypeScript
- GraphQL API
- MongoDB
