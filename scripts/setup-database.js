const { Client } = require('pg')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

async function setupDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  })

  try {
    console.log('Connecting to PostgreSQL database...')
    await client.connect()
    console.log('Connected successfully!')

    // Read and execute migration files
    const migrationsDir = path.join(__dirname, '../migrations')
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort()

    console.log(`Found ${migrationFiles.length} migration files`)

    for (const file of migrationFiles) {
      console.log(`Running migration: ${file}`)
      const migrationPath = path.join(migrationsDir, file)
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
      
      try {
        await client.query(migrationSQL)
        console.log(`✅ Migration ${file} completed successfully`)
      } catch (error) {
        console.error(`❌ Error running migration ${file}:`, error.message)
        throw error
      }
    }

    console.log('\n🎉 Database setup completed successfully!')
    console.log('\nTables created:')
    console.log('- contacts')
    console.log('- contact_settings')
    console.log('- testimonials')
    console.log('\nSample data inserted for testimonials and contact settings.')
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

// Check if DATABASE_URL is provided
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required')
  console.log('\nPlease add your PostgreSQL connection string to your .env file:')
  console.log('DATABASE_URL=postgresql://username:password@localhost:5432/database_name')
  process.exit(1)
}

setupDatabase()