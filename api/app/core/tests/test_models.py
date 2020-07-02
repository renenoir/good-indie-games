from django.test import TestCase
from django.contrib.auth import get_user_model

from core import models

import datetime


def sample_game():
    """Create a sample game"""
    return models.Game.objects.create(
            igdb_id=1,
            name='Minecraft',
            summary='Some summary',
            rating=85,
            first_release_date=datetime.datetime.fromtimestamp(1317945600),
            websites=['https://minecraft.net/',
                      'https://twitter.com/Minecraft'],
            similar_games=['Fez', 'Terraria']
        )


class ModelTests(TestCase):

    def test_create_user_with_email_successful(self):
        """Test creating a new user with an email is successful"""
        email = 'test@test.com'
        password = 'Testpass123'
        user = get_user_model().objects.create_user(
            email=email,
            password=password
        )
        self.assertEqual(user.email, email)
        self.assertTrue(user.check_password(password))

    def test_new_user_email_normalized(self):
        """Test the email for a new user is normalized"""
        email = 'test@TEST.COM'
        user = get_user_model().objects.create_user(email, 'test123')

        self.assertEqual(user.email, email.lower())

    def test_new_user_invalid_email(self):
        """Test creating user with no email raises error"""
        with self.assertRaises(ValueError):
            get_user_model().objects.create_user(None, 'test123')

    def test_create_new_superuser(self):
        """Test creating a new superuser"""
        user = get_user_model().objects.create_superuser(
            'test@test.com',
            'test123'
        )
        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_staff)

    def test_genre_str(self):
        """Test the genre string representation"""
        genre = models.Genre.objects.create(name='Shooter')

        self.assertEqual(str(genre), genre.name)

    def test_theme_str(self):
        """Test the theme string representation"""
        theme = models.Theme.objects.create(name='Fantasy')

        self.assertEqual(str(theme), theme.name)

    def test_platform_str(self):
        """Test the platform string representation"""
        platform = models.Platform.objects.create(name='Android')

        self.assertEqual(str(platform), platform.name)

    def test_developer_str(self):
        """Test the developer string representation"""
        developer = models.Developer.objects.create(name='Playdead')

        self.assertEqual(str(developer), developer.name)

    def test_publisher_str(self):
        """Test the publisher string representation"""
        publisher = models.Publisher.objects.create(name='Devolver Digital')

        self.assertEqual(str(publisher), publisher.name)

    def test_game_str(self):
        """Test the game properties string representation"""
        game = sample_game()

        self.assertEqual(str(game.name), game.name)
        self.assertEqual(str(game.summary), game.summary)

    def test_game_first_release_date_datetime(self):
        """Test the game first release date datetime representation"""
        game = sample_game()

        self.assertEqual(game.first_release_date.strftime('%Y-%m-%d'),
                         '2011-10-07')
