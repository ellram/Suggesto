from rest_framework import serializers
from .models import Todo, Suggestion

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ('id', 'title', 'description', 'completed')


class SuggestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Suggestion
        fields = (
            'id',
            'title',
            'description',
            'resolved',
            'created_at',
            'updated_at',
        )