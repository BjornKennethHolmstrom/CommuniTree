// scripts/initRolesAndPermissions.js
require('dotenv').config();
const db = require('../config/database');
const { UserRoles, Permissions, RolePermissions } = require('../src/config/roles');

async function initRolesAndPermissions() {
  const client = await db.getClient();
  
  try {
    // Start transaction
    await client.query('BEGIN');

    console.log('Creating permissions...');
    // Insert permissions
    const permissionValues = Object.entries(Permissions).map(([key, value]) => ({
      name: value,
      description: `Permission to ${key.toLowerCase().replace(/_/g, ' ')}`
    }));

    for (const permission of permissionValues) {
      console.log(`Creating permission: ${permission.name}`);
      await client.query(
        'INSERT INTO permissions (name, description) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
        [permission.name, permission.description]
      );
    }

    console.log('Creating roles...');
    // Insert roles
    const roleValues = Object.entries(UserRoles).map(([key, value]) => ({
      name: value,
      description: `${key.charAt(0)}${key.slice(1).toLowerCase().replace(/_/g, ' ')} role`
    }));

    for (const role of roleValues) {
      console.log(`Creating role: ${role.name}`);
      await client.query(
        'INSERT INTO roles (name, description) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
        [role.name, role.description]
      );
    }

    console.log('Fetching created roles and permissions...');
    // Get all roles and permissions
    const roles = await client.query('SELECT * FROM roles');
    const permissions = await client.query('SELECT * FROM permissions');

    console.log('Creating role-permission mappings...');
    // Create role-permission mappings
    for (const role of roles.rows) {
      const rolePerms = RolePermissions[role.name].permissions;
      console.log(`Adding permissions for role: ${role.name}`);
      for (const permName of rolePerms) {
        const permission = permissions.rows.find(p => p.name === permName);
        if (permission) {
          await client.query(
            'INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [role.id, permission.id]
          );
        }
      }
    }

    // Commit transaction
    await client.query('COMMIT');
    console.log('Successfully initialized roles and permissions');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error initializing roles and permissions:', error);
    throw error;
  } finally {
    console.log('Releasing database client...');
    client.release();
    // Close the pool
    await db.pool.end();
  }
}

// Run the initialization if this script is run directly
if (require.main === module) {
  initRolesAndPermissions()
    .then(() => {
      console.log('Initialization completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Initialization failed:', error);
      process.exit(1);
    });
}

module.exports = initRolesAndPermissions;
