from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

from core.management.functions.update_database import update_database
from core.models import Game

import json
import datetime


class FunctionsForUpdateDBTests(TestCase):

    def setUp(self):
        self.client = APIClient()

    def test_update_database(self):
        """Test update database when same igdb_id"""
        filename = 'core/tests/for_test.json'  # 2 games (with Minecraft)
        with open(filename) as f:
            response_dict = json.load(f)

        game1 = Game.objects.create(
            igdb_id=121,
            name='Minecraft',
            summary='Some summary',
            rating=85,
            first_release_date=datetime.datetime.fromtimestamp(1317945600),
            websites=["https://www.youtube.com/user/TeamMojang",
                      "https://twitter.com/Minecraft"]
        )
        update_database(response_dict=response_dict)
        game2 = Game.objects.get(igdb_id=1384)  # second game in json

        res1 = self.client.get(
            reverse('gig:game-detail', args=[game1.id])
        )
        res2 = self.client.get(
            reverse('gig:game-detail', args=[game2.id])
        )
        res = self.client.get(reverse('gig:game-list'))

        self.assertEqual(len(res.data['results']), 2)
        self.assertTrue(res1.data)
        self.assertTrue(res2.data)
