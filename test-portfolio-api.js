// Test script for Portfolio API POST endpoint
const testPortfolioAPI = async () => {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://your-production-domain.com' 
    : 'http://localhost:3000';

  console.log('Testing Portfolio API POST endpoint...');
  console.log('Base URL:', baseUrl);

  // Test data for creating a project
  const testProject = {
    name: 'Test Project API',
    description: 'Testing the Portfolio API POST endpoint',
    status: 'planning',
    priority: 'medium',
    type: 'Web Development',
    budget: 5000,
    estimated_budget: 5000,
    progress: 0,
    manager: 'Test Manager',
    created_by: 'API Test',
    tasks_total: 10,
    tasks_completed: 0
  };

  try {
    console.log('\n--- Testing POST /api/projects ---');
    console.log('Sending data:', JSON.stringify(testProject, null, 2));

    const response = await fetch(`${baseUrl}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(testProject)
    });

    console.log('\nResponse Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error Response:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('\nSuccess! Created project:', result);

    // Test GET endpoint to verify the project was created
    console.log('\n--- Testing GET /api/projects ---');
    const getResponse = await fetch(`${baseUrl}/api/projects`);
    
    if (getResponse.ok) {
      const projects = await getResponse.json();
      console.log(`Found ${projects.length} projects`);
      
      // Find our test project
      const testProjectResult = projects.find(p => p.name === testProject.name);
      if (testProjectResult) {
        console.log('✅ Test project found in database:', testProjectResult.id);
      } else {
        console.log('⚠️ Test project not found in results');
      }
    }

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    
    // Additional debugging information
    if (error.cause) {
      console.error('Cause:', error.cause);
    }
    
    // Check if it's a network error
    if (error.message.includes('fetch')) {
      console.error('This might be a network connectivity issue or CORS problem');
    }
    
    // Check if it's a server error
    if (error.message.includes('500')) {
      console.error('This is a server-side error. Check server logs and database connection.');
    }
    
    // Check if it's a client error
    if (error.message.includes('400')) {
      console.error('This is a client-side error. Check request data format.');
    }
  }
};

// Test minimal required data
const testMinimalProject = async () => {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://your-production-domain.com' 
    : 'http://localhost:3000';

  console.log('\n\n=== Testing Minimal Project Data ===');
  
  const minimalProject = {
    name: 'Minimal Test Project'
  };

  try {
    const response = await fetch(`${baseUrl}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(minimalProject)
    });

    console.log('Minimal test - Status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Minimal project created:', result.id);
    } else {
      const errorText = await response.text();
      console.error('❌ Minimal test failed:', errorText);
    }
  } catch (error) {
    console.error('❌ Minimal test error:', error.message);
  }
};

// Run tests
const runTests = async () => {
  console.log('🚀 Starting Portfolio API Tests');
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('Timestamp:', new Date().toISOString());
  
  await testPortfolioAPI();
  await testMinimalProject();
  
  console.log('\n✨ Tests completed');
};

// Export for use in other files or run directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testPortfolioAPI, testMinimalProject, runTests };