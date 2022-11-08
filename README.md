# Blog API
This is an api for a blogging app

---
<details>
    <summary>
     <h2>Requirements</h2>
    </summary>

1. Users should have a first_name, last_name, email, password, (you can add other attributes you want to store about the user)
2. A user should be able to sign up and sign in into the blog app
3. Use JWT as authentication strategy and expire the token after 1 hour
4. A blog can be in two states; draft and published
5. Logged in and not logged in users should be able to get a list of published blogs created
6. Logged in and not logged in users should be able to to get a published blog
7. Logged in users should be able to create a blog.
8. When a blog is created, it is in draft state
9. The owner of the blog should be able to update the state of the blog to published
10. The owner of a blog should be able to edit the blog in draft or published state
11. The owner of the blog should be able to delete the blog in draft or published state
12. The owner of the blog should be able to get a list of their blogs.

    a. The endpoint should be paginated

    b. It should be filterable by state

13. Blogs created should have title, description, tags, author, timestamp, state, read_count, reading_time and body.
14. The list of blogs endpoint that can be accessed by both logged in and not logged in users should be paginated,

    a. default it to 20 blogs per page.

    b. It should also be searchable by author, title and tags.

    c. It should also be orderable by read_count, reading_time and timestamp

15. When a single blog is requested, the api should return the user information(the author) with the blog. The read_count of the blog too should be updated by 1
16. Come up with any algorithm for calculating the reading_time of the blog.
17. Write tests for all endpoints
</details>

Note:
The owner of the blog should be logged in to perform actions
Use the MVC pattern

---
## Setup
- Install NodeJS, mongodb
- pull this repo
- update env with example.env
- run `npm run start:dev`
- run `npm run test` to test

---
## Base URL
- https://pda-blog-api.cyclic.app


## Models
---

### User
| field  |  data_type | constraints  |
|---|---|---|
|  firstname | string  |  required|
|  lastname  |  string |  required  |
|  email     | string  |  required, unique, index |
|  password |   string |  required  |
|  articles |  ref - Users |  |


### Blog
| field  |  data_type | constraints  |
|---|---|---|
|  title |  string |  required, unique, index |
|  description |  string |   |
|  tags | array |   |
|  author | ref - Blog |  |
|  timestamp |  date |  |
|  state | string |  required, enum: ['draft', 'published'], default:'draft'|
|  readCount |  number, default:0 |    |
|  readingTime | string |  |
|  body | string |  required  |



## APIs
---

### Signup User

- Route: /auth/signup
- Method: POST
- Body: 
```
{
  "email": "doe@example.com",
  "password": "Password1",
  "firstname": "jon",
  "lastname": "doe",
}
```

- Responses

Success
```
{
    "message": "Signup successful",
    "user": {
        "firstname": "jon",
        "lastname": "doe",
        "email": "doe@example.com",
    }
}
```
---
### Login User

- Route: /auth/login
- Method: POST
- Body: 
```
{
  "email": "doe@example.com",
  "password": "Password1",
}
```

- Responses

Success
```
{
    "message": "Login successful",
    "token": "sjlkafjkldsfjsdntehwkljyroyjohtenmntiw"
}
```

---
### Create Article

- Route: /author/blog
- Method: POST
- Header
    - Authorization: Bearer {token}
- Body: 
```
{
    "title": "testing the routes",
    "body": "This is the body of the article",
    "description": "An article",
    "tags": "blog,test"
}
```

- Responses

Success
```
{
    "message": "Article created successfully",
    "article": {
        "title": "testing the routes",
        "description": "An article",
        "tags": [
            "blog",
            "test"
        ],
        "author": "6366b10174282b915e1be028",
        "timestamp": "2022-11-05T20:52:40.573Z",
        "state": "draft",
        "readCount": 0,
        "readingTime": "1 min",
        "body": "This is the body of the article",
        "_id": "6366cd18b34b65410bc391db"
    }
}
```
---
### Change Article State

- Route: author/blog/edit/state/:articleId
- Method: PATCH
- Header
    - Authorization: Bearer {token}
- Body: 
```
{
    "state": "published"
}
```
- Responses

Success
```
{
    "message": "State successfully updated",
    "article": {
        "_id": "6366cd18b34b65410bc391db",
        "title": "testing the routes",
        "description": "An article",
        "tags": [
            "blog",
            "test"
        ],
        "author": "6366b10174282b915e1be028",
        "timestamp": "2022-11-05T21:17:16.965Z",
        "state": "published",
        "readCount": 0,
        "readingTime": "1 min",
        "body": "This is the body of the article",
        "__v": 0
    }
}
```
---

### Edit Article 

- Route: author/blog/edit/:articleId
- Method: PATCH
- Header
    - Authorization: Bearer {token}
- Body: 
```
{
    "title": "We Are Still Testing The Routes",
    "body": "This is the body of the article. I hope you enjoyed reading it.",
    "description": "An updated article",
    "tags": "blog,test,edit"
}
```
- Responses

Success
```
{
    "message": "Article successfully edited and saved",
    "article": {
        "_id": "6366cd18b34b65410bc391db",
        "title": "We Are Still Testing The Routes",
        "description": "An updated article",
        "tags": [
            "blog",
            "test",
            "edit"
        ],
        "author": "6366b10174282b915e1be028",
        "timestamp": "2022-11-05T21:27:22.516Z",
        "state": "published",
        "readCount": 0,
        "readingTime": "1 min",
        "body": "This is the body of the article. I hope you enjoyed reading it.",
        "__v": 0
    }
}
```
---

### Delete Article 

- Route: author/blog/delete/:articleId
- Method: DELETE
- Header
    - Authorization: Bearer {token}
- Responses

Success
```
{
    "message": "Article successfully deleted"
}
```
---

### Get All Articles Created By The Logged In User

- Route: /author/blog
- Method: GET
- Header:
    - Authorization: Bearer {token}
- Query params: 
    - page (default: 1)
    - per_page (default: 20)
    - order_by (default: timestamp)
    - order (options: asc | desc, default: asc)
    - state
- Responses

Success
```
{
    "message": "Request successful",
    "articles": [
        {
            "_id": "6366b10174282b915e1be03e",
            "title": "An Article",
            "description": "just another article",
            "tags": [
                "test",
                "new"
            ],
            "author": "6366b10174282b915e1be028",
            "timestamp": "2022-11-05T20:48:51.881Z",
            "state": "published",
            "readCount": 83,
            "readingTime": "1 min",
            "body": "WORK IJN",
            "__v": 2
        },
        {
            "_id": "6366cd18b34b65410bc391db",
            "title": "We Are Still Testing The Routes",
            "description": "An updated article",
            "tags": [
                "blog",
                "test",
                "edit"
            ],
            "author": "6366b10174282b915e1be028",
            "timestamp": "2022-11-05T21:27:22.516Z",
            "state": "published",
            "readCount": 0,
            "readingTime": "1 min",
            "body": "This is the body of the article. I hope you enjoyed reading it.",
            "__v": 1
        }
    ]
}
```
---

### Get All Published Articles

- Route: /blog
- Method: GET
- Query params: 
    - page (default: 1)
    - per_page (default: 20)
    - order_by (options: timestamp | reading_time | read_count, default: timestamp,reading_time,read_count)
    - order (options: asc | desc, default: asc)
    - author,
    - title,
    - tag
- Responses

Success
```
{
    "message": "Request successful",
    "articles": [
        {
            "_id": "6366b10174282b915e1be03e",
            "title": "An Article",
            "description": "just another article",
            "tags": [
                "test",
                "new"
            ],
            "author": "6366b10174282b915e1be028",
            "timestamp": "2022-11-05T20:48:51.881Z",
            "state": "published",
            "readCount": 83,
            "readingTime": "1 min",
            "body": "WORK IJN",
            "__v": 2
        },
        {
            "_id": "6366cd18b34b65410bc391db",
            "title": "We Are Still Testing The Routes",
            "description": "An updated article",
            "tags": [
                "blog",
                "test",
                "edit"
            ],
            "author": "6366b10174282b915e1be028",
            "timestamp": "2022-11-05T21:27:22.516Z",
            "state": "published",
            "readCount": 0,
            "readingTime": "1 min",
            "body": "This is the body of the article. I hope you enjoyed reading it.",
            "__v": 1
        }
    ]
}
```
---

### Get Article

- Route: /blog/:articleId
- Method: GET
- Responses

Success
```
{
    "message": "Request successful",
    "article": {
        "_id": "6366cd18b34b65410bc391db",
        "title": "We Are Still Testing The Routes",
        "description": "An updated article",
        "tags": [
            "blog",
            "test",
            "edit"
        ],
        "author": {
            "_id": "6366b10174282b915e1be028",
            "firstname": "Clark",
            "lastname": "Boyer",
            "email": "Cleo27@hotmail.com"
        },
        "timestamp": "2022-11-05T21:27:22.516Z",
        "state": "published",
        "readCount": 1,
        "readingTime": "1 min",
        "body": "This is the body of the article. I hope you enjoyed reading it.",
        "__v": 1
    }
}
```

...

## Contributor
- Precious Abubakar
----------------
