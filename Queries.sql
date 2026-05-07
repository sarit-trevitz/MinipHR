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

--2. Return the roles  and id of the employees who assign to each guidance.
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
