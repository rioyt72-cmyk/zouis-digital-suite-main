import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  email: string;
  name: string;
  service: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-contact-email function invoked");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, service, message }: ContactEmailRequest = await req.json();

    console.log(`Sending contact confirmation email to ${email}`);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f4f4f4; }
            .container { width: 100%; max-width: 640px; margin: 0 auto; }
            .email-wrapper { background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 30px 20px; text-align: center; }
          .logo { width: 120px; height: auto; margin-bottom: 15px; }
          .header h1 { color: #fff; margin: 0; font-size: 22px; font-weight: 600; }
          .content { background: #ffffff; padding: 30px 25px; }
          .highlight-box { background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1)); padding: 20px; border-radius: 10px; border-left: 4px solid #6366f1; margin: 20px 0; }
          .highlight-box p { margin: 8px 0; }
          .highlight-box strong { color: #6366f1; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff !important; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
          .footer { background: #1a1a2e; padding: 25px 20px; text-align: center; }
          .footer p { color: #a0a0a0; font-size: 13px; margin: 5px 0; }
          .footer a { color: #8b5cf6; text-decoration: none; }
          .divider { height: 1px; background: #e5e5e5; margin: 20px 0; }
          @media only screen and (max-width: 480px) {
            .content { padding: 20px 15px; }
            .header { padding: 25px 15px; }
            .header h1 { font-size: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="email-wrapper">
            <div class="header">
              <img src="https://zouiscorp.in/logo.png" alt="Zouis Corp Logo" class="logo" />
              <h1>Project Request Received!</h1>
            </div>
            <div class="content">
              <p>Dear <strong>${name}</strong>,</p>
              <p>Thank you for reaching out to Zouis Corp! We have received your project request and our team is excited to learn more about your needs.</p>
              
              <div class="highlight-box">
                <p><strong>Service Interested In:</strong> ${service || "Not specified"}</p>
                <p><strong>Your Message:</strong></p>
                <p style="color: #666;">${message || "No message provided"}</p>
              </div>
              
              <p>Our team will review your request and get back to you within <strong>24-48 hours</strong> with more information about how we can help bring your vision to life.</p>
              
              <div class="divider"></div>
              
              <p style="text-align: center;">
                <a href="https://zouiscorp.in/services" class="cta-button">Explore Our Services</a>
              </p>
              
              <p>In the meantime, feel free to explore our portfolio and services to see the kind of work we do.</p>
              
              <p>Best regards,<br><strong>The Zouis Corp Team</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Zouis Corp. All rights reserved.</p>
              <p><a href="https://zouiscorp.in">zouiscorp.in</a> | <a href="https://zouiscorp.in/services">Services</a> | <a href="https://zouiscorp.in/portfolio">Portfolio</a></p>
              <p style="margin-top: 15px;">This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Zouis Corp <noreply@zouiscorp.in>",
        to: [email],
        subject: "We've Received Your Project Request - Zouis Corp",
        html: htmlContent,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Resend API error:", data);
      throw new Error(data.message || "Failed to send email");
    }

    console.log("Contact email sent successfully:", data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
