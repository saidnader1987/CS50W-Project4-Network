
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API routes
    path("posts", views.posts, name="posts"),
    path("post", views.post, name="post"),
    path("edit", views.edit, name="edit"),
    path("like", views.like, name="like"),
    path("profile/<str:username>", views.profile, name = "profile"),
    path("follow", views.follow, name = "follow"),
]
