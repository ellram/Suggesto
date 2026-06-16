from django.contrib import admin
from .models import Todo, Suggestion

class TodoAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'completed')

# Register your models here.

class SuggestionAdmin(admin.ModelAdmin):
    list_display = ('title', 'resolved', 'created_at', 'updated_at')


admin.site.register(Todo, TodoAdmin)
admin.site.register(Suggestion, SuggestionAdmin)