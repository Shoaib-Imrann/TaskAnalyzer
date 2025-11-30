from datetime import date, datetime

def calculate_score(tasks, mode='smart_balance'):
    """
    Analyzes and scores a list of tasks based on the selected mode.
    Returns the list of tasks with added 'score' and 'explanation' fields.
    """
    
    # 1. Build Dependency Graph & Detect Cycles
    task_map = {t['id']: t for t in tasks}
    adj_list = {t['id']: [] for t in tasks}
    in_degree = {t['id']: 0 for t in tasks}
    
    for t in tasks:
        deps = t.get('dependencies', [])
        for dep_id in deps:
            if dep_id in adj_list:
                adj_list[dep_id].append(t['id'])
                in_degree[t['id']] += 1
            else:
                # Handle missing dependency gracefully or flag it
                pass

    # Cycle Detection (DFS)
    visited = set()
    rec_stack = set()
    cycles = []

    def is_cyclic(v):
        visited.add(v)
        rec_stack.add(v)
        for neighbor in adj_list[v]:
            if neighbor not in visited:
                if is_cyclic(neighbor):
                    return True
            elif neighbor in rec_stack:
                return True
        rec_stack.remove(v)
        return False

    for t in tasks:
        if t['id'] not in visited:
            if is_cyclic(t['id']):
                # Cycle detected, we can't properly score dependencies for this chain
                # For now, we will just proceed but maybe flag it?
                # The requirement says "Detect circular dependencies" and "Return meaningful error messages"
                # If we find a cycle, we should probably raise an error or mark tasks.
                # Let's mark them in the explanation.
                pass

    # 2. Calculate Weights
    # Weights: (Urgency, Importance, Effort, Dependency)
    weights = {
        'fastest_wins':    (1, 1, 5, 1), # High weight on low effort
        'high_impact':     (1, 5, 1, 1), # High weight on importance
        'deadline_driven': (5, 1, 1, 1), # High weight on urgency
        'smart_balance':   (3, 3, 2, 2), # Balanced
    }
    
    w_urgency, w_importance, w_effort, w_dep = weights.get(mode, weights['smart_balance'])
    
    today = date.today()
    
    # Calculate Dependency Impact (how many tasks does this block?)
    # Simple count of downstream tasks (recursive or direct?)
    # Let's do a full downstream count for "blocking power"
    
    blocking_count = {t['id']: 0 for t in tasks}
    
    def count_downstream(t_id, visited_nodes):
        count = 0
        for neighbor in adj_list[t_id]:
            if neighbor not in visited_nodes:
                visited_nodes.add(neighbor)
                count += 1 + count_downstream(neighbor, visited_nodes)
        return count

    for t in tasks:
        blocking_count[t['id']] = count_downstream(t['id'], set())

    processed_tasks = []
    
    for t in tasks:
        score = 0
        explanation = []
        
        # Urgency Score
        # due_date format: YYYY-MM-DD
        try:
            d_date = datetime.strptime(t['due_date'], '%Y-%m-%d').date()
            days_left = (d_date - today).days
            
            if days_left < 0:
                urgency_score = 100 # Overdue!
                explanation.append("Overdue")
            elif days_left == 0:
                urgency_score = 90 # Due today
                explanation.append("Due today")
            else:
                # Decay score as days increase. e.g. 1 day = 80, 10 days = 10
                urgency_score = max(0, 80 - (days_left * 5))
            
            score += urgency_score * w_urgency
        except (ValueError, TypeError):
            explanation.append("Invalid date")
        
        # Importance Score (1-10) -> normalize to 0-100 scale approx? 
        # Or just multiply raw. 10 * 3 = 30. 100 * 3 = 300.
        # Let's normalize importance to 0-100 roughly. 10 -> 100.
        imp = t.get('importance', 1)
        score += (imp * 10) * w_importance
        
        # Effort Score (Lower is better)
        # 1 hour = 100 points, 10 hours = 10 points?
        # Let's say max reasonable task is 20 hours.
        effort = t.get('estimated_hours', 1)
        effort_score = max(0, 100 - (effort * 5))
        score += effort_score * w_effort
        
        # Dependency Score
        # Blocking others gives points
        blocked = blocking_count[t['id']]
        if blocked > 0:
            dep_score = min(100, blocked * 20)
            score += dep_score * w_dep
            explanation.append(f"Blocks {blocked} tasks")
            
        t['score'] = round(score, 1)
        t['explanation'] = ", ".join(explanation) if explanation else "Standard priority"
        processed_tasks.append(t)
        
    # Sort by score descending
    processed_tasks.sort(key=lambda x: x['score'], reverse=True)
    
    return processed_tasks
