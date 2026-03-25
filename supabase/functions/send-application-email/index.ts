import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: "confirmation" | "status_update";
  email: string;
  name: string;
  applicationNumber: string;
  jobTitle?: string;
  status?: string;
}

const statusLabels: Record<string, string> = {
  pending: "Pending Review",
  reviewing: "Under Review",
  shortlisted: "Shortlisted",
  interview: "Interview Scheduled",
  hired: "Congratulations! You've Been Hired",
  rejected: "Application Update",
};

const getStatusMessage = (status: string): string => {
  switch (status) {
    case "reviewing":
      return "Our team is currently reviewing your application. We'll be in touch soon with an update.";
    case "shortlisted":
      return "Great news! Your application has been shortlisted. We were impressed with your qualifications and will be in contact shortly to discuss next steps.";
    case "interview":
      return "We'd like to invite you for an interview! Our team will reach out to schedule a convenient time.";
    case "hired":
      return "Congratulations! We're thrilled to offer you the position. Our HR team will be in contact with details about your start date and onboarding.";
    case "rejected":
      return "After careful consideration, we've decided to move forward with other candidates. We appreciate your interest and encourage you to apply for future opportunities.";
    default:
      return "Your application status has been updated. Please check our careers portal for more details.";
  }
};

const handler = async (req: Request): Promise<Response> => {
  console.log("send-application-email function invoked");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, email, name, applicationNumber, jobTitle, status }: EmailRequest = await req.json();

    console.log(`Sending ${type} email to ${email} for application ${applicationNumber}`);

    let subject: string;
    let htmlContent: string;

    if (type === "confirmation") {
      subject = `Application Received - ${applicationNumber}`;
      htmlContent = `
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
            .app-number { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 14px 20px; border-radius: 8px; font-family: monospace; font-size: 16px; display: inline-block; margin: 20px 0; letter-spacing: 1px; word-break: break-all; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff !important; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
            .footer { background: #1a1a2e; padding: 25px 20px; text-align: center; }
            .footer p { color: #a0a0a0; font-size: 13px; margin: 5px 0; }
            .footer a { color: #8b5cf6; text-decoration: none; }
            .divider { height: 1px; background: #e5e5e5; margin: 20px 0; }
            @media only screen and (max-width: 480px) {
              .content { padding: 20px 15px; }
              .header { padding: 25px 15px; }
              .header h1 { font-size: 20px; }
              .app-number { font-size: 14px; padding: 12px 15px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="email-wrapper">
              <div class="header">
                <img src="https://zouiscorp.in/logo.png" alt="Zouis Corp Logo" class="logo" />
                <h1>Application Received!</h1>
              </div>
              <div class="content">
                <p>Dear <strong>${name}</strong>,</p>
                <p>Thank you for applying for <strong>${jobTitle || "a position"}</strong> at Zouis Corp. We have successfully received your application.</p>
                <p>Your application reference number is:</p>
                <div style="text-align: center;">
                  <span class="app-number">${applicationNumber}</span>
                </div>
                <p>Please save this number to track your application status.</p>
                <div class="divider"></div>
                <p style="text-align: center;">
                  <a href="https://zouiscorp.in/careers" class="cta-button">Check Application Status</a>
                </p>
                <p>Our hiring team will review your application and get back to you within 5-7 business days.</p>
                <p>Best regards,<br><strong>The Zouis Corp Hiring Team</strong></p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} Zouis Corp. All rights reserved.</p>
                <p><a href="https://zouiscorp.in">zouiscorp.in</a> | <a href="https://zouiscorp.in/careers">Careers</a></p>
                <p style="margin-top: 15px;">This is an automated message. Please do not reply to this email.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
    } else {
      subject = `Application Update - ${statusLabels[status || "pending"]}`;
      htmlContent = `
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
            .status-badge { background: ${status === "hired" ? "#22c55e" : status === "rejected" ? "#ef4444" : "linear-gradient(135deg, #6366f1, #8b5cf6)"}; color: white; padding: 12px 24px; border-radius: 25px; font-size: 16px; font-weight: 600; display: inline-block; margin: 15px 0; }
            .app-number { color: #6366f1; font-family: monospace; font-weight: 600; word-break: break-all; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff !important; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
            .footer { background: #1a1a2e; padding: 25px 20px; text-align: center; }
            .footer p { color: #a0a0a0; font-size: 13px; margin: 5px 0; }
            .footer a { color: #8b5cf6; text-decoration: none; }
            .divider { height: 1px; background: #e5e5e5; margin: 20px 0; }
            .message-box { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #6366f1; margin: 20px 0; }
            @media only screen and (max-width: 480px) {
              .content { padding: 20px 15px; }
              .header { padding: 25px 15px; }
              .header h1 { font-size: 20px; }
              .status-badge { font-size: 14px; padding: 10px 18px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="email-wrapper">
              <div class="header">
                <img src="https://zouiscorp.in/logo.png" alt="Zouis Corp Logo" class="logo" />
                <h1>Application Status Update</h1>
              </div>
              <div class="content">
                <p>Dear <strong>${name}</strong>,</p>
                <p>We have an update regarding your application <span class="app-number">${applicationNumber}</span>.</p>
                <p>Your application status has been updated to:</p>
                <div style="text-align: center;">
                  <span class="status-badge">${statusLabels[status || "pending"]}</span>
                </div>
                <div class="message-box">
                  <p style="margin: 0;">${getStatusMessage(status || "pending")}</p>
                </div>
                <div class="divider"></div>
                <p style="text-align: center;">
                  <a href="https://zouiscorp.in/careers" class="cta-button">View Application</a>
                </p>
                <p>Best regards,<br><strong>The Zouis Corp Hiring Team</strong></p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} Zouis Corp. All rights reserved.</p>
                <p><a href="https://zouiscorp.in">zouiscorp.in</a> | <a href="https://zouiscorp.in/careers">Careers</a></p>
                <p style="margin-top: 15px;">This is an automated message. Please do not reply to this email.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Zouis Corp <noreply@zouiscorp.in>",
        to: [email],
        subject,
        html: htmlContent,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Resend API error:", data);
      throw new Error(data.message || "Failed to send email");
    }

    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-application-email function:", error);
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
