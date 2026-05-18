
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

![PGadminDSD diagram](https://github.com/sarit-trevitz/MinipHR/blob/main/images/DSDbyPGadmin.png)

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

explain: The query does inner join between three tables and return the role and id of each employees who assigned to a guidence. 

SELECT 
    A.Gid, 
    R.Rname,
    H.Eid
FROM ASSIGNTO A
INNER JOIN HAS H ON A.Eid = H.Eid
INNER JOIN ROLE R ON H.Rid = R.Rid;
![select 2.2 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/select2.2.png)

the difference between the methods:

WITH table- Because it uses temporary table it uses less optimizations.
inner join- because it does inner join on all the required tables as one compenent so it can does many optimizations.
This is why the inner join is more efficient.
 (we can see that in the running time in the buttom of the picture).


3. Return the number of empolyees who participate in each event.

first way (3.1):

explain: The query does left join between two talbes-EVENT and PARTICIPATE and then does GROUP BY by evid, and then count the groups. 

SELECT 
    E.EVid, 
    E.EVdescription, 
    E.EVtype, 
    COUNT(P.eid) AS EmployeeCount
FROM EVENT E
LEFT JOIN PARTICIPATE P ON E.EVid = P.evid
GROUP BY E.EVid, E.EVdescription, E.EVtype
ORDER BY EmployeeCount ASC;
![select 3.1 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/select3.1.png)


second way (3.2):

explain: The counting is computing inside the Outer SELECT query.

SELECT 
    E.EVid, 
    E.EVdescription, 
    E.EVtype,
    (SELECT COUNT(P.eid) 
     FROM PARTICIPATE P 
     WHERE P.EVid = E.EVid) AS EmployeeCount
FROM EVENT E
ORDER BY EmployeeCount ASC;
ORDER BY EmployeeCount ASC;
![select 3.2 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/select3.2.png)

the difference between the methods:

left join- Because it connects the tables into one large entity and divides it into groups to count the employees in each pile at once.
Outer SELECT- Because it goes through all the rows of the events table and sends a separate "auxiliary query" for each event to count its employees in the second table .
This is why the left join is more efficient.
(we can see that in the running time in the buttom of the picture).

 4.  Return the number of shifts for each shift type in each month of the year 2026.
first way (4.1):
explain: Scans the table once and groups all rows into groups by month and type, so that the count is performed on all groups simultaneously.
SELECT 
    EXTRACT(MONTH FROM sdate) AS Month,
    EXTRACT(YEAR FROM sdate) AS Year,
    stype AS ShiftType,
    COUNT(sid) AS ShiftCount
FROM SHIFT
WHERE EXTRACT(YEAR FROM sdate) = 2026
GROUP BY Year, Month, stype
ORDER BY Month ASC, ShiftType ASC;
![select 4.1 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/select4.1.png)


second way (4.2):
explain: Goes through all the rows, and for each individual row it runs a search and recount on the entire table to find matches for the specific month and type.
SELECT DISTINCT
    EXTRACT(MONTH FROM sdate) AS Month,
    EXTRACT(YEAR FROM sdate) AS Year,
    stype AS ShiftType,
    (SELECT COUNT(*) 
     FROM SHIFT S2 
     WHERE EXTRACT(MONTH FROM S2.sdate) = EXTRACT(MONTH FROM S1.sdate)
       AND S2.stype = S1.stype
       AND EXTRACT(YEAR FROM S2.sdate) = 2026) AS ShiftCount
FROM SHIFT S1
WHERE EXTRACT(YEAR FROM S1.sdate) = 2026
ORDER BY Month ASC, ShiftType ASC;
![select 4.2 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/select4.2.png)

the difference between the methods:
GROUP BY- Because it uses one less table the compute is harder and take more time.
Outer SELECT- because it goes through all the months and sends a separate query for each month to count the number of shifts and types in the shifts table.
This is why the GROUP BYis more efficient.
 (we can see that in the running time in the buttom of the picture).

5. Return the event that the participate in it is the maximum.

explain: GROUPBY the EVid of PARTICIPATE and count the amount of employees in each group so we can find the group that has the maximum participating.

SELECT E.*, COUNT(P.Eid) AS EmployeeCount
FROM EVENT E
JOIN PARTICIPATE P ON E.EVid = P.EVid
GROUP BY E.EVid, E.EVDate, E.EVdescription, E.EVtype, E.EVbudget
HAVING COUNT(P.Eid) >= ALL (
    SELECT COUNT(Eid)
    FROM PARTICIPATE
    GROUP BY EVid
);
![select 5 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/select5.png)

6. Return the branches that have at least one employee with seniority greater than 10.

explain: First select all the employee's senioritys to check if there at least 1 that is greater than 10 and take just the branches that these employees work in.

SELECT DISTINCT B.*
FROM Branch B
JOIN Shift S ON B.Bid = S.Bid  
JOIN Schedule SCH ON S.Sid = SCH.Sid
WHERE 10 < ANY (
    SELECT E.Eseniority
    FROM Employee E
    WHERE E.Eid = SCH.Eid
);
![select 6 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/select6.png)

7. Return the employees who are assigned to at least one guidance that Avi Cohen is the instructor of.

explain:First select all the ASSIGNTO that their guidence's instroctur is Avi Cohen and then return all the employees taht exist in the above select.

SELECT *
FROM Employee E
WHERE EXISTS (
    SELECT *
    FROM AssignTo A
    JOIN Guidence G ON A.Gid = G.Gid
    WHERE A.Eid = E.Eid AND G.Ginstructor = 'Avi Cohen'
);
![select 7 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/select7.png)

8. Return the roles that have the minimum number of employees assigned.

explain: First GROUPBY the amount of employees in each roleand then return the roles that have the minimum employees.

SELECT R.Rid,R.Rname, COUNT(H.Eid) AS EmployeeCount
FROM Role R
LEFT JOIN Has H ON R.Rid = H.Rid
GROUP BY R.Rid, R.Rname
HAVING COUNT(H.Eid) <= ALL (
    SELECT COUNT(Eid)
    FROM Has
    GROUP BY Rid
);
![select 8 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/select8.png)

Delete:

1. Delete the guidances that there are no employees assigned to- Select all the guidences that no in the result of the inner query that select all the raws from ASSIGNTO that Gid is no null.
BEGIN; //begin the transaction

DELETE FROM GUIDENCE
WHERE Gid NOT IN (
    SELECT DISTINCT Gid
    FROM ASSIGNTO
    WHERE Gid IS NOT NULL
);

ROLLBACK; //restore the original data

![delete 1.1 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/delete1.1.png)
![delete 1.2 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/delete1.2.png)
![delete 1.3 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/delete1.3.png)
![delete 1.4 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/delete1.4.png)

2. Delete the Employees that are not schedule to any shift - first delete these employees from connected tables - ASSIGNTO, HAS, PARTICIPATE - because of the foregin key problem, and just then delete the employee itself.

BEGIN; //begin the transaction

DELETE FROM ASSIGNTO
WHERE eid IN (SELECT eid FROM EMPLOYEE WHERE eid NOT IN (SELECT eid FROM SCHEDULE WHERE eid IS NOT NULL));
DELETE FROM HAS
WHERE eid IN (SELECT eid FROM EMPLOYEE WHERE eid NOT IN (SELECT eid FROM SCHEDULE WHERE eid IS NOT NULL));
DELETE FROM PARTICIPATE
WHERE eid IN (SELECT eid FROM EMPLOYEE WHERE eid NOT IN (SELECT eid FROM SCHEDULE WHERE eid IS NOT NULL));
DELETE FROM EMPLOYEE
WHERE eid NOT IN (SELECT eid FROM SCHEDULE WHERE eid IS NOT NULL);
SELECT * FROM EMPLOYEE;

ROLLBACK; //restore the original data

![delete 2.1 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/delete2.1.png)
![delete 2.2 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/delete2.2.png)
![delete 2.3 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/delete2.3.png)

3. Delete the shifts on 2026-05-13 - for example: this day was Election day so all the stores were closed - so the shifts weren't exist.

BEGIN; //begin the transaction

DELETE FROM SCHEDULE
WHERE Sid IN (
    SELECT Sid 
    FROM SHIFT 
    WHERE Sdate = '2026-05-13'
);

DELETE FROM SHIFT
WHERE Sdate = '2026-05-13';

COMMIT; //save the changes on the tables

![delete 3.1 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/delete3.1.png)
![delete 3.2 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/delete3.2.png)
![delete 3.3 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/delete3.3.png)

Update:
1. Update the salary of each employee who it's seniority is over 5 years by SET func.

BEGIN; //begin the transaction

UPDATE HAS
SET Hsalary = Hsalary * 1.10
WHERE eid IN (
    SELECT eid 
    FROM EMPLOYEE E 
    WHERE E.Eseniority > 5
);

COMMIT; //save the changes on the tables

![update 1.1 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/update1.1.png)
![update 1.2 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/update1.2.png)
![update 1.3 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/update1.3.png)

2. Update the employee number that are require in a shift so if this is the end of the month - 
--day 29/30/31 - we need to increase the employee numbers by 2.

BEGIN; //begin the transaction

UPDATE SHIFT
SET Semp_num = Semp_num + 2
WHERE EXTRACT(DAY FROM Sdate) IN (29, 30, 31);

COMMIT; //save the changes on the tables

![update 2.1 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/update2.1.png)
![update 2.2 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/update2.2.png)
![update 2.3 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/update2.3.png)

3. Update the budget of each event that more than 8 employees participate in it by increasing it by 150%.

BEGIN; //begin the transaction

UPDATE EVENT
SET EVbudget = EVbudget * 1.5
WHERE EVid IN (
    SELECT EVid
    FROM PARTICIPATE
    GROUP BY EVid
    HAVING COUNT(Eid) > 8
);

ROLLBACK; //restore the original data

![update 3.1 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/update3.1.png)
![update 3.2 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/update3.2.png)
![update 3.3 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/update3.3.png)
![update 3.4 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/update3.4.png)

Constraints:

The purpose of constraints is to ensure only valid and accurate data is entered into the database, preventing human errors and maintaining data integrity and reliability.

1. A constraint to ensure that the number of employees required for a shift is at least 2.

ALTER TABLE SHIFT
ADD CONSTRAINT check_minimum_employees 
CHECK (Semp_num >= 2);

![constraint 1.1 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/Constraint1.1.png)
![constraint 1.2 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/Constraint1.2.png)


2. A constraint to ensure that the branch phone number follows a specific format (e.g., XXX-XXX-XXXX).

ALTER TABLE BRANCH
ADD CONSTRAINT chk_phone_format
CHECK (Bphone SIMILAR TO '[0-9]{3}-[0-9]{3}-[0-9]{4}');

![constraint 2.1 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/constraint2.1.png)
![constraint 2.2 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/constraint2.2.png)


3. A constraint to ensure that the salary in the HAS table is above a certain threshold.  

ALTER TABLE HAS
ADD CONSTRAINT check_salary_minimum
CHECK (Salary > 7000);

![constraint 3.1 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/constraint3.1.png)
![constraint 3.2 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/constraint3.2.png)


Index:

The purpose of an index is to allow the database to find data quickly without scanning all the rows in a table, thereby reducing execution time.

1. A index on the column ginstructor in the GUIDENCE table.

CREATE INDEX index_ginstructor 
ON GUIDENCE (ginstructor);

![index 1.1 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/index1.1.png)
![index 1.2 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/index1.2.png)
![index 1.3 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/index1.3.png)


2. A index on the column Eseniority in the EMPLOYEE table.

CREATE INDEX index_eseniority 
ON EMPLOYEE (Eseniority);

![index 2.1 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/index2.1.png)
![index 2.2 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/index2.2.png)
![index 2.3 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/index2.3.png)


3. A index on the column Stype in the SHIFT table.

CREATE INDEX index_stype 
ON SHIFT (Stype);

![index 3.1 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/index3.1.png)
![index 3.2 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/index3.2.png)
![index 3.3 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/index3.3.png)


Integration stage:

--create new DSD and ERD files:

DSD new DB (design):
![DSDdesign image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/DSDdesign.png)

ERD new DB (design):
![ERDdesign image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/ERDdesign.png)

DSD integration:
![DSDintegration image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/DSDintegration.png)

ERD integration:
![ERDintegration image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/ERDintegration.png)



--stage 1: update the new schema's fields so it's compatible with the old schema (for example update the id so there are not the same as the old ones)

#1:

--update department table because of the constraint with employee table
ALTER TABLE IF EXISTS public.department DROP CONSTRAINT IF EXISTS department_e_id_fkey; --delete the old constraint

ALTER TABLE IF EXISTS public.department
    ADD CONSTRAINT department_e_id_fkey FOREIGN KEY (e_id)
    REFERENCES public.employee (e_id) MATCH SIMPLE
    ON UPDATE CASCADE   
    ON DELETE NO ACTION;

![updateConstraint image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/updateConstraintDepartment.png)

#2

--update workship table because of the constraint with employee table
ALTER TABLE IF EXISTS public.employee_workship DROP CONSTRAINT IF EXISTS employee_workship_e_id_fkey; --delete the old constraint

ALTER TABLE IF EXISTS public.employee_workship
    ADD CONSTRAINT employee_workship_e_id_fkey FOREIGN KEY (e_id)
    REFERENCES public.employee (e_id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE NO ACTION;

![updateConstraint image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/updateConstraintWorkship.png)

#3
--Update the PK in the tables

example: update employee table - id field
UPDATE public.employee 
SET e_id = e_id + 20000;

![updateEmployee image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/updateEmployeeID.png)

--stage 2: update the new schema's fields so it's names will be the same as the old schema (for example update the name of the field in employee table from e_id to Eid)

explain:
In order to combin similiar tables (such as EMPLOYEE table) we needed make sure that the names of the tables we want to combine are the same name, the column's names are the same, and if there are one or more column that exist in one table and not exist in the other - we need to add this column and the values there will be NULL.
note: In EMPLOYEE table we defined the name field as one filed for both first name and last name. In the new given backup the name filed was seperated to first name and last name so we concat them to one field.

   examples:

  --Rename e_id to Eid
  ALTER TABLE employee 
  RENAME COLUMN e_id TO Eid;

  --Union employee first name and last name to one field called Ename
  ALTER TABLE employee 
  ADD COLUMN Ename VARCHAR(255);
  UPDATE employee 
  SET Ename = CONCAT_WS(' ', first_name, last_name);
  ALTER TABLE employee 
  DROP COLUMN first_name,
  DROP COLUMN last_name;





--stage 3: add the constraints to the schemas - because the sependencies were not preserved when we imported the tabeles into the new DB.

example:

ALTER TABLE public.assignTo 
ADD CONSTRAINT fk_guidence_assignTo
FOREIGN KEY (Gid) REFERENCES public.guidence(Gid); 

##VIEWS:##

CREATE OR REPLACE VIEW- in order to the view table will be more dinamic- it's possible to make changes on the table we declar that if the table isn't exist- create it. and if it's already exist so just change it.

--VIEW 1. Employee assignment to each shift that any branch exists to. 
CREATE OR REPLACE VIEW public.v_branch_shifts_summary AS
SELECT 
    s.Sid AS shift_id,
    s.Sdate AS shift_date,
    s.Stype AS shift_type,
    s.Bid AS branch_id,
    e.Eid AS employee_id,
    e.Ename AS employee_name
FROM 
    public.shift s
JOIN 
    public.employee e ON s.semp_num = e.Eid
WHERE 
    s.Bid IS NOT NULL;

![view1 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/selectView1.png)

    --queries to check the view:

    --return all shifts assigned to employee with id 4, ordered by shift date.

    SELECT shift_id, shift_date, shift_type, employee_name
    FROM public.v_branch_shifts_summary
    WHERE employee_id = 4
    ORDER BY shift_date ASC;
![view1.1 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/view1.1.png)

    --return the total number of shifts assigned to each branch.

    SELECT branch_id, COUNT(shift_id) AS total_shifts
    FROM public.v_branch_shifts_summary
    GROUP BY branch_id;
![view1.2 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/view1.2.png)
    

--VIEW 2. Logistics supplier orders with material details and current stock levels.

CREATE OR REPLACE VIEW public.v_logistics_supplier_orders AS
SELECT 
    o.order_id,
    o.order_date,
    o.order_status,
    o.total AS order_total_cost,
    s.company_name AS supplier_name,
    s.phone AS supplier_phone,
    rm.r_name AS material_name,
    rm.stock_quantity AS current_stock
FROM 
    public.supplyorder o
JOIN 
    public.supplier s ON o.s_id = s.s_id 
JOIN 
    public.includes inc ON o.order_id = inc.order_id
JOIN 
    public.rawmaterial rm ON inc.r_id = rm.r_id;

![view2 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/selectView2.png)

--queries to check the view:

--return all orders where the current stock of the material is less than 100, ordered by current stock ascending.

    SELECT 
    material_name, 
    current_stock, 
    supplier_name, 
    supplier_phone,
    order_date
FROM 
    public.v_logistics_supplier_orders
WHERE 
    current_stock < 100
ORDER BY 
    current_stock ASC;
![view2.1 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/selectView2.1.png)

    --return the maximum order total cost for each material, along with the material name and the total

    number of times it has been ordered, ordered by highest order cost descending.
    SELECT 
    material_name, 
    MAX(order_total_cost) AS highest_order_cost,
    COUNT(order_id) AS total_times_ordered
FROM 
    public.v_logistics_supplier_orders
GROUP BY 
    material_name
ORDER BY 
    highest_order_cost DESC;
![view2.2 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/selectView2.2.png)


--VIEW 3. Select employee name, role, training instructor, training date, and training location for all employees who have participated in any guidance sessions.

CREATE OR REPLACE VIEW v_employee_training_participation AS
SELECT 
    e.ename AS employee_name,
    e.erole AS employee_role,
    g.ginstructor AS instructor_name,
    g.gdate AS training_date,
    g.glocation AS training_location
FROM 
    employee e
JOIN 
    assignto a ON e.eid = a.eid     
JOIN 
    guidence g ON a.gid = g.gid; 

 ![view3 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/selectView3.png)   

    --queries to check the view:

    --Return how many training sessions have been held at each location, ordered by the number of sessions in descending order.
    SELECT 
    training_location, 
    COUNT(*) AS sessions_count
FROM 
    v_employee_training_participation
GROUP BY 
    training_location
ORDER BY 
    sessions_count DESC;

![view3.1 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/view3.1.png)


    --Return all the employees who have participated in training sessions with a specific instructor- Yossi peretz.
    SELECT 
    training_date, 
    training_location, 
    employee_name
FROM 
    v_employee_training_participation
WHERE 
    instructor_name = 'Yossi Peretz' 
ORDER BY 
    training_date ASC;

![view3.2 image](https://github.com/sarit-trevitz/MinipHR/blob/main/images/view3.2.png)







