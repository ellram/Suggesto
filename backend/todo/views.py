from django.shortcuts import render
from rest_framework import viewsets
from .serializers import SuggestionSerializer
from .models import Suggestion
 
class SuggestionView(viewsets.ModelViewSet):
    serializer_class = SuggestionSerializer
    queryset = Suggestion.objects.all().order_by('-created_at')