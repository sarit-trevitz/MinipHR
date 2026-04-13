INSERT INTO ROLE (Rid, Rname, Rdescription, Rrequirements_json) VALUES
(501, 'Morning Cleaner', 'Responsible for cleaning the store during morning hours', '{"shift": "morning", "physical_effort": "medium"}'),
(502, 'Evening Cleaner', 'Responsible for cleaning the store during evening hours', '{"shift": "evening", "physical_effort": "medium"}'),
(503, 'Cleaning Supervisor', 'Oversees all cleaning staff and supply inventory', '{"leadership": "high", "experience": "2 years"}');

INSERT INTO EMPLOYEE (Eid, Ename, Eaddress, Ephone, Eemail, Eseniority) VALUES
(20001, 'Sagi Cohen', 'Herzl 10, Tel Aviv', '050-1112233', 'sagi.c@shoe-store.com', 1),
(20002, 'Yael Levi', 'Jaffa 45, Jerusalem', '052-4445566', 'yael.l@shoe-store.com', 2),
(20003, 'Itai Mizrahi', 'HaAtzmaut 2, Haifa', '054-7778899', 'itai.m@shoe-store.com', 0);

INSERT INTO HAS (Rid, Eid, salary) VALUES
(20001, 503, 12000), 
(20001, 501, 7000), 
(20002, 501, 6800), 
(20002, 502, 7200),
(20003, 502, 6900); 

INSERT INTO GUIDENCE (Gid, Glocation, Gdescription_json, Gdate, Ginstructor) VALUES
(501, 'Main Hub', '{"target_role": "Morning Cleaner", "training_goal": "Chemical Safety"}', '2026-05-01', 'Avi Ron'),
(502, 'Conference Room', '{"target_role": "Cleaning Supervisor", "training_goal": "Team Management"}', '2026-05-05', 'Dana Weiss'),
(503, 'On-site', '{"target_role": "Evening Cleaner", "training_goal": "Closing Procedures"}', '2026-05-10', 'Ronit Green');

INSERT INTO ASSIGNTO (Eid, Gid) VALUES
(20001, 502),
(20001, 501),
(20002, 501),
(20002, 503),
(20003, 503);

INSERT INTO BRANCH (Bid, Bcity, Baddress, Bphone, Bname) VALUES
(501, 'Petah Tikva', 'Jabotinsky 72', '03-9214455', 'Petah Tikva Grand Mall'),
(502, 'Eilat', 'Kampan 8', '08-6332211', 'Eilat Ice Mall'),
(503, 'Rishon LeZion', 'Yaldai HaTeheran 5', '03-9508877', 'Rishon LeZion G-Center');

INSERT INTO SHIFT (Sid, Stype, Semp_num, Sdate, Bid) VALUES
(20001, 'Morning', 5, '2026-06-01', 501),
(20002, 'Evening', 4, '2026-06-01', 502),
(20003, 'Night', 3, '2026-06-02', 503);

INSERT INTO EVENT (EVid, EVdate, EVdescruption, EVbudget, Evtype) VALUES
(501, '2026-07-01', 'Summer Sale Launch - Huge Discounts', 15000, 'Promotion'),
(502, '2026-07-15', 'New Collection Reveal VIP Evening', 25000, 'VIP Evening'),
(503, '2026-08-01', 'Inventory Clearance Event', 5000, 'Sale');

INSERT INTO SCHEDULE (Eid, Sid) VALUES
(20001, 20001),
(20002, 20002),
(20003, 20003);

INSERT INTO PARTICIPATE (EVid, Eid) VALUES
(501, 20001),
(501, 20002),
(502, 20003);
