from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    following = models.ManyToManyField(
        "self", blank=True, related_name="followers", symmetrical=False
    )

class Post(models.Model):
    poster = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="posts"
    )
    content = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    liked_by = models.ManyToManyField(
        "User", blank=True, related_name="likes"
    )

    def serialize(self):
        return {
            "id": self.id,
            "poster": self.poster.username,
            "content": self.content,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "likes": len([user.username for user in self.liked_by.all()]),
        }

    def __str__(self):
        return f"{self.poster}: {self.content}"


    