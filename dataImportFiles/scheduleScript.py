import pandas as pd
import random

# 1. טעינת הנתונים
# טוען את הקבצים שקישרת קודם למיפוי התפקידים
roles_df = pd.read_csv('roles_data.csv')
has_df = pd.read_csv('has_assignments_final.csv')

# מיזוג כדי לדעת איזה עובד שייך לאיזה תפקיד
employee_data = pd.merge(has_df, roles_df, on='rid')

# 2. סיווג עובדים לקבוצות לוגיות לפי שם התפקיד
def categorize_role(rname):
    rname = rname.lower()
    if any(k in rname for k in ["sales", "floor", "associate", "salesperson"]):
        return "Sales"
    if any(k in rname for k in ["manager", "director", "head of", "supervisor", "lead"]):
        return "Manager"
    if any(k in rname for k in ["warehouse", "forklift", "stock", "inventory", "delivery", "driver"]):
        return "Logistics"
    return "Office" # HR, Finance, Marketing, etc.

employee_data['Category'] = employee_data['rname'].apply(categorize_role)

# 3. הגדרת הסתברויות שיבוץ (Weights)
# ככל שהמשקל גבוה יותר, לעובד מהקטגוריה הזו יש סיכוי גבוה יותר להשתבץ למשמרת
category_weights = {
    "Sales": 10,     # משקל גבוה מאוד
    "Manager": 7,     # משקל גבוה
    "Logistics": 3,   # משקל בינוני-נמוך
    "Office": 1       # משקל נמוך מאוד
}

# יצירת רשימה של עובדים עם "שכפול" לפי המשקל שלהם
weighted_pool = []
for _, emp in employee_data.iterrows():
    weight = category_weights.get(emp['Category'], 1)
    weighted_pool.extend([emp['eid']] * weight)

# 4. יצירת 1000 שורות INSERT
sid_range = list(range(1, 20001))
insert_statements = []
seen_assignments = set()

while len(insert_statements) < 1000:
    # הגרלת עובד מהמאגר המשוקלל
    eid = random.choice(weighted_pool)
    # הגרלת משמרת
    sid = random.choice(sid_range)
    
    # מניעת כפילות (אותו עובד באותה משמרת)
    if (eid, sid) not in seen_assignments:
        seen_assignments.add((eid, sid))
        statement = f"INSERT INTO schedule (Eid, Sid) VALUES ({eid}, {sid});"
        insert_statements.append(statement)

# 5. שמירה לקובץ SQL
with open('insert_schedule.sql', 'w', encoding='utf-8') as f:
    f.write("-- Smart Schedule Assignments based on Role Categories\n")
    for line in insert_statements:
        f.write(line + "\n")

print(f"Successfully generated insert_schedule.sql with {len(insert_statements)} lines.")