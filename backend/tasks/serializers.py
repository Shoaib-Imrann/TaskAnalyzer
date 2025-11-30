from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        
    # Optional: Add custom validation for circular dependencies here if we were saving to DB one by one,
    # but for bulk analysis we handle it in the view/scoring logic.
