from django.urls import reverse
from django.test import TestCase

from rest_framework import status
from rest_framework.test import APIClient

from core.models import Genre

from gig.serializers import GenreSerializer


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
