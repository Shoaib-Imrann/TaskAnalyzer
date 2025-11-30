from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Task
from .serializers import TaskSerializer
from .scoring import calculate_score

class AnalyzeTasksView(APIView):
    """
    POST /api/tasks/analyze/
    Input: list of tasks (JSON)
    Output: sorted tasks + score + explanation
    """
    def post(self, request):
        tasks_data = request.data
        if not isinstance(tasks_data, list):
            return Response({"error": "Input must be a list of tasks"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate data structure roughly (or use serializer with many=True)
        # We use serializer to validate fields but we don't save them.
        serializer = TaskSerializer(data=tasks_data, many=True)
        if not serializer.is_valid():
             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Get validated data (which are OrderedDicts)
        # We need to convert them back to dicts and ensure IDs are present for scoring if provided,
        # or generate temporary IDs if not
        # The prompt implies the input has IDs for dependencies: "dependencies": [task_ids]
        # If the input tasks don't have IDs, we can't link dependencies
        # Let's assume input has 'id' field or we assign temporary ones
        # Serializer won't validate 'id' if it's not in the input (it's read_only by default)
        
        raw_tasks = request.data
        mode = request.query_params.get('mode', 'smart_balance')
        
        # Check if IDs are present
        for i, t in enumerate(raw_tasks):
            if 'id' not in t:
                t['id'] = i + 1 # Assign temp ID if missing
        
        try:
            scored_tasks = calculate_score(raw_tasks, mode=mode)
            return Response(scored_tasks)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class SuggestTasksView(APIView):
    """
    GET /api/tasks/suggest/
    Output: top 3 tasks + explanation
    """
    def get(self, request):
        tasks = Task.objects.all()
        serializer = TaskSerializer(tasks, many=True)
        data = serializer.data
        
        mode = request.query_params.get('mode', 'smart_balance')
        
        # We need to ensure the serialized data has what scoring needs
        # Serializer output has 'id', 'dependencies' etc.
        
        try:
            scored_tasks = calculate_score(data, mode=mode)
            top_3 = scored_tasks[:3]
            return Response(top_3)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
