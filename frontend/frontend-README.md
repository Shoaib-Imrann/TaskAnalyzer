# Smart Task Analyzer - Frontend

## Overview

The Smart Task Analyzer frontend provides an intuitive interface for managing and analyzing tasks with intelligent prioritization. Built with Next.js, React, and Tailwind CSS.

## Features

- **Task Management**: Add individual tasks or bulk import from JSON
- **Analysis Modes**: Choose from 4 different prioritization strategies
- **Smart Suggestions**: Get AI-powered daily task recommendations
- **Visual Indicators**: Color-coded priority badges and responsive design
- **Real-time Updates**: Live analysis with loading states and error handling

## Running the Frontend

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
pnpm start
```

The application will be available at `http://localhost:3000/tasks`

## Testing the Analyze/Suggest Flows

### Prerequisites
Ensure the backend API endpoints are running:
- `POST /api/tasks/analyze` - Task analysis endpoint
- `GET /api/tasks/suggest` - Daily suggestions endpoint

### Testing Analyze Flow

1. **Add Tasks**: Use the task form or bulk import JSON:
   ```json
   [
     {
       "title": "Complete project documentation",
       "due_date": "2024-12-31",
       "estimated_hours": 4,
       "importance": 8,
       "dependencies": []
     },
     {
       "title": "Review code changes",
       "due_date": "2024-12-25",
       "estimated_hours": 2,
       "importance": 6,
       "dependencies": ["doc-task"]
     }
   ]
   ```

2. **Select Mode**: Choose from:
   - **Fastest Wins**: Quick, easy tasks first
   - **High Impact**: High-importance tasks prioritized
   - **Deadline Driven**: Urgency-based sorting
   - **Smart Balance**: Optimal mix of factors

3. **Analyze**: Click "Analyze Tasks" to send tasks to the API
4. **Review Results**: Tasks will be re-ordered with scores and explanations

### Testing Suggest Flow

1. **Get Suggestions**: Click "Suggest Today" button
2. **View Highlights**: Suggested tasks will be highlighted in blue
3. **Auto-scroll**: Page automatically scrolls to first suggested task

## Component Structure

- `TaskForm` - Individual task creation with validation
- `BulkImport` - JSON import with error handling
- `ModeSelector` - Analysis mode dropdown
- `TaskList` - Displays sorted tasks with scores
- `PriorityBadge` - Visual priority indicators (High/Medium/Low)

## API Integration

The frontend expects these API responses:

**POST /api/tasks/analyze**
```json
{
  "tasks": [...],
  "mode": "Smart Balance"
}
```

**Response**: Array of tasks with added `score` and `explanation` fields

**GET /api/tasks/suggest**

**Response**: Array of top 3 recommended tasks

## Error Handling

- Network errors display user-friendly messages
- JSON parsing errors show specific validation issues
- Empty state handling for no tasks
- Loading states during API calls

## Accessibility

- Semantic HTML structure
- ARIA labels for form controls
- Keyboard navigation support
- Screen reader compatible
- High contrast color schemes