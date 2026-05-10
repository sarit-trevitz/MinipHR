--Select queries:

--1. Return how many employees are assigned to each role.
SELECT 
    R.Rid,
    R.Rname, 
    COUNT(H.Eid) AS EmployeeCount
FROM ROLE R, HAS H
WHERE R.Rid = H.Rid
GROUP BY R.Rid, R.Rname;

SELECT 
    R.Rid,
    Rname, 
    COUNT(Eid) AS EmployeeCount
FROM ROLE
NATURAL JOIN HAS
GROUP BY R.Rid, R.Rname;

--2. Return the roles and id of the employees who assign to each guidance.
WITH GuidanceRoles AS (              
    SELECT DISTINCT A.Gid, H.Rid , H.Eid     
    FROM ASSIGNTO A                   
    JOIN HAS H ON A.Eid = H.Eid      
)                                     
SELECT GR.Gid, R.Rname, GR.Eid                
FROM GuidanceRoles GR                 
JOIN ROLE R ON GR.Rid = R.Rid        
ORDER BY GR.Gid;                      

SELECT 
    A.Gid, 
    R.Rname,
    H.Eid
FROM ASSIGNTO A
INNER JOIN HAS H ON A.Eid = H.Eid
INNER JOIN ROLE R ON H.Rid = R.Rid;

--3. Return the number of empolyees who participate in each event.

SELECT 
    E.EVid, 
    E.EVdescription, 
    E.EVtype, 
    COUNT(P.eid) AS EmployeeCount
FROM EVENT E
LEFT JOIN PARTICIPATE P ON E.EVid = P.evid
GROUP BY E.EVid, E.EVdescription, E.EVtype
ORDER BY EmployeeCount ASC;

SELECT 
    E.EVid, 
    E.EVdescription, 
    E.EVtype,
    (SELECT COUNT(P.eid) 
     FROM PARTICIPATE P 
     WHERE P.EVid = E.EVid) AS EmployeeCount
FROM EVENT E
ORDER BY EmployeeCount ASC;

--4. Return the number of shifts for each shift type in each month of the year 2026.
SELECT 
    EXTRACT(MONTH FROM sdate) AS Month,
    EXTRACT(YEAR FROM sdate) AS Year,
    stype AS ShiftType,
    COUNT(sid) AS ShiftCount
FROM SHIFT
WHERE EXTRACT(YEAR FROM sdate) = 2026
GROUP BY Year, Month, stype
ORDER BY Month ASC, ShiftType ASC;

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

--5. Return the event that the participate in it is the maximum.
SELECT E.*, COUNT(P.Eid) AS EmployeeCount
FROM EVENT E
JOIN PARTICIPATE P ON E.EVid = P.EVid
GROUP BY E.EVid, E.EVDate, E.EVdescription, E.EVtype, E.EVbudget
HAVING COUNT(P.Eid) >= ALL (
    SELECT COUNT(Eid)
    FROM PARTICIPATE
    GROUP BY EVid
);

--6. Return the branches that have at least one employee with seniority greater than 10.
SELECT DISTINCT B.*
FROM Branch B
JOIN Shift S ON B.Bid = S.Bid  
JOIN Schedule SCH ON S.Sid = SCH.Sid
WHERE 10 < ANY (
    SELECT E.Eseniority
    FROM Employee E
    WHERE E.Eid = SCH.Eid
);

--7. Return the employees who are assigned to at least one guidance that Avi Cohen is the instructor of.
SELECT *
FROM Employee E
WHERE EXISTS (
    SELECT *
    FROM AssignTo A
    JOIN Guidence G ON A.Gid = G.Gid
    WHERE A.Eid = E.Eid AND G.Ginstructor = 'Avi Cohen'
);

--8. Return the roles that have the minimum number of employees assigned.
SELECT R.Rid,R.Rname, COUNT(H.Eid) AS EmployeeCount
FROM Role R
LEFT JOIN Has H ON R.Rid = H.Rid
GROUP BY R.Rid, R.Rname
HAVING COUNT(H.Eid) <= ALL (
    SELECT COUNT(Eid)
    FROM Has
    GROUP BY Rid
);