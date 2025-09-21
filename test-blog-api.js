// Test script for Blog API endpoints
const BASE_URL = 'http://localhost:3000';

console.log('🧪 Testing Blog API Endpoints...\n');

// Test GET /api/blog-posts
async function testBlogGetAPI() {
  console.log('📖 Testing Blog GET API...');
  
  try {
    // Test 1: Get all blog posts
    console.log('\n1. Testing GET /api/blog-posts (all posts)');
    const response1 = await fetch(`${BASE_URL}/api/blog-posts`);
    console.log(`Status: ${response1.status}`);
    
    if (response1.ok) {
      const posts = await response1.json();
      console.log(`✅ Success: Retrieved ${posts.length} blog posts`);
      if (posts.length > 0) {
        console.log('Sample post structure:', {
          id: posts[0].id,
          title: posts[0].title,
          slug: posts[0].slug,
          published: posts[0].published,
          hasContent: !!posts[0].content,
          hasExcerpt: !!posts[0].excerpt
        });
      }
    } else {
      const error = await response1.text();
      console.log(`❌ Error: ${error}`);
    }

    // Test 2: Get only published posts
    console.log('\n2. Testing GET /api/blog-posts?published=true');
    const response2 = await fetch(`${BASE_URL}/api/blog-posts?published=true`);
    console.log(`Status: ${response2.status}`);
    
    if (response2.ok) {
      const publishedPosts = await response2.json();
      console.log(`✅ Success: Retrieved ${publishedPosts.length} published posts`);
    } else {
      const error = await response2.text();
      console.log(`❌ Error: ${error}`);
    }

    // Test 3: Get unpublished posts
    console.log('\n3. Testing GET /api/blog-posts?published=false');
    const response3 = await fetch(`${BASE_URL}/api/blog-posts?published=false`);
    console.log(`Status: ${response3.status}`);
    
    if (response3.ok) {
      const unpublishedPosts = await response3.json();
      console.log(`✅ Success: Retrieved ${unpublishedPosts.length} unpublished posts`);
    } else {
      const error = await response3.text();
      console.log(`❌ Error: ${error}`);
    }

  } catch (error) {
    console.log(`❌ Network Error: ${error.message}`);
  }
}

// Test POST /api/blog-posts
async function testBlogPostAPI() {
  console.log('\n\n📝 Testing Blog POST API...');
  
  try {
    // Test 1: Create blog post without authentication (should fail)
    console.log('\n1. Testing POST without authentication (should fail)');
    const testPost = {
      title: 'Test Blog Post',
      slug: 'test-blog-post-' + Date.now(),
      excerpt: 'This is a test excerpt',
      content: 'This is test content for the blog post.',
      published: false,
      tags: ['test', 'api']
    };

    const response1 = await fetch(`${BASE_URL}/api/blog-posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPost)
    });
    
    console.log(`Status: ${response1.status}`);
    const result1 = await response1.json();
    
    if (response1.status === 401) {
      console.log('✅ Success: Correctly rejected unauthorized request');
      console.log('Response:', result1);
    } else {
      console.log('❌ Unexpected: Should have been unauthorized');
      console.log('Response:', result1);
    }

    // Test 2: Test validation (missing required fields)
    console.log('\n2. Testing POST with missing required fields');
    const invalidPost = {
      title: 'Test Post'
      // Missing slug, excerpt, content
    };

    const response2 = await fetch(`${BASE_URL}/api/blog-posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidPost)
    });
    
    console.log(`Status: ${response2.status}`);
    const result2 = await response2.json();
    
    if (response2.status === 400 || response2.status === 401) {
      console.log('✅ Success: Correctly handled invalid request');
      console.log('Response:', result2);
    } else {
      console.log('❌ Unexpected response for invalid data');
      console.log('Response:', result2);
    }

  } catch (error) {
    console.log(`❌ Network Error: ${error.message}`);
  }
}

// Test database connection and API health
async function testAPIHealth() {
  console.log('\n\n🏥 Testing API Health...');
  
  try {
    const startTime = Date.now();
    const response = await fetch(`${BASE_URL}/api/blog-posts`);
    const endTime = Date.now();
    
    console.log(`Response Time: ${endTime - startTime}ms`);
    console.log(`Status: ${response.status}`);
    console.log(`Content-Type: ${response.headers.get('content-type')}`);
    
    if (response.ok) {
      console.log('✅ API is healthy and responsive');
    } else {
      console.log('❌ API health check failed');
    }
    
  } catch (error) {
    console.log(`❌ API Health Check Failed: ${error.message}`);
  }
}

// Run all tests
async function runAllTests() {
  await testAPIHealth();
  await testBlogGetAPI();
  await testBlogPostAPI();
  
  console.log('\n🎯 Blog API Testing Complete!');
  console.log('\nSummary:');
  console.log('- GET endpoint tested for all posts and filtered results');
  console.log('- POST endpoint tested for authentication and validation');
  console.log('- API health and performance checked');
}

// Execute tests
runAllTests().catch(console.error);