--VIEW 1. Employee assignment to each shift and branch.
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
    public.schedule sch ON s.Sid = sch.Sid 
JOIN 
    public.employee e ON sch.Eid = e.Eid
WHERE 
    s.Bid IS NOT NULL;

    --queries to check the view:
    --return all shifts assigned to employee with id 4, ordered by shift date.
    SELECT shift_id, shift_date, shift_type, employee_name
    FROM v_branch_shifts_summary
    WHERE employee_id = 4
    ORDER BY shift_date ASC;

    --return the total number of shifts assigned to each branch.
    SELECT branch_id, COUNT(shift_id) AS total_shifts
    FROM v_branch_shifts_summary
    GROUP BY branch_id;
    

--VIEW 2. Logistics supplier orders with material details and current stock levels.
CREATE OR REPLACE VIEW v_logistics_supplier_orders AS
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
    supplyorder o
JOIN 
    supplier s ON o.s_id = s.s_id 
JOIN 
    includes inc ON o.order_id = inc.order_id
JOIN 
    rawmaterial rm ON inc.r_id = rm.r_id;


    --queries to check the view:

    --return all orders where the current stock of the material is less than 100, ordered by current stock ascending.
    SELECT 
    material_name, 
    current_stock, 
    supplier_name, 
    supplier_phone,
    order_date
FROM 
    v_logistics_supplier_orders
WHERE 
    current_stock < 100
ORDER BY 
    current_stock ASC;

    --return the maximum order total cost for each material, along with the material name and the total number of times it has been ordered, ordered by highest order cost descending.
    SELECT 
    material_name, 
    MAX(order_total_cost) AS highest_order_cost,
    COUNT(order_id) AS total_times_ordered
FROM 
    v_logistics_supplier_orders
GROUP BY 
    material_name
ORDER BY 
    highest_order_cost DESC;


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




