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
![Login](readme/login.svg)

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
![Register](readme/register.svg)

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
