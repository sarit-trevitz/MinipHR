
#סקריפט בשביל לקשר כל עובד לתקפיד שלו וכן המשכורת שלו
import csv
import random
import time

def generate_exact_has_data():
    num_employees = 20000
    file_path = r'C:\Tar0\has_assignments_final.csv'
    
    # פונקציית שכר לפי רמת תפקיד (היגיון עסקי)
    def get_salary(rid):
        if rid == 3: # מנהל חנות
            return random.randint(18000, 25000)
        elif rid == 2: # מנהל משמרת
            return random.randint(10500, 13500)
        elif rid == 1: # מוכר
            return random.randint(6500, 8500)
        elif rid in [4, 6, 7, 8, 9]: # צוות חנות אחר (קופאי, מחסנאי וכו')
            return random.randint(6500, 9500)
        elif rid == 10 or (136 <= rid <= 150) or (336 <= rid <= 350): # נהגים ולוגיסטיקה
            return random.randint(11000, 15000)
        else: # תפקידי מטה וניהול אזור
            return random.randint(14000, 35000)

    assignments = []
    current_eid = 1

    print("מתחיל לייצר את הרשומות לפי המכסות המדויקות...")

    # 1. יצירת 500 מנהלי חנויות (RID 3)
    for _ in range(500):
        assignments.append([current_eid, 3, get_salary(3)])
        current_eid += 1

    # 2. יצירת 3,000 מוכרים (RID 1)
    for _ in range(3000):
        assignments.append([current_eid, 1, get_salary(1)])
        current_eid += 1

    # 3. יצירת 1,200 מנהלי משמרת (RID 2)
    for _ in range(1200):
        assignments.append([current_eid, 2, get_salary(2)])
        current_eid += 1

    # 4. מילוי שאר 15,300 העובדים בתפקידים אחרים (מ-4 עד 500)
    # נגריל מכל שאר ה-RID הקיימים (לא כולל 1, 2, 3 שכבר מילאנו)
    other_rids = [r for r in range(4, 501)]
    
    while current_eid <= num_employees:
        rid = random.choice(other_rids)
        assignments.append([current_eid, rid, get_salary(rid)])
        
        # השהיה קלה כל 5000 רשומות כדי לשמור על המעבד
        if current_eid % 5000 == 0:
            print(f"הושלמו {current_eid} רשומות...")
            time.sleep(1)
            
        current_eid += 1

    # כתיבה לקובץ ה-CSV
    with open(file_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['eid', 'rid', 'salary']) # כותרות העמודות
        writer.writerows(assignments)

    print(f"הסקריפט הסתיים! נוצרו בדיוק {len(assignments)} רשומות בנתיב: {file_path}")

if __name__ == "__main__":
    generate_exact_has_data()




