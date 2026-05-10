--Delete queries:

--1. Delete the guidances that there are no employees assigned to.
DELETE FROM GUIDENCE
WHERE Gid NOT IN (
    SELECT DISTINCT Gid
    FROM ASSIGNTO
    WHERE Gid IS NOT NULL
);

--2. Delete the employees that are not assigned to any shift.
DELETE FROM ASSIGNTO
WHERE eid IN (SELECT eid FROM EMPLOYEE WHERE eid NOT IN (SELECT eid FROM SCHEDULE WHERE eid IS NOT NULL));
DELETE FROM HAS
WHERE eid IN (SELECT eid FROM EMPLOYEE WHERE eid NOT IN (SELECT eid FROM SCHEDULE WHERE eid IS NOT NULL));
DELETE FROM PARTICIPATE
WHERE eid IN (SELECT eid FROM EMPLOYEE WHERE eid NOT IN (SELECT eid FROM SCHEDULE WHERE eid IS NOT NULL));
DELETE FROM EMPLOYEE
WHERE eid NOT IN (SELECT eid FROM SCHEDULE WHERE eid IS NOT NULL);

--3. Delete the shifts on 2026-05-13 - for example: this day was Election day so all the stores were closed - so the shifts weren't exist.
DELETE FROM SCHEDULE
WHERE Sid IN (
    SELECT Sid 
    FROM SHIFT 
    WHERE Sdate = '2026-05-13'
);
DELETE FROM SHIFT
WHERE Sdate = '2026-05-13';

--Update queries:
--1. Update the salary of each employee who it's seniority is over 5 years by SET func.
UPDATE HAS
SET Hsalary = Hsalary * 1.10
WHERE eid IN (
    SELECT eid 
    FROM EMPLOYEE E 
    WHERE E.Eseniority > 5
);

--2. Update the employee number that are require in a shift so if this is the end of the month - 
--day 29/30/31 - we need to increase the employee numbers by 2.
UPDATE SHIFT
SET Semp_num = Semp_num + 2
WHERE EXTRACT(DAY FROM Sdate) IN (29, 30, 31);

--3. Update the budget of each event that more than 8 employees participate in it by increasing it by 150%.
UPDATE EVENT
SET EVbudget = EVbudget * 1.5
WHERE EVid IN (
    SELECT EVid
    FROM PARTICIPATE
    GROUP BY EVid
    HAVING COUNT(Eid) > 8
);