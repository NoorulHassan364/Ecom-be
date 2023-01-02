// importing sendGrid to send email
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// senfing mail when user will click on forgot password
exports.sendForgotPasswordCode = async (user, req, res) => {
  try {
    // creating email setup and forgot password link
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
    // sending mail to the frontend
    await sgMail.send(msg);
    res.status(200).json({ messagse: "Email Sent" });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};
