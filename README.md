
# API FOR REFINE HACKATHON PROJECT

This App is an Api for a Library Management App.




## API Reference

### Get all items

Base URL - https://refine-hackathon-server.onrender.com/

### Get All Books 

```http
  GET /api/allBooks
```


### Get Single Book

```http
  GET api/allBooks/singleBook/{id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of Book to fetch |



### Register New User
```http
  POST api/user/auth/register
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `firstName`      | `string` | **Required**. First Name of User |
| `lastName`      | `string` | **Required**. Last Name of User |
| `email`      | `string` | **Required**. Email address of User |
| `password`      | `string` | **Required**. Password of User |
| `address`      | `string` | **Optional**. Address of User |
| `bio`      | `string` | **Optional**. Bio of User |
| `phone Number`      | `string` | **Optional**. Phone Number of User |
| `gender`      | `string` | **Optional**. Gender of User, Can be either Male of Female |

### Login User
```http
  POST api/user/auth/login
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`      | `string` | **Required**. Emaill Address of User |
| `password`      | `string` | **Required**. Password of User |

### Get User Data
```http
  GET api/user/{email}
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `accessToken`      | `headers` | **Required**. JWT Access Token gotten at login |
| `email`      | `params` | **Required**. Email Of User |

### Update User Data
```http
  PUT api/user/{userId}
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `accessToken`      | `headers` | **Required**. JWT Access Token gotten at login |
| `field`      | `string` | **Optional**. Any other user field you wish to edit |

### Request For Book
```http
  POST api/user/request-book
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `accessToken`      | `headers` | **Required**. JWT Access Token gotten at login |
| `id`      | `string` | **Required**. Id of Book User wish to request for |
| `userId`      | `string` | **Required**. Id of User making a request |
| `promised_return_date`      | `date` | **Required**. Date The User Wishes to return book if request is granted |

### Register A New Library
```http
  POST api/library/auth/register
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `libraryName`      | `string` | **Required**. Full Name of Library |
| `email`      | `string` | **Required**. Email address of Library |
| `password`      | `string` | **Required**. Password of Library |
| `address`      | `string` | **Optional**. Address of Library |
| `about`      | `string` | **Optional**. Short Description Of Library |

### Login Library Using details
```http
  POST api/library/auth/login
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`      | `string` | **Required**. Emaill Address of Library Admin |
| `password`      | `string` | **Required**. Password of Library Admin |

### Get Library Data
```http
  GET api/user/{libraryEmail}
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `accessToken`      | `headers` | **Required**. JWT Access Token gotten at login |
| `LibraryEmail`      | `params` | **Required**. Email Of Library |
| `LibraryEmail`      | `string` | **Required**. Email Of Library |

### Update Library Data
```http
  PUT api/user/{libraryId}
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `accessToken`      | `headers` | **Required**. JWT Access Token gotten at login |
| `LibraryEmail`      | `string` | **Required**. Email Of Library |
| `field`      | `string` | **Optional**. Any other user field you wish to edit |

### Upload Book To Library
```http
  POST api/library/uploadBook
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `accessToken`      | `headers` | **Required**. JWT Access Token gotten at login |
| `LibraryEmail`      | `string` | **Required**. Email Of Library |
| `bookTitle`      | `string` | **Required**. Title Of Book |
| `bookDescription`      | `string` | **Required**. Description Of Book |
| `bookId`      | `string` | **Required**. Reference Id Of Book Peculiar to that library |
| `library_that_owns_book`      | `string` | **Required**. Id of Library trying to upload book |
| `bookImage`      | `string` | **Required**. Link to Book cover image |


### Approve Or Decline Book Request From User
```http
  POST api/library/approveOrDecline
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `accessToken`      | `headers` | **Required**. JWT Access Token gotten at login |
| `LibraryEmail`      | `string` | **Required**. Email Of Library |
| `action`      | `string` | **Required**. Action to be taken; "approve" or "decline" |
| `libraryId`      | `string` | **Required**. Id of Library |
| `bookId`      | `string` | **Required**. Id of the Book |

### Mark Book As Returned When User Returns Book
```http
  POST api/library/markAsReturned
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `accessToken`      | `headers` | **Required**. JWT Access Token gotten at login |
| `LibraryEmail`      | `string` | **Required**. Email Of Library |
| `libraryId`      | `string` | **Required**. Id of Library |
| `bookId`      | `string` | **Required**. Id of the Book |


### Fetch Refresh Token For User
```http
  GET api/refresh/user/refreshToken
```
##### Refreshes Token and returns a new token stored in cookies

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `accessToken`      | `headers` | **Required**. JWT Access Token gotten at login |
| `email`      | `string` | **Required**. Email Of User |


### Fetch Refresh Token For Library
```http
  GET api/refresh/user/refreshToken
```
##### Refreshes Token and returns a new token stored in cookies

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `accessToken`      | `headers` | **Required**. JWT Access Token gotten at login |
| `email`      | `string` | **Required**. Email Of Library |


### Logout User
```http
  GET api/logout/user
```
##### Try to delete Access Token on Frontend too

### Logout Library Admin
```http
  GET api/logout/librarian
```
##### Try to delete Access Token on Frontend too





## 🚀 About Me
I'm a full stack developer...


## Authors

- [@ok-timmy](https://www.github.com/ok-timmy)


## Tech Stack

**Client:** Refine, React, Material UI

**Server:** Node, Express




## FAQ

#### Question 1

Answer 1

#### Question 2

Answer 2


## Badges

Add badges from somewhere like: [shields.io](https://shields.io/)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)



