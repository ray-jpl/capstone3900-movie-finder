from django.urls import path, include

from . import views

urlpatterns = [
    path("register/", views.register_post, name="register"),
    path("login/", views.login_post, name="login"),
    path("logout/", views.user_logout, name="logout"),
    path("session/", views.user_session, name="session"),
    path("", views.profile, name="index"),
    path("profile/<int:userId>", views.profile, name="profile"),
    path("watchlist/<int:userId>", views.watchlist, name="watchlist"),
    path("blacklist", views.blacklist, name="blacklist"),
    path("blacklist/<int:userId>", views.get_blacklist, name="get_blacklist"),
    path("watchlistIdsOnly/<int:userId>", views.watchlist_ids_only, name="watchlist"),
    path("profileTitle/<int:userId>", views.profileTitle, name="profileTitle"),
]