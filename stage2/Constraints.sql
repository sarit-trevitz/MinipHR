--1. A constraint to ensure that the number of employees required for a shift is at least 2.
ALTER TABLE SHIFT
ADD CONSTRAINT check_minimum_employees 
CHECK (Semp_num >= 2);

--2. A constraint to ensure that the branch phone number follows a specific format (e.g., XXX-XXX-XXXX).
ALTER TABLE BRANCH
ADD CONSTRAINT chk_phone_format
CHECK (Bphone SIMILAR TO '[0-9]{3}-[0-9]{3}-[0-9]{4}');

--3. A constraint to ensure that the salary in the HAS table is above a certain threshold.  
ALTER TABLE HAS
ADD CONSTRAINT check_salary_minimum
CHECK (Salary > 7000);