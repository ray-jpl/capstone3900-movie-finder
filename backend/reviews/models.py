from django.db import models
from django.conf import settings
from movies.models import Movie
# Create your models here.

class Review(models.Model):
    id = models.AutoField(primary_key=True)
    reviewer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    review = models.CharField(max_length=9999, default="")
    rating = models.DecimalField(decimal_places=1, max_digits=3, default="")