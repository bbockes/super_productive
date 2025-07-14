exports.handler = async (event, context) => {
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
    if (!email || !email.includes('@')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Please enter a valid email address' })
      };
    }

    // Get EmailOctopus credentials from environment variables
    const apiKey = process.env.EMAILOCTOPUS_API_KEY;
    const listId = process.env.EMAILOCTOPUS_LIST_ID;

    // Debug logging
    console.log('Environment variables check:', {
      hasApiKey: !!apiKey,
      hasListId: !!listId,
      apiKeyPrefix: apiKey ? apiKey.substring(0, 5) + '...' : 'none',
      listIdPrefix: listId ? listId.substring(0, 8) + '...' : 'none'
    });

    if (!apiKey || !listId) {
      console.error('EmailOctopus credentials missing:', { 
        hasApiKey: !!apiKey, 
        hasListId: !!listId 
      });
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Newsletter service configuration is missing' })
      };
    }

    console.log('Attempting to subscribe email:', email, 'to list:', listId);

    // Make request to EmailOctopus API
    const response = await fetch(`https://emailoctopus.com/api/1.6/lists/${listId}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        email_address: email,
        status: 'PENDING'  // Will send a confirmation email
      }),
    });

    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      console.error('Failed to parse EmailOctopus response:', e);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to process response from newsletter service' })
      };
    }

    console.log('EmailOctopus response status:', response.status);
    console.log('EmailOctopus response body:', JSON.stringify(responseData, null, 2));

    if (!response.ok) {
      console.error('EmailOctopus API error:', {
        status: response.status,
        statusText: response.statusText,
        body: responseData
      });

      // Handle specific EmailOctopus error messages
      let errorMessage = 'Failed to subscribe to newsletter';
      
      if (response.status === 400) {
        // EmailOctopus returns 400 for invalid emails and already subscribed
        if (responseData.error?.code === 'ALREADY_SUBSCRIBED') {
          errorMessage = 'This email is already subscribed';
        } else if (responseData.error?.code === 'INVALID_PARAMETERS') {
          errorMessage = 'Invalid email address';
        } else {
          errorMessage = responseData.error?.message || 'Invalid request';
        }
      } else if (response.status === 401) {
        errorMessage = 'Newsletter service authentication failed';
      } else if (response.status === 422) {
        errorMessage = responseData.error?.message || 'Invalid email address';
      } else if (response.status >= 500) {
        errorMessage = 'Newsletter service is currently unavailable. Please try again later.';
      }

      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: errorMessage })
      };
    }

    // Success response
    console.log('✅ Successfully subscribed:', email);
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