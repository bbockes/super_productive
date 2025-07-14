import 'dotenv/config';

export const handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({})
    };
  }

  try {
    // Parse the request body
    const { email } = JSON.parse(event.body || '{}');

    // Validate email
    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email is required' })
      };
    }

    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Please enter a valid email address' })
      };
    }

    // Get EmailOctopus credentials from environment variables
    const apiKey = process.env.EMAILOCTOPUS_API_KEY;
    const listId = process.env.EMAILOCTOPUS_LIST_ID;
    
    console.log('Environment Variables:', {
      EMAILOCTOPUS_API_KEY: apiKey ? `${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 3)}` : 'NOT FOUND',
      EMAILOCTOPUS_LIST_ID: listId || 'NOT FOUND'
    });

    if (!apiKey || !listId) {
      console.error('Missing EmailOctopus configuration');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Server configuration error' })
      };
    }

    // Prepare the request body for EmailOctopus
    const requestBody = new URLSearchParams();
    requestBody.append('api_key', apiKey);
    requestBody.append('email_address', trimmedEmail);
    // Set status for double opt-in
    requestBody.append('status', 'PENDING');
    
    // Add any custom fields if needed
    // requestBody.append('fields[FirstName]', 'John');
    // requestBody.append('fields[LastName]', 'Doe');

    console.log('Sending to EmailOctopus:', {
      listId,
      email: `${trimmedEmail.substring(0, 2)}...@...${trimmedEmail.split('@')[1]}`,
      endpoint: `https://emailoctopus.com/api/1.6/lists/${listId}/contacts`
    });

    const response = await fetch(`https://emailoctopus.com/api/1.6/lists/${listId}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: requestBody.toString()
    });

    const responseData = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      console.error('EmailOctopus API error:', {
        status: response.status,
        statusText: response.statusText,
        error: responseData.error
      });

      let errorMessage = 'Failed to subscribe to newsletter';
      if (response.status === 401) {
        errorMessage = 'Invalid API key';
      } else if (responseData.error?.message) {
        errorMessage = responseData.error.message;
      }

      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: errorMessage })
      };
    }

    console.log('✅ Successfully subscribed:', trimmedEmail);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Please check your email to confirm your subscription!' 
      })
    };

  } catch (err) {
    console.error('Newsletter subscription error:', err);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'An unexpected error occurred. Please try again later.' 
      })
    };
  }
};