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