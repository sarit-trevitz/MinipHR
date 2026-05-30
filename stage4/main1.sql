-- trigger:
-- Description: calculates the average salary for a role and compares it to the updated salary of an employee.
CREATE OR REPLACE FUNCTION compare_salary_to_role_average()
RETURNS TRIGGER AS $$
DECLARE
    v_role_name VARCHAR(100);
    v_avg_salary NUMERIC;
BEGIN

    SELECT Rname INTO v_role_name FROM public.Role WHERE Rid = NEW.Rid;

    SELECT AVG(hsalary) INTO v_avg_salary 
    FROM public.Has 
    WHERE Rid = NEW.Rid;

    IF NEW.hsalary > v_avg_salary THEN
        RAISE NOTICE 'Salary Analysis: Employee ID % (Role: %) has a salary of %, which is ABOVE the role average of %.', 
                     NEW.Eid, v_role_name, NEW.hsalary,v_avg_salary;
    ELSIF NEW.hsalary < v_avg_salary THEN
        RAISE NOTICE 'Salary Analysis: Employee ID % (Role: %) has a salary of %, which is BELOW the role average of %.', 
                     NEW.Eid, v_role_name, NEW.hsalary,v_avg_salary;
    ELSE
        RAISE NOTICE 'Salary Analysis: Employee ID % (Role: %) has a salary of %, which is EQUAL to the role average of %.', 
                     NEW.Eid, v_role_name, NEW.hsalary,v_avg_salary;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Description: trigger that analyzes salary updates against the role average.
CREATE TRIGGER trg_analyze_salary_against_average
AFTER UPDATE ON public.Has
FOR EACH ROW
EXECUTE FUNCTION compare_salary_to_role_average();


--functuion
-- Description: Iterates through all employees, evaluates guidance sessions,and changes salaries accordingly,
--              while returning a Ref Cursor of promoted employees for further analysis.
CREATE OR REPLACE FUNCTION change_salaries_by_guidnece_attendance()
RETURNS REFCURSOR AS $$
DECLARE
    ref_out REFCURSOR := 'promoted_employees_cursor';
    v_emp RECORD;
    v_training_count INT;
BEGIN
    RAISE NOTICE '--- Function: Evaluating guidance sessions and applying raises ---';

    FOR v_emp IN SELECT Eid, Ename FROM public.employee LOOP

        SELECT COUNT(*) INTO v_training_count 
        FROM public.assignto 
        WHERE Eid = v_emp.Eid;

        BEGIN
            IF v_training_count > 3 THEN
                UPDATE public.Has 
                SET hsalary = hsalary * 1.05 
                WHERE Eid = v_emp.Eid;
       
            ELSIF v_training_count = 0 THEN
                UPDATE public.Has 
                SET hsalary = hsalary * 0.95 
                WHERE Eid = v_emp.Eid;
                
            END IF;
            
        EXCEPTION
      
            WHEN CHECK_VIOLATION THEN
                RAISE WARNING 'Function Catch: Salary reduction failed for %! Cannot fall below 7000.', v_emp.Ename;
        END;
        
    END LOOP;


    OPEN ref_out FOR 
        SELECT h.Eid, e.Ename 
        FROM public.Has h
        JOIN public.employee e ON h.Eid = e.Eid
        JOIN public.assignto ast ON h.Eid = ast.Eid
        GROUP BY h.Eid, e.Ename
        HAVING COUNT(ast.gid) > 3;
        
    RETURN ref_out;
END;
$$ LANGUAGE plpgsql;



-- 3. procedure
-- Description: call the function and for each promoted employee, 
--              it counts how many shift he has in the current month and if he has less than 10 shifts, his salary decrase by 5%.
CREATE OR REPLACE PROCEDURE check_shifts_and_adjust_penalties() AS $$
DECLARE
    v_cursor REFCURSOR;
    v_eid INT;
    v_ename VARCHAR(100);
    v_shift_count INT;
BEGIN

    v_cursor := change_salaries_by_guidnece_attendance();
    
    RAISE NOTICE '--- Procedure: Evaluating monthly shift loads via Ref Cursor ---';
    

    LOOP
        FETCH v_cursor INTO v_eid, v_ename;
        EXIT WHEN NOT FOUND;
        
        SELECT COUNT(*) INTO v_shift_count 
        FROM public.schedule 
        WHERE Eid = v_eid;
        
        IF v_shift_count < 10 THEN
            BEGIN
                UPDATE public.Has 
                SET hsalary = hsalary * 0.95 
                WHERE Eid = v_eid;
                RAISE NOTICE 'Procedure Penalty applied to %.', v_ename;
            
            EXCEPTION
                WHEN CHECK_VIOLATION THEN
                    RAISE WARNING 'Check Violation Catch: Penalty failed for %. Salary cannot fall below 7000.', v_ename;
            END;
        ELSE
            RAISE NOTICE 'Procedure Analysis: % maintains a healthy shift load (% shifts).', v_ename, v_shift_count;
        END IF;
    END LOOP;
    
    CLOSE v_cursor;
END;
$$ LANGUAGE plpgsql;



-- 4.main fuction
-- Description: Main function that call the procedure.
DO $$
BEGIN
    RAISE NOTICE '========= MAIN PROGRAM 1: START WORKFLOW =========';

    CALL check_shifts_and_adjust_penalties();
    
    RAISE NOTICE '========= MAIN PROGRAM 1: WORKFLOW COMPLETED =========';
END $$;