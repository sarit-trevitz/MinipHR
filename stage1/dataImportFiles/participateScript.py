import pandas as pd
import re
import random

# 1. טעינת הנתונים מהקבצים
roles_df = pd.read_csv('roles_data.csv')
has_assignments_df = pd.read_csv('has_assignments_final.csv')

# מיפוי עובדים לתפקידים (שמות התפקידים)
# נחבר את טבלת השיבוצים (has) עם טבלת התפקידים (roles) כדי לדעת מה התפקיד של כל Eid
employee_roles = pd.merge(has_assignments_df, roles_df, on='rid')

# 2. חילוץ האירועים מקובץ ה-SQL
events = []
# ביטוי רגולרי לשליפת EVid ו-EVtype מתוך פקודות ה-INSERT
insert_pattern = re.compile(r"VALUES\s*\(\s*(\d+)\s*,\s*'[^']*'\s*,\s*'[^']*'\s*,\s*\d+\s*,\s*'([^']*)'\s*\)", re.IGNORECASE)

with open('insert_events.sql', 'r', encoding='utf-8') as f:
    for line in f:
        match = insert_pattern.search(line)
        if match:
            events.append({
                'evid': int(match.group(1)),
                'evtype': match.group(2).lower()
            })

# 3. לוגיקת התאמה (Mapping)
# פונקציה שבודקת אם עובד מתאים לאירוע לפי שם התפקיד שלו
def is_eligible(role_name, event_type):
    role_name = role_name.lower()
    
    if "all staff" in event_type or "all employees" in event_type:
        return True
    
    if "managers only" in event_type or "mgmt" in event_type:
        manager_keywords = ["manager", "director", "head of", "lead", "supervisor"]
        return any(key in role_name for key in manager_keywords)
    
    if "sales" in event_type:
        sales_keywords = ["sales", "floor", "associate", "salesperson"]
        return any(key in role_name for key in sales_keywords)
    
    if "warehouse" in event_type or "logistics" in event_type:
        logistics_keywords = ["warehouse", "forklift", "inventory", "stock", "delivery", "route", "fleet"]
        return any(key in role_name for key in logistics_keywords)
    
    if "hr" in event_type or "admin" in event_type:
        hr_keywords = ["hr", "recruitment", "welfare", "payroll", "admin"]
        return any(key in role_name for key in hr_keywords)
    
    if "marketing" in event_type:
        marketing_keywords = ["marketing", "social media", "content", "media planner"]
        return any(key in role_name for key in marketing_keywords)

    return False # ברירת מחדל - לא מתאים אם אין התאמה ספציפית

# 4. יצירת 1000 הקשרים
participate_data = []
seen_pairs = set()

while len(participate_data) < 1000:
    # הגרלת אירוע רנדומלי
    event = random.choice(events)
    # הגרלת עובד רנדומלי
    employee = employee_roles.sample(n=1).iloc[0]
    
    pair = (event['evid'], employee['eid'])
    
    # בדיקה שהעובד מתאים לתפקיד ושלא יצרנו כבר את הקשר הזה
    if pair not in seen_pairs and is_eligible(employee['rname'], event['evtype']):
        participate_data.append(pair)
        seen_pairs.add(pair)

# 5. שמירה לקובץ CSV
df_output = pd.DataFrame(participate_data, columns=['EVid', 'Eid'])
df_output.to_csv('participate.csv', index=False)

print(f"Successfully generated participate.csv with {len(df_output)} logical assignments.")