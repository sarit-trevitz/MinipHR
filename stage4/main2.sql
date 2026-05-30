
--trigger
-- Description: Trigger function that automatically restocks raw materials by adding 100 
--              units to Stock_Quantity whenever a new item is added to the includes table.
CREATE OR REPLACE FUNCTION alert_and_update_material_stock()
RETURNS TRIGGER AS $$
DECLARE
    v_material_name VARCHAR(100);
BEGIN

    UPDATE public.rawmaterial
    SET Stock_Quantity = Stock_Quantity + 100
    WHERE R_id = NEW.r_id;

    SELECT R_name INTO v_material_name 
    FROM public.rawmaterial 
    WHERE R_id = NEW.r_id;

    RAISE NOTICE 'Automatic Trigger Notification: Material "%" (ID: %) was added to order %. Stock successfully updated with +100 units.', 
                 v_material_name, NEW.r_id, NEW.order_id;
                 
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Description: trigger function that updates material stock levels after a new record is inserted into the includes table.
CREATE TRIGGER trg_update_material_stock
AFTER INSERT ON public.includes
FOR EACH ROW
EXECUTE FUNCTION alert_and_update_material_stock();





--function
-- Description: function that manages low stock levels and automates the reorder process, while also returning a Ref Cursor with materials currently in pending orders for further analysis.
CREATE OR REPLACE FUNCTION manage_low_stock_and_reorder()
RETURNS REFCURSOR AS $$
DECLARE
    ref_out REFCURSOR := 'reordered_materials_cursor';
    v_mat_id INT;
    v_mat_name VARCHAR(100);
    v_stock INT;
    v_new_order_id INT;
    v_supplier_id INT;
    
    mat_cursor CURSOR FOR 
        SELECT R_id, R_name, Stock_Quantity FROM public.rawmaterial;
BEGIN

    SELECT S_id INTO v_supplier_id FROM public.supplier LIMIT 1;
    IF v_supplier_id IS NULL THEN
        RAISE EXCEPTION 'No suppliers found in the database. Cannot proceed with reorder process.';
    END IF;

    OPEN mat_cursor;
    LOOP
        FETCH mat_cursor INTO v_mat_id, v_mat_name, v_stock;
        EXIT WHEN NOT FOUND;
        
        IF v_stock < 50 THEN
            SELECT COALESCE(MAX(order_id), 0) + 1 INTO v_new_order_id FROM public.supplyorder;
            
            INSERT INTO public.supplyorder (order_id, order_date, order_status, total, s_id)
            VALUES (v_new_order_id, CURRENT_DATE, 'Pending', 100.00, v_supplier_id);
            
            INSERT INTO public.includes (order_id, r_id)
            VALUES (v_new_order_id, v_mat_id);
            
            RAISE NOTICE 'Function generated automated reorder for Material: "%" (Order ID: %).', 
                         v_mat_name, v_new_order_id;
        END IF;
    END LOOP;
    CLOSE mat_cursor;

    OPEN ref_out FOR 
        SELECT DISTINCT rm.R_id, rm.R_name
        FROM public.rawmaterial rm
        JOIN public.includes inc ON rm.R_id = inc.r_id
        JOIN public.supplyorder so ON inc.order_id = so.order_id
        WHERE so.Order_status = 'Pending';
        
    RETURN ref_out;
END;
$$ LANGUAGE plpgsql;






--procedure
-- Description: the procedure call the function that manage low stock and reorder, 
--              and then iterates through the returned Ref Cursor to evaluate the popularity of each material
--              based on the total number of orders,updating prices accordingly.
CREATE OR REPLACE PROCEDURE increase_material_prices_by_orders_amount() AS $$
DECLARE
    v_cursor REFCURSOR;
    v_mat_id INT;
    v_mat_name VARCHAR(100);
    v_total_orders_count INT;
BEGIN

    v_cursor := manage_low_stock_and_reorder();
    
    RAISE NOTICE '--- Procedure starting price evaluation loop via Ref Cursor ---';
    
    LOOP
        FETCH v_cursor INTO v_mat_id, v_mat_name;
        EXIT WHEN NOT FOUND;
        
        SELECT COUNT(*) INTO v_total_orders_count 
        FROM public.includes 
        WHERE r_id = v_mat_id;
        
        IF v_total_orders_count > 5 and v_total_orders_count < 10 THEN
            UPDATE public.rawmaterial 
            SET R_price = R_price * 1.10
            WHERE R_id = v_mat_id;
            
            RAISE NOTICE 'Price Update: Material "%" is highly popular (% orders). Price increased.', 
                         v_mat_name, v_total_orders_count;
                         
        ELSIF v_total_orders_count >= 10 THEN
            UPDATE public.rawmaterial 
            SET R_price = R_price * 1.15 
            WHERE R_id = v_mat_id;
            
            RAISE NOTICE 'Price Update: Material "%" is popular (% orders). Price increased.', 
                         v_mat_name, v_total_orders_count;
        ELSE
            RAISE NOTICE 'Price Analysis: Material "%" has stable demand (% orders). No price change.', 
                         v_mat_name, v_total_orders_count;
        END IF;
        
    END LOOP;
    CLOSE v_cursor;
END;
$$ LANGUAGE plpgsql;





--main function
-- Description: Main function that calls the procedure that increase material prices by orders amount.
DO $$
BEGIN
    RAISE NOTICE '========= MAIN PROGRAM 2: START WORKFLOW =========';
    
    CALL increase_material_prices_by_orders_amount();
    
    RAISE NOTICE '========= MAIN PROGRAM 2: WORKFLOW COMPLETED =========';
END $$;



