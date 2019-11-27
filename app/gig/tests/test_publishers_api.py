from django.urls import reverse
from django.test import TestCase

from rest_framework import status
from rest_framework.test import APIClient

from core.models import Publisher

from gig.serializers import PublisherSerializer


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
