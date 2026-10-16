import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.HOST_EMAIL,
        pass: process.env.HOST_PASSWORD
    }
});

export const sentOTP = async (email, otp) => {
    await transporter.sendMail({
        from: `Kimberley Travel and Tours <${process.env.HOST_EMAIL}>`,
        to: email,
        subject: "Your Account Verification OTP Code - Kimberley Travel",
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>OTP Verification</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    background-color: #f4f7f6;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                .email-wrapper {
                    width: 100%;
                    table-layout: fixed;
                    background: linear-gradient(135deg, #5CBDB0 0%, #3a8a7f 100%);
                    padding: 40px 0;
                }
                .email-content {
                    max-width: 600px;
                    margin: 0 auto;
                    background: rgba(255, 255, 255, 0.85);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    border-radius: 16px;
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.15);
                    overflow: hidden;
                }
                .email-header {
                    background: #ffffff;
                    padding: 25px;
                    text-align: center;
                    border-bottom: 1px solid rgba(92, 189, 176, 0.2);
                }
                .logo-img {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 3px solid #5CBDB0;
                }
                .company-name {
                    margin: 10px 0 0 0;
                    color: #2c3e50;
                    font-size: 20px;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                }
                .email-body {
                    padding: 35px 30px;
                    text-align: center;
                    color: #333333;
                }
                .greeting {
                    font-size: 18px;
                    font-weight: 600;
                    color: #2c3e50;
                    margin-bottom: 15px;
                }
                .message {
                    font-size: 15px;
                    color: #555555;
                    line-height: 1.6;
                    margin-bottom: 25px;
                }
                .otp-box {
                    background: rgba(92, 189, 176, 0.1);
                    border: 2px dashed #5CBDB0;
                    border-radius: 12px;
                    padding: 15px;
                    margin: 20px auto;
                    display: inline-block;
                }
                .otp-code {
                    font-size: 36px;
                    font-weight: 800;
                    color: #5CBDB0;
                    letter-spacing: 8px;
                    margin: 0;
                }
                .expiry-note {
                    font-size: 13px;
                    color: #e74c3c;
                    margin-top: 15px;
                    font-weight: 500;
                }
                .travel-tagline {
                    font-size: 14px;
                    color: #666666;
                    font-style: italic;
                    margin-top: 20px;
                }
                .email-footer {
                    background: rgba(240, 244, 243, 0.9);
                    padding: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #7f8c8d;
                    border-top: 1px solid rgba(255, 255, 255, 0.5);
                }
                .email-footer a {
                    color: #5CBDB0;
                    text-decoration: none;
                }
            </style>
        </head>
        <body>
            <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td align="center">
                        <table class="email-content" width="100%" cellpadding="0" cellspacing="0">
                            <!-- Header with Logo -->
                            <tr>
                                <td class="email-header">
                                    <img src="YOUR_LOGO_IMAGE_URL_HERE" alt="Kimberley Travel Logo" class="logo-img">
                                    <h2 class="company-name">Kimberley Travel & Tours</h2>
                                </td>
                            </tr>
                            <!-- Body Content -->
                            <tr>
                                <td class="email-body">
                                    <div class="greeting">Hello Explorer,</div>
                                    <p class="message">
                                        Thank you for choosing <b>Kimberley Travel and Tours</b>[cite: 1]! Use the verification code below to securely complete your account setup and start your journey with us.
                                    </p>
                                    
                                    <div class="otp-box">
                                        <p class="otp-code">${otp}</p>
                                    </div>

                                    <p class="expiry-note">This code will expire in <b>5 minutes</b>.</p>
                                    
                                    <p class="travel-tagline">"Discover the world with comfort and style."</p>
                                </td>
                            </tr>
                            <!-- Footer -->
                            <tr>
                                <td class="email-footer">
                                    <p>&copy; ${new Date().getFullYear()} Kimberley Travel & Tours[cite: 1]. All rights reserved.</p>
                                    <p>If you didn't request this code, please ignore this email.</p>
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