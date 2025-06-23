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
      body: ''
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

    // Get ConvertKit credentials from environment variables
    const apiKey = process.env.CONVERTKIT_API_KEY;
    const formId = process.env.CONVERTKIT_FORM_ID;

    // Debug logging to help troubleshoot
    console.log('Environment variables check:', {
      hasApiKey: !!apiKey,
      hasFormId: !!formId,
      apiKeyLength: apiKey ? apiKey.length : 0,
      formIdValue: formId, // Form ID is not sensitive, safe to log
      formIdType: typeof formId
    });

    // Validate form ID format (should be numeric)
    if (formId && !/^\d+$/.test(formId)) {
      console.error('Form ID should be numeric, got:', formId);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Invalid form ID format - should be numeric' })
      };
    }

    if (!apiKey || !formId) {
      console.error('ConvertKit credentials missing:', { 
        hasApiKey: !!apiKey, 
        hasFormId: !!formId 
      });
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Newsletter service configuration is missing' })
      };
    }

    console.log('Attempting to subscribe email:', email, 'to form:', formId);

    // Make request to ConvertKit API
    const response = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        email: email,
      }),
    });

    const responseText = await response.text();
    console.log('ConvertKit response status:', response.status);
    console.log('ConvertKit response body:', responseText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        errorData = { message: responseText };
      }

      console.error('ConvertKit API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorData
      });

      // Handle specific ConvertKit error messages
      let errorMessage = 'Failed to subscribe to newsletter';
      
      if (response.status === 400) {
        errorMessage = 'Invalid email address or already subscribed';
      } else if (response.status === 401) {
        errorMessage = 'Newsletter service authentication failed';
      } else if (response.status === 404) {
        errorMessage = 'Newsletter form not found - please check configuration';
      } else if (response.status === 422) {
        errorMessage = 'Email address is invalid';
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }

      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: errorMessage })
      };
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse ConvertKit response:', responseText);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Unexpected response from newsletter service' })
      };
    }

    // ConvertKit returns a subscription object on success
    if (result.subscription) {
      console.log('✅ Successfully subscribed:', email);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: 'Successfully subscribed!' })
      };
    } else {
      console.error('Unexpected ConvertKit response structure:', result);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Unexpected response from newsletter service' })
      };
    }

  } catch (err) {
    console.error('Newsletter subscription error:', err);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: err.message || 'An unexpected error occurred' 
      })
    };
  }
};