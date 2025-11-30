
## Setup Instructions

Setup instructions are available in each folder:
- **Frontend**: See `frontend/README.md` for Next.js setup
- **Backend**: See `backend/README.md` for Django setup

## Demo

Watch `demo.mp4` for the functionality.

## Algorithm Explanation

I'm using a scoring system that looks at four things to figure out what you should work on next: how urgent it is, how important it is, how much effort it takes, and whether other tasks are waiting for it.

### How It Works

**Urgency**: Overdue tasks get top priority (100 points), tasks due today get 90 points, and future tasks lose 5 points per day. So something due in a week gets about 65 points.

**Importance**: You rate tasks 1-10, and we multiply by 10 to get the score. A "10" importance task gets 100 points.

**Effort**: Quick tasks get rewarded. A 1-hour task gets 100 points, but longer tasks lose 5 points per hour. This encourages you to knock out easy wins.

**Dependencies**: Tasks that unblock other work get bonus points - up to 20 points for each task they're blocking. This prevents bottlenecks.

### Four Modes

- **Fastest Wins**: Focuses on easy, quick tasks to build momentum
- **High Impact**: Prioritizes your most important work first
- **Deadline Driven**: Puts urgent, time-sensitive tasks at the top
- **Smart Balance**: Weighs everything evenly for general use

The system adds up all the scores, ranks your tasks, and explains why each one landed where it did. It also checks for circular dependencies so nothing gets stuck in an endless loop.

## Design Decisions

**Django + Next.js**: Chose Next.js for modern React with SSR. Trade-off: More complex deployment vs faster development.

**JSON Dependencies**: Stored task dependencies as JSON arrays instead of separate tables. Trade-off: Less normalized data vs simpler queries and faster development.

**Client-side Scoring**: Moved algorithm to backend for consistency. Trade-off: Extra API calls vs reliable calculations across all clients.

**Linear Scoring**: Used simple linear decay for urgency/effort vs complex curves. Trade-off: Less sophisticated weighting vs predictable, understandable results.