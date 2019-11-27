from rest_framework import serializers

from core.models import Genre, Platform, Developer, Publisher


class GenreSerializer(serializers.ModelSerializer):
    """Serializer for genre objects"""

    class Meta:
        model = Genre
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
