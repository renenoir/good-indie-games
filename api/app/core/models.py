from django.db import models
from django.conf import settings
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, \
                                        PermissionsMixin

from django.utils import timezone
from django.core.mail import EmailMultiAlternatives
from django.dispatch import receiver
from django.template.loader import render_to_string

from django_rest_passwordreset.signals import reset_password_token_created

from slugify import slugify


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token,
                                 *args, **kwargs):
    # send an e-mail to the user
    context = {
        'current_user': reset_password_token.user,
        'username': reset_password_token.user.name,
        'email': reset_password_token.user.email,
        'reset_password_url': "{}reset/?token={}".format(
            settings.FRONTEND_DOMAIN,
            reset_password_token.key)
    }

    # render email text
    email_html_message = render_to_string('email/user_reset_password.html',
                                          context)
    email_plaintext_message = render_to_string('email/user_reset_password.txt',
                                               context)

    msg = EmailMultiAlternatives(
        # title:
        "Password Reset for Good Indie Games",
        # message:
        email_plaintext_message,
        # from:
        settings.EMAIL_HOST_USER,
        # to:
        [reset_password_token.user.email]
    )
    msg.attach_alternative(email_html_message, "text/html")
    msg.send()


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
    saved = models.ManyToManyField('Game', blank=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'


class Genre(models.Model):
    """Genre of a game"""
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Theme(models.Model):
    """Theme of a game"""
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
    igdb_id = models.IntegerField()
    name = models.CharField(max_length=255)
    summary = models.CharField(max_length=10000)
    rating = models.IntegerField()
    popularity = models.IntegerField(null=True)
    first_release_date = models.DateTimeField(
        auto_now=False,
        auto_now_add=False,
        default=timezone.now
        )
    cover = models.CharField(max_length=255, blank=True)
    websites = ArrayField(models.CharField(max_length=255),
                          blank=True, null=True)
    similar_games = ArrayField(models.CharField(max_length=255),
                               blank=True, null=True)
    genres = models.ManyToManyField('Genre')
    themes = models.ManyToManyField('Theme')
    platforms = models.ManyToManyField('Platform')
    developers = models.ManyToManyField('Developer')
    publishers = models.ManyToManyField('Publisher')

    def similar_games_in_db(self):
        similar_games = []
        if self.similar_games:
            for game in self.similar_games:
                try:
                    similar_games.append(
                        Game.objects.get(igdb_id=int(game)).id
                    )
                except Game.DoesNotExist:
                    None
        return similar_games

    def __str__(self):
        return '{}, {}, {}'.format(self.name, self.summary, self.cover)

    def slug(self):
        return(slugify(str(self.name)))
