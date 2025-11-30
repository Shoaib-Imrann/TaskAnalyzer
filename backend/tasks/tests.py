from django.test import TestCase
from datetime import date, timedelta
from .scoring import calculate_score

class ScoringLogicTests(TestCase):
    def setUp(self):
        self.today = date.today()
        
    def test_urgency_scoring(self):
        """Test that urgent tasks get higher scores"""
        tasks = [
            {
                "id": 1,
                "title": "Urgent Task",
                "due_date": str(self.today),
                "estimated_hours": 1,
                "importance": 5,
                "dependencies": []
            },
            {
                "id": 2,
                "title": "Later Task",
                "due_date": str(self.today + timedelta(days=10)),
                "estimated_hours": 1,
                "importance": 5,
                "dependencies": []
            }
        ]
        
        scored = calculate_score(tasks, mode='deadline_driven')
        # Urgent task should be first
        self.assertEqual(scored[0]['id'], 1)
        self.assertTrue(scored[0]['score'] > scored[1]['score'])

    def test_importance_scoring(self):
        """Test that important tasks get higher scores in high_impact mode"""
        tasks = [
            {
                "id": 1,
                "title": "Important Task",
                "due_date": str(self.today + timedelta(days=5)),
                "estimated_hours": 1,
                "importance": 10,
                "dependencies": []
            },
            {
                "id": 2,
                "title": "Low Importance Task",
                "due_date": str(self.today + timedelta(days=5)),
                "estimated_hours": 1,
                "importance": 1,
                "dependencies": []
            }
        ]
        
        scored = calculate_score(tasks, mode='high_impact')
        self.assertEqual(scored[0]['id'], 1)
        self.assertTrue(scored[0]['score'] > scored[1]['score'])

    def test_circular_dependency_handling(self):
        """Test that circular dependencies don't crash the scorer"""
        tasks = [
            {
                "id": 1,
                "title": "Task A",
                "due_date": str(self.today),
                "estimated_hours": 1,
                "importance": 5,
                "dependencies": [2]
            },
            {
                "id": 2,
                "title": "Task B",
                "due_date": str(self.today),
                "estimated_hours": 1,
                "importance": 5,
                "dependencies": [1]
            }
        ]
        
        # Should not raise RecursionError
        try:
            scored = calculate_score(tasks)
            self.assertEqual(len(scored), 2)
        except RecursionError:
            self.fail("Scoring logic hit infinite recursion on circular dependency")
