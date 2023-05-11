from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
# from django.contrib.sessions.models import Session
from django.utils import timezone
from django.conf import settings

from movies.models import Movie

# Create your models here.

class UserManager(BaseUserManager):
    def create_user(self, name, email, password):
        if not name:
            raise ValueError("Last name not inputted")
        if not email:
            raise ValueError("Email must be inputted")
        if not password:
            raise ValueError("Password must be inputted")
        
        account = self.model(name=name, email=self.normalize_email(email))
        account.set_password(password)
        account.save(using=self._db)
        return account

    def create_superuser(self, name, email, password):
        account = self.create_user(name, email, password)
        account.admin = True
        account.is_staff = True
        account.save(using=self._db)
        return account
        
class User(AbstractBaseUser):
    email = models.EmailField(verbose_name=("Email Address"), unique=True)
    name = models.CharField(max_length=255, blank=True, null=True, default="")
    is_staff = models.BooleanField(default=False)
    join_date = models.DateTimeField(default=timezone.now)
    watchlist = models.ManyToManyField(Movie)
    banned = models.ManyToManyField(settings.AUTH_USER_MODEL)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    objects = UserManager()

    def __str__(self):
        return f"Name: {self.name} Email: {self.email} Join: {self.join_date} Staff: {self.is_staff}"

    def get_email(self):
        return self.email
    
    def get_name(self):
        return self.name

    def get_perms(self):
        return self.is_staff
    