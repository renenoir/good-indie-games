from django.urls import reverse
from django.test import TestCase

from rest_framework import status
from rest_framework.test import APIClient

from core.models import Platform

from gig.serializers import PlatformSerializer


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
        self.assertEqual(res.data, serializer.data)
