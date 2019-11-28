from django.test import TestCase
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient

from core.models import Game, Genre, Platform, Developer, Publisher

from gig.serializers import GameSerializer, GameDetailSerializer


GAMES_URL = reverse('gig:game-list')


def detail_url(game_id):
    """Return game detail URL"""
    return reverse('gig:game-detail', args=[game_id])


def sample_genre(name='Adventure'):
    """Create and return a sample genre"""
    return Genre.objects.create(name=name)


def sample_platform(name='PC'):
    """Create and return a sample platform"""
    return Platform.objects.create(name=name)


def sample_developer(name='Bioware'):
    """Create and return a sample developer"""
    return Developer.objects.create(name=name)


def sample_publisher(name='EA'):
    """Create and return a sample publisher"""
    return Publisher.objects.create(name=name)


def sample_game(**params):
    """Create and return a sample game"""
    defaults = {
        'name': 'Mass Effect',
        'summary': 'best game ever',
        'rating': 90,
        'first_release_date': 1317945600
    }
    defaults.update(params)

    return Game.objects.create(**defaults)


class GameApiTests(TestCase):
    """Test games API"""

    def setUp(self):
        self.client = APIClient()

    def test_retrieve_games(self):
        """Test retrieving a list of games"""
        sample_game(name='Bioshock')
        sample_game()

        res = self.client.get(GAMES_URL)

        games = Game.objects.all().order_by('id')
        serializer = GameSerializer(games, many=True)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_view_game_detail(self):
        """Test viewing a game detail"""
        game = sample_game()
        game.genres.add(sample_genre())
        game.platforms.add(sample_platform())
        game.developers.add(sample_developer())
        game.publishers.add(sample_publisher())

        url = detail_url(game.id)
        res = self.client.get(url)

        serializer = GameDetailSerializer(game)
        self.assertEqual(res.data, serializer.data)

    def test_filter_games_by_genres(self):
        """Test returning games with specific genres"""
        game1 = sample_game(name='Limbo')
        game2 = sample_game(name='Dishonored')
        genre1 = sample_genre(name='Indie')
        genre2 = sample_genre(name='Adventure')
        game1.genres.add(genre1)
        game2.genres.add(genre2)
        game3 = sample_game(name='Watch Dogs')

        res = self.client.get(
            GAMES_URL,
            {'genres': f'{genre1.id},{genre2.id}'}
        )

        serializer1 = GameSerializer(game1)
        serializer2 = GameSerializer(game2)
        serializer3 = GameSerializer(game3)
        self.assertIn(serializer1.data, res.data)
        self.assertIn(serializer2.data, res.data)
        self.assertNotIn(serializer3.data, res.data)

    def test_filter_games_by_platforms(self):
        """Test returning games with specific platforms"""
        game1 = sample_game(name='Limbo')
        game2 = sample_game(name='Dishonored')
        platform1 = sample_platform(name='PC')
        platform2 = sample_platform(name='PS4')
        game1.platforms.add(platform1)
        game2.platforms.add(platform2)
        game3 = sample_game(name='Watch Dogs')

        res = self.client.get(
            GAMES_URL,
            {'platforms': f'{platform1.id},{platform2.id}'}
        )

        serializer1 = GameSerializer(game1)
        serializer2 = GameSerializer(game2)
        serializer3 = GameSerializer(game3)
        self.assertIn(serializer1.data, res.data)
        self.assertIn(serializer2.data, res.data)
        self.assertNotIn(serializer3.data, res.data)

    def test_filter_games_by_developers(self):
        """Test returning games with specific developers"""
        game1 = sample_game(name='Limbo')
        game2 = sample_game(name='Dishonored')
        developer1 = sample_developer(name='Playdead')
        developer2 = sample_developer(name='Arkane Studios')
        game1.developers.add(developer1)
        game2.developers.add(developer2)
        game3 = sample_game(name='Watch Dogs')

        res = self.client.get(
            GAMES_URL,
            {'developers': f'{developer1.id},{developer2.id}'}
        )

        serializer1 = GameSerializer(game1)
        serializer2 = GameSerializer(game2)
        serializer3 = GameSerializer(game3)
        self.assertIn(serializer1.data, res.data)
        self.assertIn(serializer2.data, res.data)
        self.assertNotIn(serializer3.data, res.data)

    def test_filter_games_by_publishers(self):
        """Test returning games with specific publishers"""
        game1 = sample_game(name='Limbo')
        game2 = sample_game(name='Dishonored')
        publisher1 = sample_publisher(name='Microsoft Game Studios')
        publisher2 = sample_publisher(name='Bethesda Softworks')
        game1.publishers.add(publisher1)
        game2.publishers.add(publisher2)
        game3 = sample_game(name='Watch Dogs')

        res = self.client.get(
            GAMES_URL,
            {'publishers': f'{publisher1.id},{publisher2.id}'}
        )

        serializer1 = GameSerializer(game1)
        serializer2 = GameSerializer(game2)
        serializer3 = GameSerializer(game3)
        self.assertIn(serializer1.data, res.data)
        self.assertIn(serializer2.data, res.data)
        self.assertNotIn(serializer3.data, res.data)
