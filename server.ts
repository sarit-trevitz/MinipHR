


// /**
//  * @license
//  * SPDX-License-Identifier: Apache-2.0
//  */

// import "dotenv/config";
// import express from "express";
// import pg from "pg";
// import path from "path";

// console.log("DB config:", {
//   host: process.env.PGHOST,
//   port: process.env.PGPORT,
//   user: process.env.PGUSER,
//   password: process.env.PGPASSWORD,
//   database: process.env.PGDATABASE,
// });

// const { Pool } = pg;
// const app = express();
// const PORT = 3000;

// app.use(express.json());

// // קונפיגורציית חיבור למסד הנתונים - ניקוי רווחים ומרכאות מהגדרות קובץ ה-env
// const rawHost = process.env.PGHOST || "localhost";
// const host = rawHost.trim();
// const rawPort = process.env.PGPORT || "5432";
// const port = parseInt(rawPort.trim());
// const user = (process.env.PGUSER || "").trim();
// const password = (process.env.PGPASSWORD || "").trim();
// const rawDatabase = process.env.PGDATABASE || "";
// const database = rawDatabase.trim().replace(/^"|"$/g, "");

// const pool = new Pool({
//   host,
//   port,
//   user,
//   password,
//   database,
//   ssl: false,
// });

// /**
//  * פונקציית עזר גנרית שמכינה את הערכים של ה-Body לשאילתת ה-SQL.
//  * היא מזהה שדות שמוגדרים כ-JSON ב-Types וממירה אותם לטקסט ש-Postgres יודע לקבל.
//  */
// const preparePayloadValues = (data: any) => {
//   return Object.entries(data).map(([key, value]) => {
//     if (
//       key.endsWith('_json') || 
//       key === 'json_specs' || 
//       key === 'supplier_metadata'
//     ) {
//       return JSON.stringify(value);
//     }
//     return value;
//   });
// };

// // ==========================================
// //           ZONED GENERIC CRUD ROUTER
// // ==========================================

// // 1. READ (Get All Rows)
// app.get("/api/:table", async (req, res) => {
//   const { table } = req.params;
//   try {
//     const { rows } = await pool.query(`SELECT * FROM ${table}`);
//     return res.json(rows);
//   } catch (e: any) {
//     return res.status(500).json({ error: e.message });
//   }
// });

// // 2. CREATE (Insert Tuple)
// app.post("/api/:table", async (req, res) => {
//   const { table } = req.params;
//   const keys = Object.keys(req.body);
//   const values = preparePayloadValues(req.body);
  
//   if (keys.length === 0) {
//     return res.status(400).json({ error: "Cannot insert an empty record." });
//   }

//   const columns = keys.join(", ");
//   const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");

//   try {
//     const { rows } = await pool.query(
//       `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`,
//       values
//     );
//     return res.json(rows[0]);
//   } catch (e: any) {
//     return res.status(400).json({ error: e.message });
//   }
// });

// // 3. UPDATE (Put Mutation targeting specific PK column)
// app.put("/api/crud/:table/:idCol/:idVal", async (req, res) => {
//   const { table, idCol, idVal } = req.params;
//   const keys = Object.keys(req.body);
//   const values = preparePayloadValues(req.body);

//   if (keys.length === 0) {
//     return res.status(400).json({ error: "No fields provided for update." });
//   }

//   const setClause = keys.map((key, i) => `${key}=$${i + 1}`).join(", ");

//   try {
//     const { rows } = await pool.query(
//       `UPDATE ${table} SET ${setClause} WHERE ${idCol}=$${keys.length + 1} RETURNING *`,
//       [...values, idVal]
//     );
//     if (rows.length === 0) {
//       return res.status(404).json({ error: `Record with ${idCol}=${idVal} not found inside ${table}.` });
//     }
//     return res.json(rows[0]);
//   } catch (e: any) {
//     return res.status(400).json({ error: e.message });
//   }
// });

// // 4. DELETE (Remove Row)
// app.delete("/api/crud/:table/:idCol/:idVal", async (req, res) => {
//   const { table, idCol, idVal } = req.params;
//   try {
//     const result = await pool.query(`DELETE FROM ${table} WHERE ${idCol} = $1`, [idVal]);
//     if (result.rowCount === 0) {
//       return res.status(404).json({ error: "Target row not found. Zero rows deleted." });
//     }
//     return res.json({ success: true });
//   } catch (e: any) {
//     return res.status(400).json({ error: e.message });
//   }
// });

// // ==========================================
// //          COMPLEX ADVANCED QUERIES
// // ==========================================

// /**
//  * אפיקי קצה (Endpoints) חדשים עבור מסך ה-Welcome הראשי
//  * מריצים ישירות את השאילתות והפרוצדורות הפיזיות בתוך ה-PostgreSQL
//  */

// // א. שאילתת אירועים (Query #3 שלך) - מחזירה כמות משתתפים לכל אירוע ממוין עולה
// app.get("/api/custom-queries/event-participation", async (req, res) => {
//   try {
//     const { rows } = await pool.query(`
//       SELECT 
//           E.EVid, 
//           E.EVdescription, 
//           E.EVtype, 
//           COUNT(P.eid) AS EmployeeCount
//       FROM EVENT E
//       LEFT JOIN PARTICIPATE P ON E.EVid = P.evid
//       GROUP BY E.EVid, E.EVdescription, E.EVtype
//       ORDER BY EmployeeCount ASC;
//     `);
//     return res.json(rows);
//   } catch (e: any) {
//     return res.status(500).json({ error: e.message });
//   }
// });

// // ב. שאילתת תפקידים (Query #8 שלך) - מחזירה את התפקידים עם מינימום עובדים אבסולוטי (HAVING <= ALL)
// app.get("/api/custom-queries/minimum-roles", async (req, res) => {
//   try {
//     const { rows } = await pool.query(`
//       SELECT R.Rid, R.Rname, COUNT(H.Eid) AS EmployeeCount
//       FROM Role R
//       LEFT JOIN Has H ON R.Rid = H.Rid
//       GROUP BY R.Rid, R.Rname
//       HAVING COUNT(H.Eid) <= ALL (
//           SELECT COUNT(Eid)
//           FROM Has
//           GROUP BY Rid
//       );
//     `);
//     return res.json(rows);
//   } catch (e: any) {
//     return res.status(500).json({ error: e.message });
//   }
// });

// // ג. הרצת פרוצדורת משאבי אנוש ושכר (Main Program 1)
// app.post("/api/custom-procedures/run-hr-pipeline", async (req, res) => {
//   try {
//     await pool.query(`
//       DO $$
//       BEGIN
//           CALL check_shifts_and_adjust_penalties();
//       END $$;
//     `);
//     return res.json({ success: true, message: "HR pipeline completed inside PostgreSQL catalog node." });
//   } catch (e: any) {
//     return res.status(500).json({ error: e.message });
//   }
// });

// // ד. הרצת פרוצדורת שרשרת אספקה ומלאי (Main Program 2)
// app.post("/api/custom-procedures/run-supply-pipeline", async (req, res) => {
//   try {
//     await pool.query(`
//       DO $$
//       BEGIN
//           CALL increase_material_prices_by_orders_amount();
//       END $$;
//     `);
//     return res.json({ success: true, message: "Supply Chain pipeline completed inside PostgreSQL catalog node." });
//   } catch (e: any) {
//     return res.status(500).json({ error: e.message });
//   }
// });

// // הפעלת שאילתות משלב 2 הישן (נקרא מתוך ה-DatabaseConsole במידה וקיים)
// app.post("/api/database/query", async (req, res) => {
//   const { queryId } = req.body;
//   const queryMap: Record<string, string> = {
//     Q1: `SELECT r.rname, AVG(e.salary) FROM employee e JOIN role r ON e.rid = r.rid GROUP BY r.rname;`,
//     Q2: `SELECT b.bname, COUNT(s.sid) FROM branch b JOIN shift s ON b.bid = s.bid GROUP BY b.bname;`
//   };

//   if (!queryMap[queryId]) {
//     return res.status(400).json({ error: `Query ID '${queryId}' is not defined inside mapping metadata.` });
//   }

//   try {
//     const { rows } = await pool.query(queryMap[queryId]);
//     return res.json({ result: rows });
//   } catch (e: any) {
//     return res.status(500).json({ error: e.message });
//   }
// });

// // הפעלת תתי-תוכניות/פרוצדורות משלב 4 הישן
// app.post("/api/database/procedure/:procId", async (req, res) => {
//   const { procId } = req.params;
//   try {
//     if (procId === "P1") {
//       const { minSeniority, multiplier } = req.body;
//       await pool.query("CALL update_salary_by_seniority($1, $2)", [parseInt(minSeniority), parseFloat(multiplier)]);
//       return res.json({ effectSummary: `Procedure P1 activated: Salary modified for seniority >= ${minSeniority}.` });
//     } 
//     if (procId === "P2") {
//       const { amount } = req.body;
//       await pool.query("SELECT check_budget_trigger_simulation($1)", [parseFloat(amount)]);
//       return res.json({ effectSummary: `Procedure P2 activated: Budget validated against capacity constraint rules.` });
//     }
//     return res.status(400).json({ error: "Unknown procedure activation token." });
//   } catch (e: any) {
//     return res.status(500).json({ error: e.message });
//   }
// });

// // שירות מטא-דאטה
// app.get("/api/database/metadata", async (req, res) => {
//   try {
//     const tablesQuery = `
//       SELECT table_name as name 
//       FROM information_schema.tables 
//       WHERE table_schema = 'public';
//     `;
//     const { rows: tables } = await pool.query(tablesQuery);
//     return res.json({ tables, routines: [], indexes: [] });
//   } catch (e: any) {
//     return res.status(500).json({ error: e.message });
//   }
// });

// // שילוב שרת ה-Vite
// async function bootstrap() {
//   if (process.env.NODE_ENV !== "production") {
//     const { createServer: createViteServer } = await import("vite");
//     const vite = await createViteServer({
//       server: { middlewareMode: true },
//       appType: "spa",
//     });
//     app.use(vite.middlewares);
//   } else {
//     const distPath = path.join(process.cwd(), "dist");
//     app.use(express.static(distPath));
//     app.get("*", (req, res) => {
//       res.sendFile(path.join(distPath, "index.html"));
//     });
//   }

//   app.listen(PORT, "0.0.0.0", async () => {
//     try {
//       const client = await pool.connect();
//       await client.query("SELECT 1");
//       client.release();
//       console.log("✅ DB connection successful!");
//     } catch (err: any) {
//       console.error("❌ DB connection FAILED:", err.message);
//     }
//     console.log(`[SERVER] Running on port ${PORT}`);
//   });
// }

// bootstrap().catch((err) => {
//   console.error("Critical server startup crash:", err);
// });  

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

// קונפיגורציית חיבור למסד הנתונים - ניקוי רווחים ומרכאות מהגדרות קובץ ה-env
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

/**
 * פונקציית עזר גנרית שמכינה את הערכים של ה-Body לשאילתת ה-SQL.
 * היא מזהה שדות שמוגדרים כ-JSON ב-Types וממירה אותם לטקסט ש-Postgres יודע לקבל.
 */
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

// א. שאילתת אירועים (Query #3 שלך) - מחזירה כמות משתתפים לכל אירוע ממוין עולה
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

// ב. שאילתת תפקידים (Query #8 שלך) - מחזירה את התפקידים עם מינימום עובדים אבסולוטי (HAVING <= ALL)
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

// ג. הרצת פרוצדורת משאבי אנוש ושכר (Main Program 1)
app.post("/api/custom-procedures/run-hr-pipeline", async (req, res) => {
  try {
    await pool.query(`
      DO $$
      BEGIN
          CALL check_shifts_and_adjust_penalties();
      END $$;
    `);
    return res.json({ success: true, message: "HR pipeline completed inside PostgreSQL catalog node." });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// ד. הרצת פרוצדורת שרשרת אספקה ומלאי (Main Program 2) - משופר לסנכרון מיידי
app.post("/api/custom-procedures/run-supply-pipeline", async (req, res) => {
  try {
    // 1. הרצת הפרוצדורה שמעדכנת מחירים ומחדשת מלאי
    await pool.query(`
      DO $$
      BEGIN
          CALL increase_material_prices_by_orders_amount();
      END $$;
    `);

    // 2. שליפת הנתונים העדכניים ישירות מהטבלה מיד לאחר הריצה
    const { rows: materials } = await pool.query(`SELECT * FROM RAWMATERIAL`);
    const { rows: includes } = await pool.query(`SELECT * FROM INCLUDES`);

    // 3. החזרת הנתונים המדויקים ישירות לסימולציה בפרונטאנד
    return res.json({ 
      success: true, 
      materials,
      includes,
      message: "Supply Chain pipeline completed and synchronized." 
    });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// הפעלת שאילתות משלב 2 הישן (נקרא מתוך ה-DatabaseConsole במידה וקיים)
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

// הפעלת תתי-תוכניות/פרוצדורות משלב 4 הישן
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

// שירות מטא-דאטה
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

// שילוב שרת ה-Vite
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