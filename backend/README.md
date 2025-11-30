# Task Analyzer Backend

Django REST API for intelligent task prioritization and analysis.

## Setup

1. Create virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```


4. Run migrations:
```bash
python manage.py migrate
```

5. Start server:
```bash
python manage.py runserver
```

## API Endpoints

- `POST /api/tasks/analyze/` - Analyze and prioritize tasks
- `GET /api/tasks/suggest/` - Get top 3 task suggestions

## Features

- Smart task scoring with multiple modes
- Circular dependency detection
- Priority-based task recommendations