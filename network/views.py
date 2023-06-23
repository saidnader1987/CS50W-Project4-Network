import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
############
from django.views.decorators.csrf import csrf_exempt
############

from .models import User, Post


def index(request):

    return render(request, "network/index.html")

# Route to add a post
############
@csrf_exempt
############
@login_required
def post(request):
    
    # Posting must be via POST
    if request.method != "POST":
        return JsonResponse({"message": "POST request required."}, status=400)
    
    # get data from request's body
    data = json.loads(request.body)

    # Check if data contains the required keys for creating a post
    keys = ["content"]
    test = all(key in data.keys() for key in keys)
    if not test:
        return JsonResponse({"message": "POST data needs to have the following structure: {'content':<post_content>}"}, status=400)
    
    # Preventing adding an empty post
    if data["content"] == "":
        return JsonResponse({"message": "Can not add an empty post"}, status=400)

    # add poster to data
    poster = User.objects.get(username=request.user)
    data["poster"] = poster

    # create post object
    post = Post(**data)

    # save post
    post.save()

    return JsonResponse({"post": post.serialize(), "message": "Post added successfully."}, status=201)


def posts(request):

    # Getting the type of query or setting it to "all" if no query stated
    query = request.GET.get("q", "all")

    # Get all posts for query
    if query == "all":
        posts = Post.objects.all()
    elif query == "following":
        # User must be authenticated
        if request.user.is_authenticated:
            # Getting the users that the request user follows
            following = request.user.following.all()
            posts = Post.objects.filter(poster__in=following)
        # User not authenticated
        else:
            return JsonResponse({"message": "User must be logged in to view this page"}, status=400)
    # Assume username is provided
    else:
        try:
            user = User.objects.get(username=query)
            # Get posts for username
            posts = Post.objects.filter(poster = user)
        except User.DoesNotExist:
            return JsonResponse({"message": "Incorrect query. Usage: /posts?q=all&page=<num_page> (for all posts), /posts?q=following&page=<num_page> (for posts of people a user follows), /posts?q=<username>&page=<num_page> (for posts of a particular user)"}, status=404)

    # Getting all posts in reverse chronologial order
    posts = posts.order_by("-timestamp").all()

    # django's paginator: 10 posts per page
    p = Paginator(posts, 10)
    pages = p.num_pages

    # getting the requested page from the request object or setting it to "1" if no page stated
    page = request.GET.get("page", 1)
    try:
        page = int(page)
    except ValueError:
        page = 1

    # Checking if requested page is greater than number of pages
    if page > pages:
        return JsonResponse({"message": "Page requested does not exist"}, status=404)
    # getting posts form the requested page
    else:
        results = p.page(page)

    # Check if user is logged
    logged = True if request.user.is_authenticated else False
    username = request.user.username if request.user.is_authenticated else ""

    # Likes and following
    if logged:
        user = request.user
        user_likes = Post.objects.filter(liked_by = user).all()
        user_follows = user.following.all()
    else: 
        user_likes = []
        user_follows = []
    
    return JsonResponse({"posts": [post.serialize() for post in results],"username": username, "logged": f"{logged}", "user_likes":[post.id for post in user_likes] , "user_follows": [user.username for user in user_follows] , "page": page, "pages": pages}, safe=False)


def profile(request, username):
    # Query for requested username
    try:
        user = User.objects.get(username=username)
        # Get user's followers
        followers = user.followers.all()
        # Get user's followed user
        following = user.following.all()

        # # Get posts in reverse chronological order for username
        # posts = Post.objects.filter(poster = user)
        # # django's paginator
        # p = Paginator(posts, 1)
        # pages = p.num_pages
        # # getting the requested page from the request object or setting it to "1" if no page stated
        # page = int(request.GET.get("page","1"))
        # # Checking if requested page is greater than number of pages
        # if page > pages:
        #     return JsonResponse({"error": "Page requested does not exist"})
        # # getting posts form the requested page
        # else:
        #     results = p.page(page)
        # # Check if user is logged
        # logged = True if request.user.is_authenticated else False


        return JsonResponse(
            {
            "username": username, 
            "following": len(following),
            "followers": len(followers)
            }, safe=False)
    except User.DoesNotExist:
        return JsonResponse({"message": "Profile not found."}, status=404)
    

# Route to edit a post
############
@csrf_exempt
############
@login_required
def edit(request):
    if request.method == "PUT":
        data = json.loads(request.body)

        # Check if data contains the required keys for editing a post
        keys = ["content", "id"]
        test = all(key in data.keys() for key in keys)
        if not test:
            return JsonResponse({"message": "PUT data needs to have the following structure: {'content':<post_content>, 'id':<post_id>}"}, status=400)
        content = data.get("content")
        post_id = data.get("id")

        # Preventing editing an empty post
        if data["content"] == "":
            return JsonResponse({"message": "Can not save an empty post"}, status=400)

        # ensure request user is owner of post
        poster = User.objects.get(username=request.user)
        try:
            post = Post.objects.get(poster=poster, id=post_id)
            post.content = content
            post.save()
        except Post.DoesNotExist:
            return JsonResponse({"message": "Cannot edit post since it doesn't belong to user"}, status=400)
    else:
        return JsonResponse({
            "message": "PUT request required."
        }, status=400)
    return JsonResponse({"message": "Post edited succesfully", "id":post_id, "content": content }, status=200)


# Route to like a post
############
@csrf_exempt
############
@login_required
def like(request):
    if request.method == "PUT":
        # get user
        user = request.user
        data = json.loads(request.body)
        # Check if data contains the required keys for liking a post
        keys = [ "id"]
        test = all(key in data.keys() for key in keys)
        if not test:
            return JsonResponse({"message": "PUT data needs to have the following structure: {'id':<post_id>}"}, status=400)

        post_id = data.get("id")
        # try to get post by id
        try:
            post = Post.objects.get(id = post_id)
            # check to see if post is already liked by user
            if user in post.liked_by.all():
                # unlike
                post.liked_by.remove(user)
            else:
                # like
                post.liked_by.add(user)
            likes = len(post.liked_by.all())
        except Post.DoesNotExist:
            return JsonResponse({"message": "Invalid post"}, status=400)
    else:
        return JsonResponse({
            "message": "PUT request required."
        }, status=400)
    return JsonResponse({"post_id": post.id, "likes": likes}, status=200)

# Route to follow someone
############
@csrf_exempt
############
@login_required
def follow(request):
    if request.method == "PUT":
        # get user
        user = User.objects.get(username=request.user)

        # get user to follow
        data = json.loads(request.body)
        # Check if data contains the required keys for editing a post
        keys = ["username"]
        test = all(key in data.keys() for key in keys)
        if not test:
            return JsonResponse({"message": "PUT data needs to have the following structure: {'username':<username>}"}, status=400)
        user_to_follow_username = data.get("username")
        
        # try to get user to follow
        try:
            user_to_follow = User.objects.get(username = user_to_follow_username)
            # prevent user from following himself
            if user == user_to_follow:
                return JsonResponse({"message": "It's not possible to follow yourself"}, status=404)
            # check to see if user_to_follow is already followed by user
            if user_to_follow in user.following.all():
                # unfollow
                user.following.remove(user_to_follow)
            else:
                # follow
                user.following.add(user_to_follow)
            followers = len(user_to_follow.followers.all())
        except User.DoesNotExist:
            return JsonResponse({"message": "Invalid username"}, status=400)
    else:
        return JsonResponse({
            "message": "PUT request required."
        }, status=400)
    return JsonResponse({"username": user_to_follow_username, "followers": followers  }, status=200)


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        # request.POST is a dict containing form data
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
