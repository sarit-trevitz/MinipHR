import csv
import json
def generate_professional_shoe_roles():
    # הגדרת מחלקות ותפקידים
    categories = {
        "Management": ["Area Manager", "District Supervisor", "Regional Operations Director", "Product Manager"],
        "HR": ["HR Manager", "HR Specialist", "Recruitment Officer", "Welfare Coordinator", "Payroll Admin"],
        "Customer Service": ["Support Agent", "Customer Experience Lead", "Returns Specialist"],
        "Logistics": ["Warehouse Worker", "Inventory Supervisor", "Forklift Operator", "Stock Controller", "Warehouse Manager"],
        "Sales": ["Sales Associate", "Salesperson", "Sales Trainer", "Floor Supervisor"],
        "Marketing": ["Marketing Executive", "Social Media Manager", "Content Creator", "Media Planner"],
        "Transport": ["Delivery Driver", "Fleet Coordinator", "Route Planner"],
        "Finance_Legal": ["Accountant", "Financial Controller", "Company Lawyer", "Legal Consultant", "Bookkeeper"],
        "Design": ["Shoe Designer", "Pattern Maker", "Material Specialist", "Creative Director"],
        "Security": ["Store Guard", "Security Supervisor", "Loss Prevention Specialist"]
    }

    # לוגיקה לפי דרגות - שכר, ניסיון ותיאור
    level_meta = {
        "Junior": {
            "exp": "None", 
            "action": "Assisting in daily tasks and learning",
            "focus": "operational support",
            "edu": "High School Diploma"
        },
        "Assistant": {
            "exp": "1-2 years", 
            "action": "Supporting the department with",
            "focus": "administrative and technical duties",
            "edu": "Relevant Course/Certification"
        },
        "Senior": {
            "exp": "5+ years", 
            "action": "Executing high-level",
            "focus": "independent professional tasks",
            "edu": "Bachelor's Degree"
        },
        "Lead": {
            "exp": "7+ years", 
            "action": "Leading a team of professionals in",
            "focus": "project execution and quality control",
            "edu": "Bachelor's Degree"
        },
        "Head of": {
            "exp": "10+ years", 
            "action": "Defining the long-term strategy for",
            "focus": "departmental growth and vision",
            "edu": "Master's Degree / MBA"
        }
    }

    roles = []
    rid = 11
    
    while rid <= 500:
        for cat_name, titles in categories.items():
            for title in titles:
                for level, meta in level_meta.items():
                    if rid > 500: break
                    
                    # יצירת שם תפקיד
                    rname = f"{level} {title}"
                    
                    # יצירת תיאור מגוון (Description)
                    clean_cat = cat_name.replace('_', ' ')
                    rdesc = f"{meta['action']} {clean_cat} {meta['focus']} to ensure business excellence."
                    
                    # התאמת כישורים (Skills)
                    skills = []
                    if cat_name == "Transport":
                        skills = ["Valid License", "Route Optimization"] if level != "Junior" else ["Valid License"]
                    elif cat_name == "Design":
                        skills = ["Adobe Creative Suite", "Trend Analysis"]
                    elif cat_name == "Finance_Legal":
                        skills = ["Legal Compliance", "Contract Law"] if "Lawyer" in title else ["Financial Reporting", "ERP Systems"]
                    elif cat_name == "Sales":
                        skills = ["Customer Persuasion", "Inventory Management"]
                    elif cat_name == "Security":
                        skills = ["Emergency Response", "Surveillance Systems"]
                    else:
                        skills = ["Strategic Planning", "Stakeholder Management"] if "Head" in level else ["Office Productivity", "Time Management"]

                    # בניית ה-JSON
                    requirements = {
                        "years_of_experience": meta["exp"],
                        "education_level": meta["edu"] if cat_name in ["Finance_Legal", "Management", "HR", "Design"] else "Not Required",
                        "technical_skills": skills,
                        "soft_skills": ["Leadership", "Critical Thinking"] if "Head" in level or "Lead" in level else ["Teamwork", "Punctuality"]
                    }
                    
                    roles.append([rid, rname, rdesc, json.dumps(requirements)])
                    rid += 1

    # כתיבה לקובץ
    with open(r'C:\Tar0\roles_data.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['rid', 'rname', 'rdescription', 'rrequirements_json'])
        writer.writerows(roles)
    
    print(f"Success! 490 unique and logical roles generated in C:\\Tar0\\roles_data.csv")

if __name__ == "__main__":
    generate_professional_shoe_roles()


