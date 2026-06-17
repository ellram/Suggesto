from rest_framework import viewsets
from .serializers import SuggestionSerializer
from .models import Suggestion
 
class SuggestionView(viewsets.ModelViewSet):
    serializer_class = SuggestionSerializer
    #her definerer jeg hva som skal hentes fra databasen og hvilke objekter dette er
    queryset = Suggestion.objects.all().order_by('-created_at')