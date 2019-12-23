from django.urls import reverse
from django.test import TestCase

from rest_framework import status
from rest_framework.test import APIClient

from core.models import Theme, Game

from gig.serializers import ThemeSerializer

import datetime