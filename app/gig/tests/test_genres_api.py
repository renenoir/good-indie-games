from django.urls import reverse
from django.test import TestCase

from rest_framework import status
from rest_framework.test import APIClient

from core.models import Genre, Game

from gig.serializers import GenreSerializer

import datetime


GENRES_URL = reverse('gig:genre-list')


class GenresApiTests(TestCase):
    """Test the genres API"""

    def setUp(self):
        self.client = APIClient()

    def test_retrieve_genres_list(self):
        """Test retrieving a list of genres"""
        Genre.objects.create(name='Western')
        Genre.objects.create(name='Adventure')

        res = self.client.get(GENRES_URL)

        genres = Genre.objects.all().order_by('-name')
        serializer = GenreSerializer(genres, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_retrieve_genres_assigned_to_games(self):
        """Test filtering genres by those assigned to games"""
        genre1 = Genre.objects.create(name='Platformer')
        genre2 = Genre.objects.create(name='Horror')
        game = Game.objects.create(
            name='Minecraft',
            summary='Some summary',
            rating=85,
            first_release_date=datetime.datetime.fromtimestamp(1317945600),
            websites=['https://minecraft.net/',
                      'https://twitter.com/Minecraft'],
            similar_games=['Fez', 'Terraria']
        )
        game.genres.add(genre1)

        res = self.client.get(GENRES_URL, {'assigned_only': 1})

        serializer1 = GenreSerializer(genre1)
        serializer2 = GenreSerializer(genre2)
        self.assertIn(serializer1.data, res.data)
        self.assertNotIn(serializer2.data, res.data)
