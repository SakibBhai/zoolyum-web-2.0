async function testPortfolioGetAPI() {
  console.log('Testing Portfolio GET API...');
  
  try {
    // Test basic GET request
    console.log('\n1. Testing basic GET request:');
    const response1 = await fetch('http://localhost:3000/api/projects');
    console.log('Status:', response1.status);
    console.log('Content-Type:', response1.headers.get('content-type'));
    
    if (response1.ok) {
      const data1 = await response1.json();
      console.log('Response data type:', typeof data1);
      console.log('Is array:', Array.isArray(data1));
      console.log('Number of projects:', data1.length);
      
      if (data1.length > 0) {
        console.log('Sample project structure:');
        console.log('Keys:', Object.keys(data1[0]));
        console.log('First project:', JSON.stringify(data1[0], null, 2));
      }
    } else {
      const error1 = await response1.text();
      console.log('Error response:', error1);
    }
    
    // Test with status filter
    console.log('\n2. Testing with status filter (active):');
    const response2 = await fetch('http://localhost:3000/api/projects?status=active');
    console.log('Status:', response2.status);
    
    if (response2.ok) {
      const data2 = await response2.json();
      console.log('Filtered projects count:', data2.length);
      if (data2.length > 0) {
        console.log('All have active status:', data2.every(p => p.status === 'active'));
      }
    } else {
      const error2 = await response2.text();
      console.log('Error response:', error2);
    }
    
    // Test with type filter
    console.log('\n3. Testing with type filter (Web Development):');
    const response3 = await fetch('http://localhost:3000/api/projects?type=Web%20Development');
    console.log('Status:', response3.status);
    
    if (response3.ok) {
      const data3 = await response3.json();
      console.log('Type filtered projects count:', data3.length);
      if (data3.length > 0) {
        console.log('All have Web Development type:', data3.every(p => p.type === 'Web Development'));
      }
    } else {
      const error3 = await response3.text();
      console.log('Error response:', error3);
    }
    
    // Test with limit
    console.log('\n4. Testing with limit (3):');
    const response4 = await fetch('http://localhost:3000/api/projects?limit=3');
    console.log('Status:', response4.status);
    
    if (response4.ok) {
      const data4 = await response4.json();
      console.log('Limited projects count:', data4.length);
      console.log('Limit respected:', data4.length <= 3);
    } else {
      const error4 = await response4.text();
      console.log('Error response:', error4);
    }
    
    // Test with multiple parameters
    console.log('\n5. Testing with multiple parameters (status=planning&limit=2):');
    const response5 = await fetch('http://localhost:3000/api/projects?status=planning&limit=2');
    console.log('Status:', response5.status);
    
    if (response5.ok) {
      const data5 = await response5.json();
      console.log('Multi-filtered projects count:', data5.length);
      if (data5.length > 0) {
        console.log('All have planning status:', data5.every(p => p.status === 'planning'));
        console.log('Limit respected:', data5.length <= 2);
      }
    } else {
      const error5 = await response5.text();
      console.log('Error response:', error5);
    }
    
    // Test invalid parameters
    console.log('\n6. Testing with invalid limit (negative):');
    const response6 = await fetch('http://localhost:3000/api/projects?limit=-1');
    console.log('Status:', response6.status);
    
    if (response6.ok) {
      const data6 = await response6.json();
      console.log('Invalid limit handled gracefully, returned:', data6.length, 'projects');
    } else {
      const error6 = await response6.text();
      console.log('Error response:', error6);
    }
    
    // Test performance with large limit
    console.log('\n7. Testing performance:');
    const startTime = Date.now();
    const response7 = await fetch('http://localhost:3000/api/projects?limit=100');
    const endTime = Date.now();
    console.log('Status:', response7.status);
    console.log('Response time:', endTime - startTime, 'ms');
    
    if (response7.ok) {
      const data7 = await response7.json();
      console.log('Large query returned:', data7.length, 'projects');
    }
    
  } catch (error) {
    console.error('Network error:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
testPortfolioGetAPI().then(() => {
  console.log('\n✅ Portfolio GET API test completed');
}).catch(error => {
  console.error('❌ Test failed:', error);
});