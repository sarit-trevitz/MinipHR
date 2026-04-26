
**System:** National Shoes store Retail Chain Management

**Selected Unit:** Human Resources (HR) Department 

**Submitted by:** Talya Leizerovich 215787300, Sarit Trevitz 214820698

**Date:** March 2026

**Introduction:**

The HR department manages the complete lifecycle of an employee within the chain.

This includes assigning employees to roles and branches, scheduling their actual shifts, and tracking their professional development.

The system stores detailed data on Employees, Branches , Roles , Shifts , Guidance, and Events.

**The Main Functionalities of the System Include:**

Placement and Compensation Management: Connecting employees to specific roles and managing salary data  based on their position.

Operational Control in Branches: Managing a smart work schedule that links employees to shifts, ensuring each shift is assigned to a specific branch and staffed with the required number of employees.

Human Capital Development: Tracking professional certifications to ensure high-quality service, and managing employee participation in corporate events  to strengthen company loyalty.

**System Screens:**

screens for example:

![dashboard image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/Dashboard.png)

![employee image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/EmployeeScreen.png)

![branch image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/BranchScreen.png)

Link for all the system:

https://ai.studio/apps/a45b0c07-4757-4134-a9b1-842f37eb4649

ERD diadram:

![ERD diagram](https://github.com/sarit-trevitz/MinipHR/blob/main/images/ERD.png)

DSD diagram:

![DSD diagram](https://github.com/sarit-trevitz/MinipHR/blob/main/images/DSD.png)

Screenshot of insert to DB methods:

![InsertEvent image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/insertEvent.png)

![InsertRole image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/insertRole.png)

![MackarooEmployee image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/MackarooEmployee.png)

![MackarooBranch image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/MackarooBranch.png)

![CSV image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/CSV.png)

![SQLSchedule image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/SQLSchedule.png)

![ProcessCompleted image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/ProcessCompleted.png)



SQL QUERIES:
Select:
1. Return how many employees are assigned to each role.
first way (1.1):
explain: The query does cartesian multiplication between two tables and looks for the equal raws in the equal colume and return the amount of employees group by the roles and the id of each role. 
SELECT 
    R.Rid,
    R.Rname, 
    COUNT(H.Eid) AS EmployeeCount
FROM ROLE R, HAS H
WHERE R.Rid = H.Rid
GROUP BY R.Rid, R.Rname;
![select 1.1 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/select1.1.png)


second way (1.2):
explain: The query does natural join between two tables and return the amount of employees group by the roles and the id of each role. 
SELECT 
    R.Rid,
    Rname, 
    COUNT(Eid) AS EmployeeCount
FROM ROLE
NATURAL JOIN HAS
GROUP BY R.Rid, R.Rname;
![select 1.2 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/select1.2.png)

the difference between the methods:
Natural Join- Filters rows by matching values in columns with identical names.
Cartesian Product- Combines every row from one table with every row from the other (no filtering).
Natural join is more efficient because it filters automatically. (we can see that in the running time in the buttom of the picture).


2. Return the roles  and id of the employees who assign to each guidance.
first way (2.1):
explain: Split the computing by seperate to temporary table in order to remove the using of one more table - the guidenece table.
WITH GuidanceRoles AS (              
    SELECT DISTINCT A.Gid, H.Rid , H.Eid     
    FROM ASSIGNTO A                   
    JOIN HAS H ON A.Eid = H.Eid      
)                                     
SELECT GR.Gid, R.Rname, GR.Eid                
FROM GuidanceRoles GR                 
JOIN ROLE R ON GR.Rid = R.Rid        
ORDER BY GR.Gid; 
![select 2.1 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/select2.1.png)


second way (2.2):
explain: The query does inner join between four tables and return the role and id of each employees who assigned to a guidence. 
SELECT 
    G.Gid, 
    R.Rname,
    H.Eid
FROM GUIDENCE G
INNER JOIN ASSIGNTO A ON G.Gid = A.Gid
INNER JOIN HAS H ON A.Eid = H.Eid
INNER JOIN ROLE R ON H.Rid = R.Rid;
![select 2.2 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/select2.2.png)

the difference between the methods:
WITH table- Because it uses one less table the compute is harder and take more time.
inner join- use all the required tables by simple actions so the computing is faster.
This is why the inner join is more efficient.
 (we can see that in the running time in the buttom of the picture).


3. Return the roles  and id of the employees who assign to each guidance.
first way (3.1):
explain: Split the computing by seperate to temporary table in order to remove the using of one more table - the guidenece table.
WITH GuidanceRoles AS (              
    SELECT DISTINCT A.Gid, H.Rid , H.Eid     
    FROM ASSIGNTO A                   
    JOIN HAS H ON A.Eid = H.Eid      
)                                     
SELECT GR.Gid, R.Rname, GR.Eid                
FROM GuidanceRoles GR                 
JOIN ROLE R ON GR.Rid = R.Rid        
ORDER BY GR.Gid; 
![select 3.1 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/select3.1.png)


second way (3.2):
explain: The query does inner join between four tables and return the role and id of each employees who assigned to a guidence. 
SELECT 
    G.Gid, 
    R.Rname,
    H.Eid
FROM GUIDENCE G
INNER JOIN ASSIGNTO A ON G.Gid = A.Gid
INNER JOIN HAS H ON A.Eid = H.Eid
INNER JOIN ROLE R ON H.Rid = R.Rid;
![select 3.2 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/select3.2.png)

the difference between the methods:
WITH table- Because it uses one less table the compute is harder and take more time.
inner join- use all the required tables by simple actions so the computing is faster.
This is why the inner join is more efficient.
 (we can see that in the running time in the buttom of the picture).

 4. Return the roles  and id of the employees who assign to each guidance.
first way (4.1):
explain: Split the computing by seperate to temporary table in order to remove the using of one more table - the guidenece table.
WITH GuidanceRoles AS (              
    SELECT DISTINCT A.Gid, H.Rid , H.Eid     
    FROM ASSIGNTO A                   
    JOIN HAS H ON A.Eid = H.Eid      
)                                     
SELECT GR.Gid, R.Rname, GR.Eid                
FROM GuidanceRoles GR                 
JOIN ROLE R ON GR.Rid = R.Rid        
ORDER BY GR.Gid; 
![select 4.1 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/select4.1.png)


second way (4.2):
explain: The query does inner join between four tables and return the role and id of each employees who assigned to a guidence. 
SELECT 
    G.Gid, 
    R.Rname,
    H.Eid
FROM GUIDENCE G
INNER JOIN ASSIGNTO A ON G.Gid = A.Gid
INNER JOIN HAS H ON A.Eid = H.Eid
INNER JOIN ROLE R ON H.Rid = R.Rid;
![select 4.2 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/select4.2.png)

the difference between the methods:
WITH table- Because it uses one less table the compute is harder and take more time.
inner join- use all the required tables by simple actions so the computing is faster.
This is why the inner join is more efficient.
 (we can see that in the running time in the buttom of the picture).







