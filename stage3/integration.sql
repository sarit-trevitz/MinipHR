--stage 1: update the new schema's fields so it's compatible with the old schema (for example update the id so there are not the same as the old ones)

--update department table because of the constraint with employee table
ALTER TABLE IF EXISTS public.department DROP CONSTRAINT IF EXISTS department_e_id_fkey; --delete the old constraint

ALTER TABLE IF EXISTS public.department
    ADD CONSTRAINT department_e_id_fkey FOREIGN KEY (e_id)
    REFERENCES public.employee (e_id) MATCH SIMPLE
    ON UPDATE CASCADE   
    ON DELETE NO ACTION;

--update employee table - id field
UPDATE public.employee 
SET e_id = e_id + 20000;



--update workship table because of the constraint with employee table
ALTER TABLE IF EXISTS public.employee_workship DROP CONSTRAINT IF EXISTS employee_workship_e_id_fkey; --delete the old constraint

ALTER TABLE IF EXISTS public.employee_workship
    ADD CONSTRAINT employee_workship_e_id_fkey FOREIGN KEY (e_id)
    REFERENCES public.employee (e_id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE NO ACTION;

--update shift table - id field
UPDATE public.shift 
SET Sid = Sid + 20000;



--stage 2: update the new schema's fields so it's names will be the same as the old schema (for example update the name of the field in employee table from e_id to Eid)

--Union employee first name and last name to one field called Ename
ALTER TABLE employee 
ADD COLUMN Ename VARCHAR(255);

UPDATE employee 
SET Ename = CONCAT_WS(' ', first_name, last_name);

ALTER TABLE employee 
DROP COLUMN first_name,
DROP COLUMN last_name;



--Rename e_id to Eid    
ALTER TABLE employee 
RENAME COLUMN e_id TO Eid;

--Rename role to Erole
ALTER TABLE employee 
RENAME COLUMN role TO Erole;

--Add column Eemail to employee
ALTER TABLE employee 
ADD COLUMN Eemail VARCHAR(100);

--Rename workship table name to shift
ALTER TABLE work_ship RENAME TO shift;

--Rename workship table name to shift
ALTER TABLE employee_workship RENAME TO schedule;


--stage 3: add the constraints to the schemas - because the sependencies were not preserved when we imported the tabeles into the new DB.

ALTER TABLE public.assignTo 
ADD CONSTRAINT fk_guidence_assignTo
FOREIGN KEY (Gid) REFERENCES public.guidence(Gid); 

ALTER TABLE public.assignTo 
ADD CONSTRAINT fk_employee_assignTo
FOREIGN KEY (Eid) REFERENCES public.employee(Eid); 

ALTER TABLE public.shift 
ADD CONSTRAINT fk_branch_shift
FOREIGN KEY (Bid) REFERENCES public.branch(Bid); 

ALTER TABLE public.participate 
ADD CONSTRAINT fk_event_paricipate
FOREIGN KEY (EVid) REFERENCES public.event(EVid); 

ALTER TABLE public.participate
ADD CONSTRAINT fk_employee_participate
FOREIGN KEY (Eid) REFERENCES public.employee(Eid); 
