from django.db import models

class Suggestion(models.Model):
    STATUS_CHOICES = [
        ("new", "New"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default="new"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    