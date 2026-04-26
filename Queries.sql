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
    G.Gid, 
    R.Rname,
    H.Eid
FROM GUIDENCE G
INNER JOIN ASSIGNTO A ON G.Gid = A.Gid
INNER JOIN HAS H ON A.Eid = H.Eid
INNER JOIN ROLE R ON H.Rid = R.Rid;
