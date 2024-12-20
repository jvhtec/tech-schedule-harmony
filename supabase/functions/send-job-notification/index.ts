import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  jobId: string;
  technicianId: string;
  role: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobId, technicianId, role } = await req.json() as EmailRequest;
    console.log("Received request:", { jobId, technicianId, role });

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch job details
    const { data: job, error: jobError } = await supabaseClient
      .from("jobs")
      .select("*")
      .eq("id", jobId)
      .single();

    if (jobError) {
      console.error("Error fetching job:", jobError);
      throw jobError;
    }

    // Fetch technician details
    const { data: technician, error: techError } = await supabaseClient
      .from("technicians")
      .select("*")
      .eq("id", technicianId)
      .single();

    if (techError) {
      console.error("Error fetching technician:", techError);
      throw techError;
    }

    // Format dates
    const startDate = new Date(job.start_time).toLocaleString('es-ES', {
      dateStyle: 'long',
      timeStyle: 'short'
    });
    const endDate = new Date(job.end_time).toLocaleString('es-ES', {
      dateStyle: 'long',
      timeStyle: 'short'
    });

    // Create email content
    const emailHtml = `
      <h2>¿Tendrías disponibilidad para el siguiente trabajo?</h2>
      <h3>${job.title}</h3>
      <p><strong>Rol:</strong> ${role}</p>
      <p><strong>Fecha de inicio:</strong> ${startDate}</p>
      <p><strong>Fecha de fin:</strong> ${endDate}</p>
      ${job.location ? `<p><strong>Ubicación:</strong> ${job.location}</p>` : ''}
      ${job.description ? `<p><strong>Descripción:</strong> ${job.description}</p>` : ''}
    `;

    console.log("Sending email to:", technician.email);

    // Send email using Resend with your domain
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Sector Pro <updates@sector.pro>",
        to: [technician.email],
        subject: `Nueva asignación de trabajo: ${job.title}`,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Resend API error:", error);
      throw new Error(error);
    }

    const data = await res.json();
    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);