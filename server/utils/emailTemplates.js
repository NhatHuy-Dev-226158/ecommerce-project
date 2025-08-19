export const accountPendingApprovalEmail = (username, role) => {


    return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
            .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #ddd; }
            .header h1 { color: #333; }
            .content { padding: 20px 0; }
            .content p { margin: 0 0 15px; }
            .highlight { color: #0056b3; font-weight: bold; }
            .footer { text-align: center; font-size: 12px; color: #777; padding-top: 20px; border-top: 1px solid #ddd; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Chào mừng bạn đến với ECOMMERCE!</h1>
            </div>
            <div class="content">
                <p>Chào <span class="highlight">${username}</span>,</p>
                <p>
                    Một tài khoản với vai trò <span class="highlight">${role}</span> đã được tạo cho bạn trên hệ thống quản trị của chúng tôi.
                </p>
                <p>
                    Hiện tại, tài khoản của bạn đang ở trạng thái <strong style="color: #d9534f;">CHỜ PHÊ DUYỆT</strong> và chưa thể đăng nhập.
                </p>
                <p>
                    Bạn sẽ nhận được một email thông báo khác ngay sau khi quản trị viên kích hoạt tài khoản của bạn. Vui lòng không trả lời email này.
                </p>
                <p>Trân trọng,<br>Đội ngũ ECOMMERCE </p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} ECOMMERCE. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
      `;
};