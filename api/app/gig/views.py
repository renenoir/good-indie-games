from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import filters

from django_filters.rest_framework import DjangoFilterBackend
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

from core.models import Genre, Theme, Platform, Developer, Publisher, Game, \
                                                                      User
from gig import serializers


class BaseGameAttrViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    """Base viewset for game attributes"""
    authentication_classes = (TokenAuthentication,)

    def get_queryset(self):
        """Return objects"""
        assigned_only = bool(self.request.query_params.get('assigned_only'))
        queryset = self.queryset
        if assigned_only:
            queryset = queryset.filter(game__isnull=False)

        return queryset.order_by('-name').distinct()

    @method_decorator(cache_page(60))
    def dispatch(self, *args, **kwargs):
        return super(BaseGameAttrViewSet, self).dispatch(*args, **kwargs)


class GenreViewSet(BaseGameAttrViewSet):
    """View genres in the database"""
    queryset = Genre.objects.all()
    serializer_class = serializers.GenreSerializer


class ThemeViewSet(BaseGameAttrViewSet):
    """View themes in the database"""
    queryset = Theme.objects.all()
    serializer_class = serializers.ThemeSerializer


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


class BaseGameViewSet(viewsets.ModelViewSet):
    """Base viewset for game"""
    serializer_class = serializers.GameSerializer
    authentication_classes = (TokenAuthentication,)
    filter_backends = [DjangoFilterBackend, filters.SearchFilter,
                       filters.OrderingFilter]
    filterset_fields = {
       'first_release_date': ['exact', 'lte', 'gte'],
       'rating': ['exact', 'lte', 'gte']
    }
    ordering_fields = ['rating', 'first_release_date', 'popularity']

    def _params_to_ints(self, qs):
        """Convert a list of string IDs to a list of integers"""
        return [int(str_id) for str_id in qs.split(',')]

    def get_queryset(self):
        """Retrieve the games"""
        genres = self.request.query_params.get('genres')
        themes = self.request.query_params.get('themes')
        platforms = self.request.query_params.get('platforms')
        developers = self.request.query_params.get('developers')
        publishers = self.request.query_params.get('publishers')
        ids = self.request.query_params.get('ids')
        adult = self.request.query_params.get('is_adult')
        queryset = self.queryset

        if genres:
            genre_ids = self._params_to_ints(genres)
            queryset = queryset.filter(genres__id__in=genre_ids)
        if themes:
            theme_ids = self._params_to_ints(themes)
            queryset = queryset.filter(themes__id__in=theme_ids)
        if platforms:
            platform_ids = self._params_to_ints(platforms)
            queryset = queryset.filter(platforms__id__in=platform_ids)
        if developers:
            developer_ids = self._params_to_ints(developers)
            queryset = queryset.filter(developers__id__in=developer_ids)
        if publishers:
            publisher_ids = self._params_to_ints(publishers)
            queryset = queryset.filter(publishers__id__in=publisher_ids)
        if ids:
            ids_arr = self._params_to_ints(ids)
            queryset = queryset.filter(id__in=ids_arr)

        if adult != 'y':
            try:
                queryset = queryset.exclude(themes__name='Erotic')
            except Theme.DoesNotExist:
                None

        if self.saved:
            return queryset.filter(user=self.request.user)
        return queryset.distinct()


class GameViewSet(BaseGameViewSet):
    """View games in the database"""
    saved = False
    queryset = Game.objects.order_by('-rating')
    search_fields = ['name', 'genres__name', 'themes__name']

    def get_serializer_class(self):
        """Return appropriate serializer class"""
        if self.action == 'retrieve':
            return serializers.GameDetailSerializer

        return self.serializer_class

    @action(methods=['GET', 'POST'], detail=True, url_path='add-to-saved')
    def add_to_saved(self, request, pk=None):
        """Add a game to saved"""
        game = self.get_object()

        try:
            user = User.objects.get(id=self.request.user.id)
        except User.DoesNotExist:
            return Response(
                status=status.HTTP_401_UNAUTHORIZED
            )
        else:
            user.saved.add(game)
            return Response(
                status=status.HTTP_200_OK
            )

    @action(methods=['GET', 'POST'], detail=True, url_path='remove-from-saved')
    def remove_from_saved(self, request, pk=None):
        """Remove a game from saved"""
        game = self.get_object()

        try:
            user = User.objects.get(id=self.request.user.id)
        except User.DoesNotExist:
            return Response(
                status=status.HTTP_401_UNAUTHORIZED
            )
        else:
            user.saved.remove(game)
            return Response(
                status=status.HTTP_200_OK
            )

    @method_decorator(cache_page(60))
    def dispatch(self, *args, **kwargs):
        return super(GameViewSet, self).dispatch(*args, **kwargs)


class SavedViewSet(BaseGameViewSet):
    """View saved in the database"""
    saved = True
    queryset = Game.objects.all()
    permission_classes = (IsAuthenticated,)
