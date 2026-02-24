import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const { name, email, company, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const timestamp = new Date().toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });

    await resend.emails.send({
      from: "Fine Gold Technologies <noreply@mail.bearplex.com>",
      to: "hello@bearplex.com",
      replyTo: email,
      subject: `[Website] ${subject}`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <!--[if mso]><style>table,td{font-family:Arial,sans-serif!important;}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#09090B;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#09090B;">
    <tr><td style="height:48px;"></td></tr>
    <tr>
      <td align="center" style="padding:0 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:40px;">
              <img src="https://finegoldtech.com/logo.png" alt="Fine Gold Technologies" width="150" height="38" style="display:block;height:38px;width:auto;" />
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background-color:#111113;border:1px solid #1E1E26;border-radius:20px;overflow:hidden;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">

                <!-- Gold top edge -->
                <tr><td style="height:2px;background-color:#C8A960;"></td></tr>

                <!-- Spacer -->
                <tr><td style="height:44px;"></td></tr>

                <!-- Subject -->
                <tr>
                  <td style="padding:0 44px;">
                    <p style="margin:0;font-size:28px;font-weight:700;color:#FFFFFF;line-height:1.25;letter-spacing:-0.5px;">${subject}</p>
                  </td>
                </tr>

                <tr><td style="height:8px;"></td></tr>

                <!-- Timestamp -->
                <tr>
                  <td style="padding:0 44px;">
                    <p style="margin:0;font-size:13px;color:#5A5A70;line-height:1.5;">${timestamp}</p>
                  </td>
                </tr>

                <tr><td style="height:36px;"></td></tr>

                <!-- Divider -->
                <tr><td style="padding:0 44px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:1px;background-color:#1E1E26;"></td></tr></table></td></tr>

                <tr><td style="height:32px;"></td></tr>

                <!-- From section -->
                <tr>
                  <td style="padding:0 44px;">
                    <p style="margin:0 0 16px;font-size:10px;font-weight:700;color:#C8A960;letter-spacing:2.5px;text-transform:uppercase;">From</p>
                  </td>
                </tr>

                <!-- Name -->
                <tr>
                  <td style="padding:0 44px;">
                    <p style="margin:0;font-size:20px;font-weight:600;color:#FFFFFF;line-height:1.3;">${name}</p>
                  </td>
                </tr>

                <tr><td style="height:6px;"></td></tr>

                <!-- Email -->
                <tr>
                  <td style="padding:0 44px;">
                    <a href="mailto:${email}" style="font-size:14px;color:#A0A0B8;text-decoration:none;">${email}</a>
                  </td>
                </tr>

                <tr><td style="height:4px;"></td></tr>

                <!-- Company -->
                <tr>
                  <td style="padding:0 44px;">
                    <p style="margin:0;font-size:13px;color:#5A5A70;">${company || "—"}</p>
                  </td>
                </tr>

                <tr><td style="height:36px;"></td></tr>

                <!-- Divider -->
                <tr><td style="padding:0 44px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:1px;background-color:#1E1E26;"></td></tr></table></td></tr>

                <tr><td style="height:32px;"></td></tr>

                <!-- Message label -->
                <tr>
                  <td style="padding:0 44px;">
                    <p style="margin:0 0 16px;font-size:10px;font-weight:700;color:#C8A960;letter-spacing:2.5px;text-transform:uppercase;">Message</p>
                  </td>
                </tr>

                <!-- Message body -->
                <tr>
                  <td style="padding:0 44px;">
                    <p style="margin:0;font-size:15px;color:#A0A0B8;line-height:1.8;white-space:pre-wrap;">${message}</p>
                  </td>
                </tr>

                <tr><td style="height:44px;"></td></tr>

                <!-- Reply Button -->
                <tr>
                  <td style="padding:0 44px;" align="center">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background-color:#C8A960;border-radius:99px;">
                          <a href="mailto:${email}?subject=Re: ${subject}" style="display:inline-block;padding:14px 40px;font-size:13px;font-weight:700;color:#09090B;text-decoration:none;letter-spacing:0.3px;">Reply to ${name.split(" ")[0]}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr><td style="height:44px;"></td></tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr><td style="height:32px;"></td></tr>
          <tr>
            <td align="center">
              <p style="margin:0 0 8px;font-size:12px;color:#5A5A70;">Sent from <span style="color:#A0A0B8;">finegoldtech.com</span> contact form</p>
              <p style="margin:0;font-size:12px;color:#5A5A70;">&copy; ${new Date().getFullYear()} Fine Gold Technologies &nbsp;&middot;&nbsp; <a href="https://www.linkedin.com/company/fine-gold-technologies/about/" style="color:#C8A960;text-decoration:none;">LinkedIn</a></p>
            </td>
          </tr>
          <tr><td style="height:48px;"></td></tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
