# CS50W Project 4 - Network

This project is part of Harvard University's CS50W course on Web Programming with Python and JavaScript. It's an implementation of a Twitter-like social network website for making posts and following users. For this project both the front end (using vanilla JavaScript) and back end (using Django) had to be implemented.

Video Demo: https://www.youtube.com/watch?v=pHNZjHpSvdo&t=79s

## Description

The web application serves users to make posts, follow other users, and "like" posts. The main features of the web application include:

- Creating a new post
- Viewing all posts from all users, with the most recent posts displayed first
- Visiting user profiles, displaying their followers, the people they are following, and all their posts
- Following and unfollowing users
- Viewing posts made by users the current user follows
- Pagination support for post views
- Editing user's own posts
- Liking and unliking posts

For detailed project requirements, refer to the project specifications on the CS50W course website [here](https://cs50.harvard.edu/web/2020/projects/4/network/).

## Getting Started

To run this project locally, you need Python and pip installed on your system. If you don't have Python and pip installed, visit the [official Python website](https://www.python.org/downloads/) and follow the instructions there.

A database is included in the repository for immediate use. If you wish to start with a fresh database, remember to make migrations after deleting the existing one.

1. **Install the dependencies**

```
pip install -r requirements.txt
```

2. **Run the migrations (if you deleted the existing database)**

```
python manage.py makemigrations auctions
python manage.py migrate
```

3. **Run the application**

```
python manage.py runserver
```

Then, open your browser and visit `http://localhost:8000` to see the application in action.
