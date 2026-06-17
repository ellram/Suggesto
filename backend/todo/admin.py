from django.contrib import admin
from .models import Suggestion
#registrering av modellen Suggestion i admin for å kunne administrere forslagene via Django admin-grensesnittet
@admin.register(Suggestion)
class SuggestionAdmin(admin.ModelAdmin):
    #elementer i admin grensesnittet
    list_display = ("title", "status", "created_at", "updated_at")
    list_filter = ("status",)
    search_fields = ("title", "description")