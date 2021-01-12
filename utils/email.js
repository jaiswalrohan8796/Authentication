const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
        type: "OAuth2",
        user: "ronjazz8796@gmail.com",
        clientId:
            "588279492313-sercodpfkd53upavc7652n3k9rfl5pve.apps.googleusercontent.com",
        clientSecret: "j3zLGJ3tbcQye9dTmTn3ev0c",
        refreshToken:
            "1//04e_GLd5l4EZUCgYIARAAGAQSNwF-L9IrOeOvRjxaIVcxPzyAd80wbzIQCPf_KSjhgVLKBceMqQ8fL1nb7qTz92xeHzuocnEqd94",
        accessToken:
            "ya29.a0AfH6SMALNkSCQrVQDhLIozDWXyKKBvHlp42I6Q_q2CtfO79Rk7j1PUr5ecRT5eRkDzQ8Pp8JZe3GgaxfSOqO3pE53gicSGX7CRJJdTENlHtkkilgwRtO4qwC2kL0iXE9kzGUZqK-BVbAMUKyotDoVfaxG3iVUlsJCPyfIIirJ3s",
    },
});

module.exports = transporter;
