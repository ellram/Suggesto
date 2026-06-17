from django.db import models

class Suggestion(models.Model):
    #mulige statuser som et forslag kan ha, burde her hatt med "gjennomgått" hvis jeg hadde hatt mer tid
    STATUS_CHOICES = [
        ("new", "New"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    #statusfelt som begrenser verier til STATUS_CHOICES, deafult er new for nye forslag
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default="new"
    )

    #for å kunne se tidspunkter for oppdaterin på kortene eller forslagene
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    