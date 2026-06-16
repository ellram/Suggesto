from django.shortcuts import render
from rest_framework import viewsets
from .serializers import TodoSerializer, SuggestionSerializer
from .models import Todo, Suggestion
 
# Create your views here.

class TodoView(viewsets.ModelViewSet):
    serializer_class = TodoSerializer
    queryset = Todo.objects.all()
 
class SuggestionView(viewsets.ModelViewSet):
    serializer_class = SuggestionSerializer
    queryset = Suggestion.objects.all().order_by('-created_at')