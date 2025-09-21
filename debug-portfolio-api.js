// Debug script for Portfolio API POST endpoint
const debugPortfolioAPI = async () => {
  const baseUrl = 'http://localhost:3000';

  console.log('🔍 Debugging Portfolio API POST endpoint...');
  console.log('Base URL:', baseUrl);

  // Test 1: Minimal data (this works)
  console.log('\n--- Test 1: Minimal Project (Known to work) ---');
  const minimalProject = {
    name: 'Debug Test Minimal'
  };

  try {
    const response = await fetch(`${baseUrl}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(minimalProject)
    });
    console.log('✅ Minimal test status:', response.status);
    if (response.ok) {
      const result = await response.json();
      console.log('Created project ID:', result.id);
    }
  } catch (error) {
    console.error('❌ Minimal test failed:', error.message);
  }

  // Test 2: Add fields one by one to identify the problematic field
  const testFields = [
    { name: 'Debug Test 2', description: 'Testing description field' },
    { name: 'Debug Test 3', status: 'planning' },
    { name: 'Debug Test 4', priority: 'medium' },
    { name: 'Debug Test 5', type: 'Web Development' },
    { name: 'Debug Test 6', budget: 5000 },
    { name: 'Debug Test 7', estimated_budget: 5000 },
    { name: 'Debug Test 8', progress: 0 },
    { name: 'Debug Test 9', manager: 'Test Manager' },
    { name: 'Debug Test 10', created_by: 'API Test' },
    { name: 'Debug Test 11', tasks_total: 10 },
    { name: 'Debug Test 12', tasks_completed: 0 },
  ];

  for (let i = 0; i < testFields.length; i++) {
    const testData = testFields[i];
    console.log(`\n--- Test ${i + 2}: Adding field(s) ---`);
    console.log('Data:', JSON.stringify(testData, null, 2));

    try {
      const response = await fetch(`${baseUrl}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });

      console.log('Status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Success - Created project ID:', result.id);
      } else {
        const errorText = await response.text();
        console.error('❌ Failed:', errorText);
        break; // Stop at first failure to identify the problematic field
      }
    } catch (error) {
      console.error('❌ Error:', error.message);
      break;
    }
  }

  // Test 3: Test with date fields (these might be causing issues)
  console.log('\n--- Test: Date Fields ---');
  const dateTest = {
    name: 'Debug Date Test',
    start_date: '2024-01-01',
    end_date: '2024-12-31'
  };

  try {
    const response = await fetch(`${baseUrl}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dateTest)
    });

    console.log('Date test status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Date test success - ID:', result.id);
    } else {
      const errorText = await response.text();
      console.error('❌ Date test failed:', errorText);
    }
  } catch (error) {
    console.error('❌ Date test error:', error.message);
  }

  // Test 4: Test with client_id (UUID field)
  console.log('\n--- Test: UUID Fields ---');
  const uuidTest = {
    name: 'Debug UUID Test',
    client_id: '123e4567-e89b-12d3-a456-426614174000' // Valid UUID format
  };

  try {
    const response = await fetch(`${baseUrl}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(uuidTest)
    });

    console.log('UUID test status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ UUID test success - ID:', result.id);
    } else {
      const errorText = await response.text();
      console.error('❌ UUID test failed:', errorText);
    }
  } catch (error) {
    console.error('❌ UUID test error:', error.message);
  }
};

// Run the debug tests
debugPortfolioAPI().catch(console.error);