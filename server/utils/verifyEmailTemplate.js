

const verificationEmail = (username, otp) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                border: 1px solid #dddddd;
            }
            .header {
                background-color: #007bff;
                color: #ffffff;
                padding: 20px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
            }
            .content {
                padding: 30px;
                line-height: 1.6;
                color: #333333;
            }
            .otp {
                font-size: 24px;
                font-weight: bold;
                text-align: center;
                margin: 20px 0;
                padding: 15px;
                background-color: #e9ecef;
                border-radius: 5px;
                letter-spacing: 4px;
            }
            .footer {
                text-align: center;
                padding: 20px;
                font-size: 12px;
                color: #777777;
                background-color: #f4f4f4;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Hello ${username}! Please verify Your Email Address</h1>
            </div>
            <div class="content">
                <p>Thank you for registering with Spicez Gold. Please use the OTP below to verify your email address:</p>
                <div class="otp">${otp}</div>
                <p>If you didn't create an account, you can safely ignore this email.</p>
            </div>
            <div class="footer">
                <p>© 2024 Spicez Gold. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

export default verificationEmail;
