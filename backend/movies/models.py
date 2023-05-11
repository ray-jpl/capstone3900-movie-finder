from django.db import models
from django.conf import settings
from django.utils import timezone

# Create your models here.

class Movie(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255, default="")
    year = models.IntegerField(default=0)
    runtime = models.IntegerField(default=0)
    description = models.TextField(max_length=99999 ,default="")
    rating = models.DecimalField(decimal_places=1, max_digits=3, default="")
    image = models.CharField(max_length=99999, default="")

class Genre(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    genre = models.CharField(max_length=255, default="")
    
class Forum(models.Model):
    id = models.AutoField(primary_key=True)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    reviewer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    message = models.TextField(max_length=99999 ,default="")
    timestamp = models.DateTimeField(default=timezone.now)

    