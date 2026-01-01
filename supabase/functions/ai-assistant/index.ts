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
    const { message, tasks } = await req.json();

    const taskContext = tasks && tasks.length > 0
      ? `The user currently has ${tasks.length} tasks:\n${tasks.map((t: any, i: number) => 
          `${i + 1}. "${t.title}" - Priority: ${t.priority}, Status: ${t.is_completed ? 'Completed' : 'Pending'}${t.due_date ? `, Due: ${t.due_date}` : ''}`
        ).join('\n')}`
      : "The user has no tasks set up yet.";

    const systemPrompt = `You are a helpful productivity assistant for a task management app called FocusFlow. Your role is to:
1. Provide personalized productivity tips based on the user's current tasks
2. Help with task prioritization and time management
3. Suggest ways to break down complex tasks
4. Offer motivation and support
5. Answer questions about productivity techniques (Pomodoro, time blocking, etc.)

${taskContext}

Keep responses concise, friendly, and actionable. Use bullet points for lists. Don't be overly formal.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('AI Gateway error:', error);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I couldn't generate a response. Please try again.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error in ai-assistant function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
