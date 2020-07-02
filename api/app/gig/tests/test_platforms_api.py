from django.urls import reverse
from django.test import TestCase

from rest_framework import status
from rest_framework.test import APIClient

from core.models import Platform, Game

from gig.serializers import PlatformSerializer

import datetime


PLATFORMS_URL = reverse('gig:platform-list')


class PlatformsApiTests(TestCase):
    """Test the platforms API"""

    def setUp(self):
        self.client = APIClient()

    def test_retrieve_platforms_list(self):
        """Test retrieving a list of platforms"""
        Platform.objects.create(name='PC')
        Platform.objects.create(name='PS4 pro')

        res = self.client.get(PLATFORMS_URL)

        platforms = Platform.objects.all().order_by('-name')
        serializer = PlatformSerializer(platforms, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['results'], serializer.data)

    def test_retrieve_platforms_assigned_to_games(self):
        """Test filtering platforms by those assigned to games"""
        platform1 = Platform.objects.create(name='Switch')
        platform2 = Platform.objects.create(name='PC')
        game = Game.objects.create(
            igdb_id=1,
            name='Minecraft',
            summary='Some summary',
            rating=85,
            first_release_date=datetime.datetime.fromtimestamp(1317945600),
            websites=['https://minecraft.net/',
                      'https://twitter.com/Minecraft'],
            similar_games=['Fez', 'Terraria']
        )
        game.platforms.add(platform1)
        res = self.client.get(PLATFORMS_URL, {'assigned_only': 1})

        serailizer1 = PlatformSerializer(platform1)
        serializer2 = PlatformSerializer(platform2)
        self.assertIn(serailizer1.data, res.data['results'])
        self.assertNotIn(serializer2.data, res.data['results'])
