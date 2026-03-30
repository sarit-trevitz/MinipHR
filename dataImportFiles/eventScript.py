import random
from datetime import datetime, timedelta

# רשימות נתונים ליצירת גיוון
event_types = [
    "Managers Only", "Sales Team", "Sales Associates", 
    "All Employees", "Warehouse Staff", "Marketing & Sales", 
    "Logistics Team", "HR & Admin"
]

descriptions = [
    "Happy Hour", "Toast for Holiday", "Safety Briefing", 
    "Product Launch", "Sales Workshop", "Team Building", 
    "Strategy Session", "Inventory Count", "Customer Service", 
    "Quarterly Review", "New Store Opening", "Farewell Party"
]

def generate_sql_script(filename, start_id, end_id):
    start_date = datetime(2026, 1, 1)
    
    with open(filename, 'w', encoding='utf-8') as f:
        for ev_id in range(start_id, end_id + 1):
            # הגרלת נתונים
            ev_date = (start_date + timedelta(days=random.randint(0, 365))).strftime('%Y-%m-%d')
            ev_desc = random.choice(descriptions)
            ev_budget = random.randint(1000, 150000)
            ev_type = random.choice(event_types)
            
            # יצירת השאילתה
            sql_line = f"INSERT INTO EVENT (EVid, EVdate, EVdescription, EVbudget, EVtype) " \
                       f"VALUES ({ev_id}, '{ev_date}', '{ev_desc}', {ev_budget}, '{ev_type}');\n"
            
            f.write(sql_line)

# הרצת הפונקציה ליצירת 490 שורות (מ-11 עד 500)
generate_sql_script('insert_events.sql', 11, 500)
print("The file 'insert_events.sql' has been created successfully with 490 rows.")