from django.urls import reverse
from django.test import TestCase

from rest_framework import status
from rest_framework.test import APIClient

from core.models import Publisher, Game

from gig.serializers import PublisherSerializer

import datetime


PUBLISHERS_URL = reverse('gig:publisher-list')


class PublishersApiTests(TestCase):
    """Test the publishers API"""

    def setUp(self):
        self.client = APIClient()

    def test_retrieve_publishers_list(self):
        """Test retrieving a list of publishers"""
        Publisher.objects.create(name='Microsoft')
        Publisher.objects.create(name='Devolver Digital')

        res = self.client.get(PUBLISHERS_URL)

        publishers = Publisher.objects.all().order_by('-name')
        serializer = PublisherSerializer(publishers, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_retrieve_publishers_assigned_to_games(self):
        """Test filtering publishers by those assigned to games"""
        publisher1 = Publisher.objects.create(name='BlitWorks')
        publisher2 = Publisher.objects.create(name='IMGN.PRO')
        game = Game.objects.create(
            name='Minecraft',
            summary='Some summary',
            rating=85,
            first_release_date=datetime.datetime.fromtimestamp(1317945600),
            websites=['https://minecraft.net/',
                      'https://twitter.com/Minecraft'],
            similar_games=['Fez', 'Terraria']
        )
        game.publishers.add(publisher1)

        res = self.client.get(PUBLISHERS_URL, {'assigned_only': 1})

        serializer1 = PublisherSerializer(publisher1)
        serializer2 = PublisherSerializer(publisher2)
        self.assertIn(serializer1.data, res.data)
        self.assertNotIn(serializer2.data, res.data)
