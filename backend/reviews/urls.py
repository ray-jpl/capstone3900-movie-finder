from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
	path('get_review/<int:movieId>/<int:reviewerId>', views.get_review, name='get_review'),
    path("post_review", views.post_review, name = 'post_review'),
    path('get_rating/<int:movieId>/<int:userId>', views.get_rating, name='get_rating')
]

