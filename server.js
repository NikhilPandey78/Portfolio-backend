const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Contact API is running",
  });
});

app.post("/api/contact", async (req, res) => {
  console.log("BODY RECEIVED:", req.body);

  const { name, email, subject, message, category } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `[${category || "General"}] ${subject || "Portfolio Inquiry"}`,
      text: `
New Contact Request

Inquiry Type: ${category || "Not provided"}
Name: ${name || "Not provided"}
Email: ${email || "Not provided"}

Message:
${message || "No message provided"}
      `,
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Error sending contact email:", error);
    res.status(500).json({
      success: false,
      message: "Error sending message",
    });
  }
});

app.listen(port, () => {
  console.log(`Contact API listening on port ${port}`);
});
