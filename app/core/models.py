from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, \
                                        PermissionsMixin


class UserManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):
        """Cteates and saves a new user"""
        if not email:
            raise ValueError('User must have an email address')
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password):
        """Creates and saves a new super user"""
        user = self.create_user(email, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user


class User(AbstractBaseUser, PermissionsMixin):
    """Custom user model that supports using email instead of username"""
    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'


class Genre(models.Model):
    """Genre of a game"""
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Platform(models.Model):
    """Platform for a game"""
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Developer(models.Model):
    """Developer of a game"""
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Publisher(models.Model):
    """Publisher of a game"""
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Game(models.Model):
    """Game object"""
    name = models.CharField(max_length=255)
    summary = models.CharField(max_length=2000)
    rating = models.IntegerField()
    first_release_date = models.IntegerField()
    websites = ArrayField(models.CharField(max_length=255),
                          blank=True, null=True)
    similar_games = ArrayField(models.CharField(max_length=255),
                               blank=True, null=True)
    cover = models.CharField(max_length=255, blank=True)
    genres = models.ManyToManyField('Genre')
    platforms = models.ManyToManyField('Platform')
    developers = models.ManyToManyField('Developer')
    publishers = models.ManyToManyField('Publisher')

    def __str__(self):
        return self.name, self.summary
