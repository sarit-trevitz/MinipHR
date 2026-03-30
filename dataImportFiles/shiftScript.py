import random
from datetime import datetime, timedelta

def generate_shifts_sql(filename, num_rows):
    shift_types = ['Morning', 'Afternoon', 'Evening']
    start_date = datetime(2026, 1, 1)
    
    # רשימת ה-Bid הקיימים (לפי מה שציינת: 1 עד 500)
    branch_ids = list(range(1, 501))
    
    with open(filename, 'w', encoding='utf-8') as f:
        # כתיבת הערה בתחילת הקובץ
        f.write("-- Generated shifts for 500 branches\n")
        
        for s_id in range(1, num_rows + 1):
            # הגרלת סוג משמרת
            s_type = random.choice(shift_types)
            
            # הגרלת מספר עובדים (בין 3 ל-7)
            s_emp_num = random.randint(3, 7)
            
            # הגרלת תאריך (בטווח של שנתיים קדימה ליצירת גיוון)
            random_days = random.randint(0, 730)
            s_date = (start_date + timedelta(days=random_days)).strftime('%Y-%m-%d')
            
            # הגרלת סניף מתוך הטווח 1-500
            b_id = random.choice(branch_ids)
            
            # יצירת השאילתה
            sql_line = f"INSERT INTO shift (Sid, Stype, Semp_num, Sdate, Bid) " \
                       f"VALUES ({s_id}, '{s_type}', {s_emp_num}, '{s_date}', {b_id});\n"
            
            f.write(sql_line)
            
            # הדפסת התקדמות כל 5000 שורות
            if s_id % 5000 == 0:
                print(f"Generated {s_id} rows...")

# הרצת הסקריפט ליצירת 20,000 שורות
generate_shifts_sql('insert_shifts.sql', 20000)
print("Done! The file 'insert_shifts.sql' is ready.")