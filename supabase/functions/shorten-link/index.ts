import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('GPLINKS_API_KEY');
    if (!apiKey) {
      console.error('GPLINKS_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Link shortener not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Shortening URL:', url);

    // Call GPLinks API to shorten the link (correct endpoint: api.gplinks.com)
    const apiUrl = `https://api.gplinks.com/api?api=${apiKey}&url=${encodeURIComponent(url)}`;
    console.log('Calling GPLinks API:', apiUrl);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('GPLinks API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to shorten link' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('GPLinks response:', data);

    if (data.status === 'success' && data.shortenedUrl) {
      return new Response(
        JSON.stringify({ shortenedUrl: data.shortenedUrl }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      console.error('GPLinks unexpected response:', data);
      return new Response(
        JSON.stringify({ error: data.message || 'Failed to shorten link' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in shorten-link function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
