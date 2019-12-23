from rest_framework import viewsets, mixins

from core.models import Genre, Theme, Platform, Developer, Publisher, Game

from gig import serializers


class BaseGameAttrViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    """Base viewset for game attributes"""

    def get_queryset(self):
        """Return objects"""
        assigned_only = bool(self.request.query_params.get('assigned_only'))
        queryset = self.queryset
        if assigned_only:
            queryset = queryset.filter(game__isnull=False)

        return queryset.order_by('-name')


class GenreViewSet(BaseGameAttrViewSet):
    """View genres in the database"""
    queryset = Genre.objects.all()
    serializer_class = serializers.GenreSerializer


class ThemeViewSet(BaseGameAttrViewSet):
    queryset = Theme.objects.all()
    serilizer_class = serializers.ThemeSerilalizer


class PlatformViewSet(BaseGameAttrViewSet):
    """View platforms in the database"""
    queryset = Platform.objects.all()
    serializer_class = serializers.PlatformSerializer


class DeveloperViewSet(BaseGameAttrViewSet):
    """View developers in the database"""
    queryset = Developer.objects.all()
    serializer_class = serializers.DeveloperSerializer


class PublisherViewSet(BaseGameAttrViewSet):
    """View publishers in the database"""
    queryset = Publisher.objects.all()
    serializer_class = serializers.PublisherSerializer


class GameViewSet(viewsets.ModelViewSet):
    """View games in the database"""
    queryset = Game.objects.all()
    serializer_class = serializers.GameSerializer
    filterset_fields = {
       'first_release_date': ['exact', 'lte', 'gte']
    }

    def _params_to_ints(self, qs):
        """Convert a list of string IDs to a list of integers"""
        return [int(str_id) for str_id in qs.split(',')]

    def get_queryset(self):
        """Retrieve the games"""
        genres = self.request.query_params.get('genres')
        platforms = self.request.query_params.get('platforms')
        developers = self.request.query_params.get('developers')
        publishers = self.request.query_params.get('publishers')
        igdb_ids = self.request.query_params.get('igdb_ids')
        queryset = self.queryset

        if genres:
            genre_ids = self._params_to_ints(genres)
            queryset = queryset.filter(genres__id__in=genre_ids)
        if platforms:
            platform_ids = self._params_to_ints(platforms)
            queryset = queryset.filter(platforms__id__in=platform_ids)
        if developers:
            developer_ids = self._params_to_ints(developers)
            queryset = queryset.filter(developers__id__in=developer_ids)
        if publishers:
            publisher_ids = self._params_to_ints(publishers)
            queryset = queryset.filter(publishers__id__in=publisher_ids)
        if igdb_ids:
            igdb_ids_arr = self._params_to_ints(igdb_ids)
            queryset = queryset.filter(igdb_id__in=igdb_ids_arr)

        return queryset.distinct()

    def get_serializer_class(self):
        """Return appropriate serializer class"""
        if self.action == 'retrieve':
            return serializers.GameDetailSerializer

        return self.serializer_class
