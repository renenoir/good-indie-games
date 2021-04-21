from rest_framework import serializers

from core.models import Genre, Theme, Platform, Developer, Publisher, Game


class GenreSerializer(serializers.ModelSerializer):
    """Serializer for genre objects"""

    class Meta:
        model = Genre
        fields = ('id', 'name')
        read_only_fields = ('id',)


class ThemeSerializer(serializers.ModelSerializer):
    """Serializer for theme objects"""

    class Meta:
        model = Theme
        fields = ('id', 'name')
        read_only_fields = ('id',)


class PlatformSerializer(serializers.ModelSerializer):
    """Serializer for platform objects"""

    class Meta:
        model = Platform
        fields = ('id', 'name')
        read_only_fields = ('id',)


class DeveloperSerializer(serializers.ModelSerializer):
    """Serializer for developer objects"""

    class Meta:
        model = Developer
        fields = ('id', 'name')
        read_only_fields = ('id',)


class PublisherSerializer(serializers.ModelSerializer):
    """Serializer for publisher objects"""

    class Meta:
        model = Publisher
        fields = ('id', 'name')
        read_only_fields = ('id',)


class GameSerializer(serializers.ModelSerializer):
    """Serialize a game"""
    genres = GenreSerializer(many=True, read_only=True)
    themes = ThemeSerializer(many=True, read_only=True)
    platforms = PlatformSerializer(many=True, read_only=True)

    class Meta:
        model = Game
        fields = ('id', 'name', 'rating', 'popularity', 'first_release_date',
                  'cover', 'genres', 'themes', 'platforms')
        read_only_fields = ('id',)


class GameDetailSerializer(GameSerializer):
    """Serialize a game detail"""
    developers = DeveloperSerializer(many=True, read_only=True)
    publishers = PublisherSerializer(many=True, read_only=True)

    class Meta:
        model = Game
        fields = GameSerializer.Meta.fields + (
            'summary',
            'developers',
            'publishers',
            'websites',
            'similar_games_in_db',
            'slug',
        )
        read_only_fields = ('id',)
