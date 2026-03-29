import csv
import json
import random

def generate_realistic_assignto():
    has_file = r'C:\Tar0\has_assignments_final.csv'
    guidence_file = r'C:\Tar0\guidence_data_v2.csv'
    output_file = r'C:\Tar0\assignto_smart_data.csv'

    def get_role_category(rid):
        rid = int(rid)
        if rid == 3: return "Store Manager"
        if rid == 1 or 96 <= rid <= 115 or 296 <= rid <= 315: return "Sales Associate"
        if rid == 2: return "Shift Manager"
        if rid == 4: return "Cashier"
        if 11 <= rid <= 30 or 211 <= rid <= 230: return "Product Manager"
        if 121 <= rid <= 125 or 321 <= rid <= 325: return "Social Media Manager"
        if 71 <= rid <= 95 or 271 <= rid <= 295: return "Warehouse Staff"
        if 10 == rid or 136 <= rid <= 150 or 336 <= rid <= 350: return "Delivery Driver & Logistics"
        if 151 <= rid <= 175 or 351 <= rid <= 375: return "Suppliers & Procurement"
        if 31 <= rid <= 55 or 231 <= rid <= 255: return "HR & Management"
        return "Other Staff"

    employees_by_category = {}
    all_ids = []

    with open(has_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            cat = get_role_category(row['rid'])
            if cat not in employees_by_category:
                employees_by_category[cat] = []
            employees_by_category[cat].append(row['eid'])
            all_ids.append(row['eid'])

    assignto_records = []
    with open(guidence_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for g_row in reader:
            gid = g_row['gid']
            desc = json.loads(g_row['gdescription_json'])
            target = desc['target_role']
            
            potential = all_ids if target == "All Staff" else employees_by_category.get(target, [])
            
            if potential:
                # מנגנון הסתברות ליצירת גיוון בכמות הנרשמים:
                dice_roll = random.random() # מספר בין 0 ל-1
                
                if dice_roll < 0.15: # 15% מההדרכות יהיו ריקות לגמרי
                    num_to_add = 0
                elif dice_roll < 0.30: # 15% מההדרכות יהיו עם אדם אחד בלבד
                    num_to_add = 1
                elif dice_roll < 0.85: # 55% יהיו עם כמות רגילה (5-20)
                    num_to_add = random.randint(5, 20)
                else: # 15% מההדרכות יהיו "מפוצצות" (50-100 איש או כל הפוטנציאל)
                    num_to_add = random.randint(50, 100)

                num_to_add = min(len(potential), num_to_add)
                if num_to_add > 0:
                    selected = random.sample(potential, num_to_add)
                    for eid in selected:
                        assignto_records.append([eid, gid])

    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['eid', 'gid'])
        writer.writerows(assignto_records)

    print(f"Success! Smart assignments created with variety.")

if __name__ == "__main__":
    generate_realistic_assignto()