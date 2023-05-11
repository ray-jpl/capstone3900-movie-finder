from django.urls import include, path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
	path('get_movies', views.get_movies, name='get_movies'),
    path("get_details/<int:movieId>", views.get_details, name = 'get_details'),
	path("get_forum/<int:movieId>/<int:reviewerId>", views.get_forum, name = 'get_forum'),
    path("post_forum/<int:movieId>", views.post_forum, name = "post_forum"),
    path('top_director/<int:directorId>', views.top_director, name="top_director"),
    path('top_writer/<int:writerId>', views.top_writer, name='top_writer'),
    path('top_cast/<int:castId>', views.top_cast, name='top_cast'),
    path('top_genre/<str:genreName>', views.top_genre, name='top_genre'),
    path("recommendations/<int:movieId>", views.get_recommendations, name='get_recommendations'),
    path("search/<str:query>", views.search, name="search")
]
