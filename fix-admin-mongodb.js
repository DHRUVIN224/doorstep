/*
 * MongoDB script to fix admin account
 * Copy and paste this into MongoDB shell or MongoDB Compass
 */

// Connect to your database (this step might not be needed if you're already connected)
// use DoorstepserviceDB

// Find the admin user
const adminUser = db.login_tbs.findOne({ role: "admin" });
print("Found admin user:", adminUser);

// Update admin user to add status field if it's missing
if (!adminUser.status) {
  print("Admin user is missing status field. Updating...");
  
  db.login_tbs.updateOne(
    { _id: adminUser._id },
    { $set: { status: "1" } }
  );
  
  // Verify update
  const updatedAdmin = db.login_tbs.findOne({ _id: adminUser._id });
  print("Updated admin user:", updatedAdmin);
} else {
  print("Admin user already has status field:", adminUser.status);
}

print("Admin update completed. Please try logging in now."); 