from django.urls import reverse
from django.test import TestCase

from rest_framework import status
from rest_framework.test import APIClient

from core.models import Developer, Game

from gig.serializers import DeveloperSerializer

import datetime


DEVELOPERS_URL = reverse('gig:developer-list')


class DevelopersApiTests(TestCase):
    """Test the developers API"""

    def setUp(self):
        self.client = APIClient()

    def test_retrieve_developers_list(self):
        """Test retrieving a list of developers"""
        Developer.objects.create(name='Mojang')
        Developer.objects.create(name='Bioware')

        res = self.client.get(DEVELOPERS_URL)

        developers = Developer.objects.all().order_by('-name')
        serializer = DeveloperSerializer(developers, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['results'], serializer.data)

    def test_retrieve_developers_assigned_to_games(self):
        """Test filtering developers by those assigned to games"""
        developer1 = Developer.objects.create(name='Fullbright')
        developer2 = Developer.objects.create(name='Frictional Games')
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
        game.developers.add(developer1)

        res = self.client.get(DEVELOPERS_URL, {'assigned_only': 1})

        serializer1 = DeveloperSerializer(developer1)
        serializer2 = DeveloperSerializer(developer2)
        self.assertIn(serializer1.data, res.data['results'])
        self.assertNotIn(serializer2.data, res.data['results'])
