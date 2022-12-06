const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendForgotPasswordCode = async (user, req, res) => {
  try {
    const msg = {
      to: user.email,
      from: {
        email: process.env.SMTP_EMAIL,
        name: "Online Shop",
      },
      templateId: process.env.VERIFY_ACCOUNT_TEMPLATE_ID,
      dynamic_template_data: {
        subject: "Online Shop Forgot Password Request",
        link: `${process.env.SUCCESS_PAYMENT_URL}/forgotPassword/${user?._id}`,
        for: "Forgot Password",
      },
    };
    await sgMail.send(msg);
    res.status(200).json({ messagse: "Email Sent" });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};
