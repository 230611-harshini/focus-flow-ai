import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ReminderPayload {
  taskId: string;
  taskTitle: string;
  dueDate: string;
  userEmail: string;
  userName?: string;
  reminderType: 'email' | 'in_app' | 'both';
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate the user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Missing authorization' }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await userSupabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub;

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { taskId, taskTitle, dueDate, userEmail, userName, reminderType }: ReminderPayload = await req.json();

    // Verify user owns this task
    const { data: task, error: taskError } = await userSupabase
      .from('tasks')
      .select('id, user_id')
      .eq('id', taskId)
      .single();

    if (taskError || !task) {
      return new Response(JSON.stringify({ error: 'Task not found or access denied' }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Processing reminder for task:", taskId, "user:", userId);

    const results = {
      emailSent: false,
      notificationCreated: false,
    };

    // Send email if reminder type includes email
    if (reminderType === 'email' || reminderType === 'both') {
      const dueDateFormatted = new Date(dueDate).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const emailResponse = await resend.emails.send({
        from: "FocusFlow <onboarding@resend.dev>",
        to: [userEmail],
        subject: `⏰ Reminder: ${taskTitle}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: 'Inter', -apple-system, sans-serif; margin: 0; padding: 0; background-color: #0f0f23; }
              .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
              .card { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 40px; border: 1px solid rgba(99, 102, 241, 0.2); }
              .logo { text-align: center; margin-bottom: 30px; }
              .logo-icon { width: 48px; height: 48px; background: linear-gradient(135deg, #6366f1, #3b82f6, #06b6d4); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; }
              h1 { color: #ffffff; font-size: 24px; margin: 0 0 20px 0; text-align: center; }
              .task-card { background: rgba(99, 102, 241, 0.1); border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid rgba(99, 102, 241, 0.3); }
              .task-title { color: #ffffff; font-size: 18px; font-weight: 600; margin: 0 0 10px 0; }
              .due-date { color: #94a3b8; font-size: 14px; margin: 0; }
              .cta-button { display: inline-block; background: linear-gradient(135deg, #6366f1, #3b82f6); color: white; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 600; margin-top: 20px; }
              .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="card">
                <div class="logo">
                  <div class="logo-icon">⚡</div>
                </div>
                <h1>Hey ${userName || 'there'}! 👋</h1>
                <p style="color: #94a3b8; text-align: center; margin: 0 0 30px 0;">
                  This is a friendly reminder about your upcoming task.
                </p>
                <div class="task-card">
                  <p class="task-title">📋 ${taskTitle}</p>
                  <p class="due-date">📅 Due: ${dueDateFormatted}</p>
                </div>
                <div style="text-align: center;">
                  <a href="${supabaseUrl.replace('.supabase.co', '.lovable.app')}/dashboard" class="cta-button">
                    View Task →
                  </a>
                </div>
              </div>
              <div class="footer">
                <p>Sent by FocusFlow • Your AI Task & Focus Manager</p>
                <p>Keep crushing your goals! 🚀</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      console.log("Email response:", emailResponse);
      results.emailSent = !emailResponse.error;
    }

    // Create in-app notification if reminder type includes in_app
    if (reminderType === 'in_app' || reminderType === 'both') {
      const { error: notifError } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title: `Reminder: ${taskTitle}`,
          message: `Your task "${taskTitle}" is due soon. Don't forget to complete it!`,
          type: 'reminder',
          task_id: taskId,
        });

      if (notifError) {
        console.error("Error creating notification:", notifError);
      } else {
        results.notificationCreated = true;
      }
    }

    return new Response(
      JSON.stringify({ success: true, ...results }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-reminder function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
