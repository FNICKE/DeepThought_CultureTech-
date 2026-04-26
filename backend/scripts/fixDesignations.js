const pool = require("../config/db");

async function fixDesignations() {
  try {
    console.log("Connecting to database...");
    
    const sql = `
      ALTER TABLE employees 
      MODIFY COLUMN designation ENUM(
        'Fullstack Developer', 'Frontend Developer', 'Backend Developer', 
        'UI/UX Designer', 'QA Engineer', 'Project Manager',
        'Mason', 'Electrician', 'Plumber', 'Supervisor', 'Helper'
      ) NOT NULL DEFAULT 'Fullstack Developer'
    `;

    await pool.query(sql);
    
    console.log("-----------------------------------------");
    console.log("SUCCESS: Database ENUM updated!");
    console.log("You can now store IT roles (Developers, Designers, etc.)");
    console.log("-----------------------------------------");
    
    process.exit(0);
  } catch (error) {
    console.error("ERROR: Failed to update database.");
    console.error(error.message);
    process.exit(1);
  }
}

fixDesignations();
