import nodemailer from "nodemailer";
import path from "path";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.HOST_EMAIL,
        pass: process.env.HOST_PASSWORD
    }
});

export const sentOTP = async (email, otp) => {
    await transporter.sendMail({
        from: `"Kimberley Travel and Tours" <${process.env.HOST_EMAIL}>`,
        to: email,
        subject: "Your Verification Code - Kimberley Travel",
        attachments: [{
            filename: 'logo.jpg',
            path: path.join(process.cwd(), 'assets', 'logo.jpg'),
            cid: 'kimberley_logo'
        }],
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>OTP Verification</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #0d1b1e; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            
            <!-- Outer Background Container -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(145deg, #0f2b28 0%, #0d1b1e 60%, #173e38 100%); padding: 40px 15px;">
                <tr>
                    <td align="center">
                        
                        <!-- Main Card (Glassmorphic Dark-Teal Vibe) -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 460px; background: rgba(22, 48, 44, 0.75); border: 1px solid rgba(92, 189, 176, 0.3); border-radius: 24px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5); overflow: hidden;">
                            
                            <!-- Header with Glowing Accent Line -->
                            <tr>
                                <td style="padding: 35px 25px 20px 25px; text-align: center;">
                                    
                                    <!-- Logo with Emerald Ring -->
                                    <div style="display: inline-block; padding: 4px; background: linear-gradient(135deg, #5CBDB0, #173e38); border-radius: 50%; box-shadow: 0 6px 20px rgba(92, 189, 176, 0.3);">
                                        <img src="cid:kimberley_logo" alt="Kimberley Travel Logo" style="width: 75px; height: 75px; border-radius: 50%; display: block; object-fit: cover;">
                                    </div>
                                    
                                    <h2 style="margin: 15px 0 0 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: 1px;">
                                        Kimberley Travel & Tours
                                    </h2>
                                    
                                    <div style="width: 40px; height: 3px; background: #5CBDB0; margin: 10px auto 0 auto; border-radius: 2px;"></div>
                                </td>
                            </tr>

                            <!-- Body Content -->
                            <tr>
                                <td style="padding: 10px 30px 30px 30px; text-align: center;">
                                    
                                    <h3 style="color: #5CBDB0; font-size: 20px; font-weight: 600; margin-top: 10px; margin-bottom: 12px;">
                                        Account Verification
                                    </h3>
                                    
                                    <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 0 0 25px 0;">
                                        Hello Explorer! Welcome aboard. Please enter the verification code below to secure your account and unlock your next journey.
                                    </p>

                                    <!-- OTP Box (Neon-Teal Glow Effect) -->
                                    <div style="background: rgba(13, 27, 30, 0.6); border: 1.5px dashed #5CBDB0; border-radius: 16px; padding: 20px 10px; margin: 0 auto; box-shadow: inset 0 2px 10px rgba(0,0,0,0.5), 0 0 15px rgba(92, 189, 176, 0.15);">
                                        <span style="font-size: 38px; font-weight: 800; color: #5CBDB0; letter-spacing: 10px; text-shadow: 0 0 12px rgba(92, 189, 176, 0.4); display: inline-block; padding-left: 10px;">
                                            ${otp}
                                        </span>
                                    </div>

                                    <!-- Timer & Notice -->
                                    <p style="color: #f87171; font-size: 13px; margin-top: 20px; font-weight: 500;">
                                        Code expires in <strong style="color: #f87171;">10 minutes</strong>.
                                    </p>

                                    <p style="color: #94a3b8; font-size: 13px; font-style: italic; margin-top: 25px; margin-bottom: 0;">
                                        "Discover the world with comfort and style."
                                    </p>
                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td style="background: rgba(13, 27, 30, 0.8); padding: 20px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid rgba(92, 189, 176, 0.15); line-height: 1.6;">
                                    This is an automated security message from Kimberley Travel & Tours.<br>
                                    &copy; ${new Date().getFullYear()} Kimberley Travel & Tours. All rights reserved.
                                </td>
                            </tr>

                        </table>
                        
                    </td>
                </tr>
            </table>

        </body>
        </html>
        `
    });
};