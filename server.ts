


/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import "dotenv/config";
import express from "express";
import pg from "pg";
import path from "path";

console.log("DB config:", {
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});

const { Pool } = pg;
const app = express();
const PORT = 3000;

app.use(express.json());

const rawHost = process.env.PGHOST || "localhost";
const host = rawHost.trim();
const rawPort = process.env.PGPORT || "5432";
const port = parseInt(rawPort.trim());
const user = (process.env.PGUSER || "").trim();
const password = (process.env.PGPASSWORD || "").trim();
const rawDatabase = process.env.PGDATABASE || "";
const database = rawDatabase.trim().replace(/^"|"$/g, "");

const pool = new Pool({
  host,
  port,
  user,
  password,
  database,
  ssl: false,
});


const preparePayloadValues = (data: any) => {
  return Object.entries(data).map(([key, value]) => {
    if (
      key.endsWith('_json') || 
      key === 'json_specs' || 
      key === 'supplier_metadata'
    ) {
      return JSON.stringify(value);
    }
    return value;
  });
};

// ==========================================
//           ZONED GENERIC CRUD ROUTER
// ==========================================

// 1. READ (Get All Rows)
app.get("/api/:table", async (req, res) => {
  const { table } = req.params;
  try {
    const { rows } = await pool.query(`SELECT * FROM ${table}`);
    return res.json(rows);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// 2. CREATE (Insert Tuple)
app.post("/api/:table", async (req, res) => {
  const { table } = req.params;
  const keys = Object.keys(req.body);
  const values = preparePayloadValues(req.body);
  
  if (keys.length === 0) {
    return res.status(400).json({ error: "Cannot insert an empty record." });
  }

  const columns = keys.join(", ");
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");

  try {
    const { rows } = await pool.query(
      `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    return res.json(rows[0]);
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
});

// 3. UPDATE (Put Mutation targeting specific PK column)
app.put("/api/crud/:table/:idCol/:idVal", async (req, res) => {
  const { table, idCol, idVal } = req.params;
  const keys = Object.keys(req.body);
  const values = preparePayloadValues(req.body);

  if (keys.length === 0) {
    return res.status(400).json({ error: "No fields provided for update." });
  }

  const setClause = keys.map((key, i) => `${key}=$${i + 1}`).join(", ");

  try {
    const { rows } = await pool.query(
      `UPDATE ${table} SET ${setClause} WHERE ${idCol}=$${keys.length + 1} RETURNING *`,
      [...values, idVal]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: `Record with ${idCol}=${idVal} not found inside ${table}.` });
    }
    return res.json(rows[0]);
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
});

// 4. DELETE (Remove Row)
app.delete("/api/crud/:table/:idCol/:idVal", async (req, res) => {
  const { table, idCol, idVal } = req.params;
  try {
    const result = await pool.query(`DELETE FROM ${table} WHERE ${idCol} = $1`, [idVal]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Target row not found. Zero rows deleted." });
    }
    return res.json({ success: true });
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
});

// ==========================================
//          COMPLEX ADVANCED QUERIES
// ==========================================


app.get("/api/custom-queries/event-participation", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
          E.EVid, 
          E.EVdescription, 
          E.EVtype, 
          COUNT(P.eid) AS EmployeeCount
      FROM EVENT E
      LEFT JOIN PARTICIPATE P ON E.EVid = P.evid
      GROUP BY E.EVid, E.EVdescription, E.EVtype
      ORDER BY EmployeeCount ASC;
    `);
    return res.json(rows);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});


app.get("/api/custom-queries/minimum-roles", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT R.Rid, R.Rname, COUNT(H.Eid) AS EmployeeCount
      FROM Role R
      LEFT JOIN Has H ON R.Rid = H.Rid
      GROUP BY R.Rid, R.Rname
      HAVING COUNT(H.Eid) <= ALL (
          SELECT COUNT(Eid)
          FROM Has
          GROUP BY Rid
      );
    `);
    return res.json(rows);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

app.post("/api/custom-procedures/run-hr-pipeline", async (req, res) => {
  try {
    console.log("\n--- [START] HR PIPELINE ANALYSIS ---");

    
    await pool.query(`
      DO $$
      BEGIN
          CALL check_shifts_and_adjust_penalties();
      END $$;
    `);
    console.log("STEP 1: Stored Procedure executed.");

    
    const { rows: employees } = await pool.query(`SELECT * FROM employee`);
    const { rows: hasRelations } = await pool.query(`SELECT * FROM has`);

    console.log(`STEP 2: Fetched ${employees.length} employees and ${hasRelations.length} salary records from 'has' table.`);

    const aboveAvgList: string[] = [];
    const belowAvgList: string[] = [];
    const equalAvgList: string[] = [];

    
    employees.forEach((emp, index) => {
      
      const empId = emp.eid !== undefined ? emp.eid : emp.Eid;
      const empName = emp.ename || emp.Ename || `Unknown #${index}`;
      
      
      const empHasData = hasRelations.find((h: any) => {
        const hasEid = h.eid !== undefined ? h.eid : h.Eid;
        return Number(hasEid) === Number(empId);
      });

      const currentSalary = empHasData ? Number(empHasData.hsalary !== undefined ? empHasData.hsalary : (empHasData.Hsalary || 0)) : 8500;
      const currentRid = empHasData ? (empHasData.rid !== undefined ? empHasData.rid : empHasData.Rid) : null;

      
      const roleSalaries = hasRelations
        .filter((h: any) => {
          const hasRid = h.rid !== undefined ? h.rid : h.Rid;
          return hasRid === currentRid;
        })
        .map((h: any) => Number(h.hsalary !== undefined ? h.hsalary : (h.Hsalary || 0)));
        
      const avgSalary = roleSalaries.length > 0 
        ? roleSalaries.reduce((a, b) => a + b, 0) / roleSalaries.length 
        : 8000;

      const salaryDifference = currentSalary - avgSalary;

      
      console.log(`Employee: ${empName} | Salary: ${currentSalary} | Role Avg: ${avgSalary.toFixed(2)} | Diff: ${salaryDifference.toFixed(2)}`);

      
      if (salaryDifference > 3) {
        aboveAvgList.push(empName);
      } else if (salaryDifference < -3) {
        belowAvgList.push(empName);
      } else {
        equalAvgList.push(empName);
      }
    });

    console.log(`STEP 3: Distribution Summary -> Above: ${aboveAvgList.length} | Below: ${belowAvgList.length} | Equal: ${equalAvgList.length}`);
    console.log("--- [END] HR PIPELINE ANALYSIS ---\n");

    return res.json({ 
      success: true, 
      aboveAvg: aboveAvgList, 
      belowAvg: belowAvgList, 
      equalAvg: equalAvgList
    });

  } catch (e: any) {
    console.error("❌ HR PIPELINE ERROR:", e.message);
    return res.status(500).json({ error: e.message });
  }
});



app.post("/api/custom-procedures/run-supply-pipeline", async (req, res) => {
  try {
    console.log("\n--- [START] SUPPLY PIPELINE ACTIVATED ---");

    
    await pool.query(`
      DO $$
      BEGIN
          CALL increase_material_prices_by_orders_amount();
      END $$;
    `);
    console.log("STEP 1: Procedure 'increase_material_prices_by_orders_amount' executed successfully.");

    const todayOrdersQuery = `
      SELECT order_id 
      FROM supplyorder 
      WHERE order_date = CURRENT_DATE;
    `;
    const { rows: todayOrders } = await pool.query(todayOrdersQuery);
    const todayOrderIds = todayOrders.map(o => Number(o.order_id));
    
    console.log(`STEP 2: Found ${todayOrderIds.length} orders created TODAY. IDs:`, todayOrderIds);

    if (todayOrderIds.length === 0) {
      console.log("--> No orders generated today. Exiting backend flow cleanly.");
      return res.json({ reordered: [], priceIncreased: [] });
    }

    const includesQuery = `
      SELECT DISTINCT r_id 
      FROM includes 
      WHERE order_id = ANY($1::int[]);
    `;
    const { rows: linkedItems } = await pool.query(includesQuery, [todayOrderIds]);
    const reorderedMaterialIds = linkedItems.map(item => Number(item.r_id));
    console.log(`STEP 3: Mapped Raw Material IDs linked to today's orders:`, reorderedMaterialIds);

    if (reorderedMaterialIds.length === 0) {
      return res.json({ reordered: [], priceIncreased: [] });
    }

    const reorderedList: string[] = [];
    const priceIncreasedList: string[] = [];

    const popularityQuery = `
      SELECT r_id, COUNT(*) as total_count 
      FROM includes 
      WHERE r_id = ANY($1::int[])
      GROUP BY r_id;
    `;
    const { rows: counts } = await pool.query(popularityQuery, [reorderedMaterialIds]);

    const namesQuery = `
      SELECT r_id, r_name 
      FROM rawmaterial 
      WHERE r_id = ANY($1::int[]);
    `;
    const { rows: materials } = await pool.query(namesQuery, [reorderedMaterialIds]);

    materials.forEach(mat => {
      const matId = Number(mat.r_id);
      const matName = mat.r_name || `Material #${matId}`;

      reorderedList.push(matName);

      const matCountObj = counts.find(c => Number(c.r_id) === matId);
      const totalCount = matCountObj ? Number(matCountObj.total_count) : 0;

      if (totalCount > 5) {
        priceIncreasedList.push(matName);
      }
    });

    console.log("STEP 4: Output lists successfully assembled.");
    console.log(" -> Reordered Array:", reorderedList);
    console.log(" -> Price Increased Array:", priceIncreasedList);
    console.log("--- [END] SUPPLY PIPELINE FLOW COMPLETED ---\n");

    return res.json({ 
      reordered: reorderedList, 
      priceIncreased: priceIncreasedList 
    });

  } catch (e: any) {
    console.error("❌ CRITICAL PIPELINE EXCEPTION:", e.message);
    return res.status(500).json({ error: e.message });
  }
});

app.post("/api/database/query", async (req, res) => {
  const { queryId } = req.body;
  const queryMap: Record<string, string> = {
    Q1: `SELECT r.rname, AVG(e.salary) FROM employee e JOIN role r ON e.rid = r.rid GROUP BY r.rname;`,
    Q2: `SELECT b.bname, COUNT(s.sid) FROM branch b JOIN shift s ON b.bid = s.bid GROUP BY b.bname;`
  };

  if (!queryMap[queryId]) {
    return res.status(400).json({ error: `Query ID '${queryId}' is not defined inside mapping metadata.` });
  }

  try {
    const { rows } = await pool.query(queryMap[queryId]);
    return res.json({ result: rows });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

app.post("/api/database/procedure/:procId", async (req, res) => {
  const { procId } = req.params;
  try {
    if (procId === "P1") {
      const { minSeniority, multiplier } = req.body;
      await pool.query("CALL update_salary_by_seniority($1, $2)", [parseInt(minSeniority), parseFloat(multiplier)]);
      return res.json({ effectSummary: `Procedure P1 activated: Salary modified for seniority >= ${minSeniority}.` });
    } 
    if (procId === "P2") {
      const { amount } = req.body;
      await pool.query("SELECT check_budget_trigger_simulation($1)", [parseFloat(amount)]);
      return res.json({ effectSummary: `Procedure P2 activated: Budget validated against capacity constraint rules.` });
    }
    return res.status(400).json({ error: "Unknown procedure activation token." });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

app.get("/api/database/metadata", async (req, res) => {
  try {
    const tablesQuery = `
      SELECT table_name as name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `;
    const { rows: tables } = await pool.query(tablesQuery);
    return res.json({ tables, routines: [], indexes: [] });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", async () => {
    try {
      const client = await pool.connect();
      await client.query("SELECT 1");
      client.release();
      console.log("✅ DB connection successful!");
    } catch (err: any) {
      console.error("❌ DB connection FAILED:", err.message);
    }
    console.log(`[SERVER] Running on port ${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Critical server startup crash:", err);
});




