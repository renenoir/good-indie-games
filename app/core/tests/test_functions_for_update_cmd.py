from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

from core.management.functions.update_database import update_database
from core.models import Game, Platform, Publisher

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

    def test_update_game(self):
        """Test update game in db"""
        original_game = Game.objects.create(
            igdb_id=121,
            name='Minecraft',
            summary='Some summary',
            rating=90,
            popularity=209,
            first_release_date=datetime.datetime.fromtimestamp(1317856600),
            websites=[]
        )

        platform = Platform.objects.create(name='Linux')
        original_game.platforms.add(platform)

        publisher = Publisher.objects.create(name='Microsoft Studios')
        original_game.publishers.add(publisher)

        filename = 'core/tests/for_test.json'  # 2 games (with Minecraft)
        with open(filename) as f:
            response_dict = json.load(f)
        update_database(response_dict=response_dict)

        game = Game.objects.get(igdb_id=121)

        res = self.client.get(
            reverse('gig:game-detail', args=[game.id])
        )

        self.assertEqual(res.data['summary'], response_dict[0]['summary'])
        self.assertEqual(
            res.data['rating'],
            int(response_dict[0]['total_rating'])
        )
        self.assertEqual(
            game.popularity,
            response_dict[0]['popularity']
        )
        self.assertEqual(res.data['cover'], response_dict[0]['cover']['url'])
        self.assertEqual(
            res.data['websites'],
            list(map(
                lambda website: website['url'],
                response_dict[0]['websites']
            ))
        )
        self.assertEqual(
            list(map(
                lambda platform: platform['name'],
                res.data['platforms']
            )),
            list(map(
                lambda platform: platform['name'],
                response_dict[0]['platforms']
            ))
        )
        publishers = []
        involved_companies = response_dict[0]['involved_companies']
        for company_item in involved_companies:
            company = company_item.get('company')
            if not company_item.get('developer'):
                publishers.append(company.get("name"))
        self.assertEqual(
            list(map(
                lambda publisher: publisher['name'],
                res.data['publishers']
            )),
            publishers
        )
