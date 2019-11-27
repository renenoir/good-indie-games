from rest_framework import viewsets, mixins

from core.models import Genre, Platform, Developer, Publisher

from gig import serializers


class BaseGameAttrViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    """Base viewset for game attributes"""

    def get_queryset(self):
        """Return objects"""
        return self.queryset.order_by('-name')


class GenreViewSet(BaseGameAttrViewSet):
    """Manage genres in the database"""
    queryset = Genre.objects.all()
    serializer_class = serializers.GenreSerializer


class PlatformViewSet(BaseGameAttrViewSet):
    """Manage platforms in the database"""
    queryset = Platform.objects.all()
    serializer_class = serializers.PlatformSerializer


class DeveloperViewSet(BaseGameAttrViewSet):
    """Manage developers in the database"""
    queryset = Developer.objects.all()
    serializer_class = serializers.DeveloperSerializer


class PublisherViewSet(BaseGameAttrViewSet):
    """Manage publishers in the database"""
    queryset = Publisher.objects.all()
    serializer_class = serializers.PublisherSerializer
