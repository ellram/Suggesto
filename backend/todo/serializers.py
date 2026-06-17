from rest_framework import serializers
from .models import Suggestion

#Serializer som konverterer Suggestion-modellen til JSON og tilbake igjen
class SuggestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Suggestion #kobling mot django-modellen suggestions
        #felt som kommer inn i api-responsen
        fields = (
            'id',
            'title',
            'description',
            'status',
            'created_at',
            'updated_at',
        )
        #felter som ikke endres via API så de bare er lesbare
        read_only_fields = (
            'created_at',
            'updated_at',
        )