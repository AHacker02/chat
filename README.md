# iMesssage - Clone using SignalR, React, Redux

## Purpose

The purpose of this poject is to demonstrate the use of **SignalR** in a real-time chat application.

## Scope

User should be able to perform the following actions:-

1. Login and Register to the application.
2. Search other users
3. Send personal messages to users
4. Get user current status
5. Create groups
6. Add/Remove members

## Features

### Login

* As a user I should be able to enter email and passwrod to login to the application.
* As a user I should be able to use Google signin to login to the application

1. **Design**  
![Login](https://raw.githubusercontent.com/AHacker02/chat/6b1d30c311e6a3d67b1c6a1ac49ff3c501163006/readme/Login.svg)

2. **Validations**

    Validate    |   Error Message
    ------------|----------------
    Required Fields : Email, Password   |   $FieldName cannot be empty
    Email not in system |   Email does not exist. Please register if you are new
    Wrong email/password    |   Email or Password is incorrect

3. **API**

    * URL: api/auth/login
        * Method: GET
        * Params: email, password
        * Success Response:  

        ```json
        {user:{UserDetails},token:JWT token}
        ```

        * Error Response:
        *
        * Code:401
        * Message:  Email/Password is incorrect /You have registered using Google. Please use Google login below

### Register

* As a user I should be able to register to the application.
* As a user I should be able to use Google account to register to the application

1. **Design**  
![Register](https://raw.githubusercontent.com/AHacker02/chat/6b1d30c311e6a3d67b1c6a1ac49ff3c501163006/readme/Register.svg)

2. **Validations**

    Validate    |   Error Message
    ------------|----------------
    Required Fields : First Name,Last Name,Email, Password   |   $FieldName cannot be empty
    Email already in system |   Email already in use. Please login or use another email
    Password Min Length 8   | Password needs to be minimum 8 characters

3. **API**

    * URL: api/auth/register
        * Method: POST
        * Params:  

        ```json
        {
            firstName: $firstName,
            lastName: $lastName,
            email: $email,
            password: $password
        }
        ```

        * Success Response: 201
        * Error Response: 400
    * URL: api/auth/check-email
        * Method: GET
        * Params: email
        * Success Response: Email already in use. Please login or use another email/ Email does not exist. Please register if you are new.
        * Error Response: 404

### Search User

* As a user I should be able to search all users using First name, Last Name and Email
* Search results should exclude current user and useres already present in context (users in contact list or users already added in group )

1. **Design**  
![Search](https://raw.githubusercontent.com/AHacker02/imessage-clone/ea504bbf9f37b257d7313abfe6c01e8f0f297a81/readme/Search.svg)

2. **API**

    * URL: api/auth/search-user
        * Method: GET
        * Params: userSearch, maxResults, page
        * Response: [{UserDeatils}]

### Create new One-One / Group Conversation

* As a user I should be able create new One-One conversation after searching user
* As a user I should be able to create new Group conversation

    1. **Design**
        ![Conversation](https://raw.githubusercontent.com/AHacker02/imessage-clone/ea504bbf9f37b257d7313abfe6c01e8f0f297a81/readme/Conversation.svg)

    2. **API**
        * URL: api/chat/create-group
            * Method: POST
            * Params:  

            ```json  
            {
                Name:$groupName
                Users:[$userIds]
            }
            ```

            * Response:  

            ```json
            {
                data:{Id,Name,Status}
            }
            ```

### Send Message

* As a user I should be able to send messages to individual users
* As a user I should be able to read messages from a user

1. **Design**
    * Send Message  
    ![SendMessage](https://raw.githubusercontent.com/AHacker02/imessage-clone/ea504bbf9f37b257d7313abfe6c01e8f0f297a81/readme/Search.svg)
