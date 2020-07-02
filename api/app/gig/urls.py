from django.urls import path, include
from rest_framework.routers import DefaultRouter

from gig import views


router = DefaultRouter()
router.register('genres', views.GenreViewSet)
router.register('themes', views.ThemeViewSet)
router.register('platforms', views.PlatformViewSet)
router.register('developers', views.DeveloperViewSet)
router.register('publishers', views.PublisherViewSet)
router.register('saved', views.SavedViewSet, basename='saved')
router.register('games', views.GameViewSet)

app_name = 'gig'

urlpatterns = [
    path('', include(router.urls)),
]
