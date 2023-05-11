from django.urls import path

from . import views

urlpatterns = [
	path('get_cast/<int:movieId>', views.get_cast, name='get_cast'),
]
