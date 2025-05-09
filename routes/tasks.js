const express = require("express");
const pool = require("../db");
const ExcelJS = require("exceljs");
const router = express.Router();
const multer = require("multer");
const xlsx = require("xlsx");
const upload = multer({ storage: multer.memoryStorage() });

const { parse } = require("date-fns");

function excelDateToISO(excelDate) {
  if (typeof excelDate === "number") {
    const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
    return date.toISOString().split("T")[0]; // "YYYY-MM-DD"
  }
  if (typeof excelDate === "string") {
    // Match DD-MM-YYYY and convert to YYYY-MM-DD
    const [day, month, year] = excelDate.split("-");
    if (day && month && year) {
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
  }
  return excelDate; // fallback
}

// Create task
router.post("/", async (req, res) => {
  const { title, description, effort, due_date, user_id } = req.body;
  const result = await pool.query(
    "INSERT INTO tasks (title, description, effort, due_date, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [title, description, effort, due_date, user_id]
  );
  res.json(result.rows[0]);
});

// Get tasks for user
router.get("/:userId", async (req, res) => {
  const result = await pool.query("SELECT * FROM tasks WHERE user_id = $1", [
    req.params.userId,
  ]);
  res.json(result.rows);
});

// Update task
router.put("/:id", async (req, res) => {
  const { title, description, effort, due_date } = req.body;
  const result = await pool.query(
    "UPDATE tasks SET title=$1, description=$2, effort=$3, due_date=$4 WHERE id=$5 RETURNING *",
    [title, description, effort, due_date, req.params.id]
  );
  res.json(result.rows[0]);
});

// Delete task
router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM tasks WHERE id=$1", [req.params.id]);
  res.sendStatus(204);
});

// Export tasks to Excel for a user
router.get("/export/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query("SELECT * FROM tasks WHERE user_id = $1", [
      userId,
    ]);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tasks");

    worksheet.columns = [
      { header: "task_id", key: "id" },
      { header: "title", key: "title" },
      { header: "description", key: "description" },
      { header: "effort", key: "effort" },
      { header: "due_date", key: "due_date" },
      { header: "user_id", key: "user_id" },
    ];

    // Convert due_date to dd-mm-yyyy string
    const formattedRows = result.rows.map((row) => {
      const dateObj = new Date(row.due_date);
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const year = dateObj.getFullYear();
      return {
        ...row,
        due_date: `${day}-${month}-${year}`,
      };
    });
    worksheet.addRows(formattedRows);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=tasks.xlsx");
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Error generating Excel file:", err);
    res.status(500).send("Failed to export tasks.");
  }
});

// Import tasks from Excel/CSV
router.post("/import", upload.single("file"), async (req, res) => {
  console.log("hin");
  try {
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const tasks = xlsx.utils.sheet_to_json(sheet);

    for (const task of tasks) {
      const { title, description, effort, user_id } = task;
      const due_date = excelDateToISO(task.due_date);

      if (title && description && effort && due_date && user_id) {
        await pool.query(
          "INSERT INTO tasks (title, description, effort, due_date, user_id) VALUES ($1, $2, $3, $4, $5)",
          [title, description, effort, due_date, user_id]
        );
      }
    }
    res.status(200).send("Tasks imported successfully.");
  } catch (err) {
    console.error("Import error:", err);
    res.status(500).send("Failed to import tasks.");
  }
});

module.exports = router;
