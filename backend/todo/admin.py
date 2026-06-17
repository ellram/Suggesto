from django.contrib import admin
from .models import Suggestion
class SuggestionAdmin(admin.ModelAdmin):
    list_display = ('title', 'resolved', 'created_at', 'updated_at')

admin.site.register(Suggestion, SuggestionAdmin)