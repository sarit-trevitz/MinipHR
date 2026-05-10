import json

def generate_insert_script():
    file_path = 'insertTable.sql'
    
    with open(file_path, 'w', encoding='utf-8') as f:
        # Insert to ROLE table
        f.write("INSERT INTO ROLE (Rid, Rname, Rdescription, Rrequirements_json) VALUES\n")
        f.write("(501, 'Morning Cleaner', 'Responsible for cleaning the store during morning hours', '{\"shift\": \"morning\", \"physical_effort\": \"medium\"}'),\n")
        f.write("(502, 'Evening Cleaner', 'Responsible for cleaning the store during evening hours', '{\"shift\": \"evening\", \"physical_effort\": \"medium\"}'),\n")
        f.write("(503, 'Cleaning Supervisor', 'Oversees all cleaning staff and supply inventory', '{\"leadership\": \"high\", \"experience\": \"2 years\"}');\n\n")

        # Insert to EMPLOYEE table
        f.write("INSERT INTO EMPLOYEE (Eid, Ename, Eaddress, Ephone, Eemail, Eseniority) VALUES\n")
        f.write("(20001, 'Sagi Cohen', 'Herzl 10, Tel Aviv', '050-1112233', 'sagi.c@shoe-store.com', 1),\n")
        f.write("(20002, 'Yael Levi', 'Jaffa 45, Jerusalem', '052-4445566', 'yael.l@shoe-store.com', 2),\n")
        f.write("(20003, 'Itai Mizrahi', 'HaAtzmaut 2, Haifa', '054-7778899', 'itai.m@shoe-store.com', 0);\n\n")

        # Insert to HAS table
        f.write("INSERT INTO HAS (Rid, Eid, salary) VALUES\n")
        f.write("(20001, 503, 12000), \n")
        f.write("(20001, 501, 7000), \n")
        f.write("(20002, 501, 6800), \n")
        f.write("(20002, 502, 7200),\n")
        f.write("(20003, 502, 6900); \n\n")

        g_desc1 = json.dumps({"target_role": "Morning Cleaner", "training_goal": "Chemical Safety"})
        g_desc2 = json.dumps({"target_role": "Cleaning Supervisor", "training_goal": "Team Management"})
        g_desc3 = json.dumps({"target_role": "Evening Cleaner", "training_goal": "Closing Procedures"})
        
        # Insert to GUIDENCE table
        f.write(f"INSERT INTO GUIDENCE (Gid, Glocation, Gdescription_json, Gdate, Ginstructor) VALUES\n")
        f.write(f"(501, 'Main Hub', '{g_desc1}', '2026-05-01', 'Avi Ron'),\n")
        f.write(f"(502, 'Conference Room', '{g_desc2}', '2026-05-05', 'Dana Weiss'),\n")
        f.write(f"(503, 'On-site', '{g_desc3}', '2026-05-10', 'Ronit Green');\n\n")

        # Insert to ASSIGNTO table
        f.write("INSERT INTO ASSIGNTO (Eid, Gid) VALUES\n")
        f.write("(20001, 502),\n")
        f.write("(20001, 501),\n")
        f.write("(20002, 501),\n")
        f.write("(20002, 503),\n")
        f.write("(20003, 503);\n\n")

        # Insert to BRANCH table
        f.write("INSERT INTO BRANCH (Bid, Bcity, Baddress, Bphone, Bname) VALUES\n")
        f.write("(501, 'Petah Tikva', 'Jabotinsky 72', '03-9214455', 'Petah Tikva Grand Mall'),\n")
        f.write("(502, 'Eilat', 'Kampan 8', '08-6332211', 'Eilat Ice Mall'),\n")
        f.write("(503, 'Rishon LeZion', 'Yaldai HaTeheran 5', '03-9508877', 'Rishon LeZion G-Center');\n\n")

        # Insert to SHIFT table
        f.write("INSERT INTO SHIFT (Sid, Stype, Semp_num, Sdate, Bid) VALUES\n")
        f.write("(20001, 'Morning', 5, '2026-06-01', 501),\n")
        f.write("(20002, 'Evening', 4, '2026-06-01', 502),\n")
        f.write("(20003, 'Night', 3, '2026-06-02', 503);\n\n")

        # Insert to EVENT table
        f.write("INSERT INTO EVENT (EVid, EVdate, EVdescruption, EVbudget, Evtype) VALUES\n")
        f.write("(501, '2026-07-01', 'Summer Sale Launch - Huge Discounts', 15000, 'Promotion'),\n")
        f.write("(502, '2026-07-15', 'New Collection Reveal VIP Evening', 25000, 'VIP Evening'),\n")
        f.write("(503, '2026-08-01', 'Inventory Clearance Event', 5000, 'Sale');\n\n")

        # Insert to SCHEDULE table
        f.write("INSERT INTO SCHEDULE (Eid, Sid) VALUES\n")
        f.write("(20001, 20001),\n")
        f.write("(20002, 20002),\n")
        f.write("(20003, 20003);\n\n")

        # Insert to PARTICIPATE table
        f.write("INSERT INTO PARTICIPATE (EVid, Eid) VALUES\n")
        f.write("(501, 20001),\n")
        f.write("(501, 20002),\n")
        f.write("(502, 20003);\n")


if __name__ == "__main__":
    generate_insert_script()