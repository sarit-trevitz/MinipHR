

#סקריפט בשביל טבלת הדרכות
import csv
import json
import random
from datetime import datetime, timedelta

def generate_expanded_guidence_data():
    file_path = r'C:\Tar0\guidence_data_v2.csv'
    
    locations = [
        "Main Training Center", "Conference Room B", "Virtual - Teams", 
        "Logistics Hub South", "Product Design Studio", "Warehouse Terminal 1",
        "Marketing Lab", "External Supplier Site", "Jerusalem Office"
    ]
    
    instructors = [
        "Dr. Emily White", "Sarah Levy", "Avi Cohen", "Michael Brown", 
        "Rachel Green", "Linda Johnson", "Yossi Peretz", "Noa Katz", 
        "Robert Miller", "Sophie Chen", "Marcus Thorne", "Dana Weiss"
    ]
    
    # רשימת הדרכות מורחבת לפי תפקידים
    training_templates = [

{
            "target": "Sales Associate",
            "goals": ["Improve closing skills", "Advanced persuasion techniques", "Handling difficult customers"]
        },
    
        {
            "target": "Cashier",
            "goals": ["POS system efficiency", "Security protocols for cash handling", "Fraud detection"]
        },    
        {
            "target": "HR & Management",
            "goals": ["Conflict resolution", "Advanced recruitment interviews", "Employee well-being"]
        },
        {
            "target": "Product Manager",
            "goals": ["Product Lifecycle Management", "Market Trend Analysis", "Agile Roadmap Planning", "User Experience Strategy"]
        },
        {
            "target": "Social Media Manager",
            "goals": ["TikTok Growth Strategies", "Crisis PR Management", "Content Creation Workshop", "Ad Campaign Optimization"]
        },
        {
            "target": "Warehouse Staff",
            "goals": ["Forklift Safety Certification", "Inventory Tracking Systems", "Hazardous Material Handling", "Optimizing Picking Speed"]
        },
        {
            "target": "Delivery Driver & Logistics",
            "goals": ["Advanced Route Planning", "Fuel Efficiency Training", "Vehicle Maintenance Basics", "Cargo Security Protocols"]
        },
        {
            "target": "Suppliers & Procurement",
            "goals": ["Quality Control Standards", "Sustainable Sourcing", "Contract Negotiation Skills", "Supply Chain Transparency"]
        },
        {
            "target": "Store Manager",
            "goals": ["Labor Law Compliance", "Team Performance Reviews", "Store Analytics & KPI"]
        },
        {
            "target": "All Staff",
            "goals": ["First Aid Basics", "Sexual Harassment Prevention", "Fire Safety Drill"]
        }
    ]

    guidence_list = []
    start_date = datetime.now()

    for gid in range(1, 501):
        # בחירת תבנית
        template = random.choice(training_templates)
        
        # בניית JSON
        description_data = {
            "target_role": template["target"],
            "training_goal": random.choice(template["goals"]),
            "is_mandatory": random.choice([True, False]),
            "max_participants": random.randint(10, 50),
            "language": random.choices(["Hebrew", "English"], weights=[80, 20])[0]
        }
        
        # הגרלת תאריך (חצי שנה אחורה עד שנה קדימה)
        random_days = random.randint(-180, 365)
        g_date = (start_date + timedelta(days=random_days)).strftime('%Y-%m-%d')
        
        guidence_list.append([
            gid,
            random.choice(locations),
            json.dumps(description_data),
            g_date,
            random.choice(instructors)
        ])

    # כתיבה ל-CSV
    with open(file_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['gid', 'glocation', 'gdescription_json', 'gdate', 'ginstructor'])
        writer.writerows(guidence_list)

    print(f"Success! 500 diversified guidance records created at: {file_path}")

if __name__ == "__main__":
    generate_expanded_guidence_data()







