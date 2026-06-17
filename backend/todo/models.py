from django.db import models

# Create your models here.

class Suggestion(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title