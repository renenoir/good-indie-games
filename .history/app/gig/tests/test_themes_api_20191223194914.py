from django.urls import reverse
from django.test import TestCase

from rest_framework import status
from rest_framework.test import APIClient

from core.models import Theme, Game

from gig.serializers import ThemeSerializer

import datetime

THEMES_URL = reverse('gig:theme-list')


class ThemesApiTests(TestCase):
    """Test the themes API"""

    def setUp(self):
        self.client = APIClient()

    def test_retrieve_themes_list(self):
        """Test retrieving a list of themes"""
        Theme.objects.create(name='Fantasy')
        Theme.objects.create(name='Survival')

        res = self.client.get(THEMES_URL)

        themes = Theme.objects.all().order_by('-name')
        serializer = ThemeSerializer(themes, many=True)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(serializer.data, res.data)

    def test_retrieve_themes_assigned_to_games(self):
        """Test filtering themes by those assigned to games"""
        theme1 = Theme.objects.create(name='Horror')
        theme2 = Theme.objects.create(name='Sandbox')

        game = Game.objects.create(
            igdb_id=12,
            name='Limbo',
            summary='Some summary',
            rating=85,
            first_release_date=datetime.datetime.fromtimestamp(1317945600),
            websites=['https://limbo.net/',
                      'https://twitter.com/Limbo'],
            similar_games=['inside', 'Terraria']
        )
        game.themes.add(theme1)

        res = self.client.get(THEMES_URL)

        serializer1 = ThemeSerializer(theme1)
        serializer2 = ThemeSerializer(theme2)
        self.assertIn(serializer1.data, res.data)
        self.assertNotIn(serializer2.data, res.data)
