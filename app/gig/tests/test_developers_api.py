from django.urls import reverse
from django.test import TestCase

from rest_framework import status
from rest_framework.test import APIClient

from core.models import Developer

from gig.serializers import DeveloperSerializer


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
        self.assertEqual(res.data, serializer.data)
