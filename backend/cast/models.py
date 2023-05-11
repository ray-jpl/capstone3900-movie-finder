from django.db import models

from movies.models import Movie
# Create your models here.

class People(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, default="")
    born = models.IntegerField(default="")
    died = models.IntegerField(default="")
    image = models.CharField(max_length=9999999, default="")

class Cast(models.Model):
    id = models.AutoField(primary_key=True)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    person = models.ForeignKey(People, on_delete=models.CASCADE)
    job = models.CharField(max_length=255, default="Cast")