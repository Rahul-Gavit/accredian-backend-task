require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");

const app = express();
const prisma = new PrismaClient();

// Use CORS and Body Parser
app.use(cors());
app.use(bodyParser.json());

// OAuth2 Setup
const oauth2Client = new OAuth2Client(
  process.env.OAUTH_CLIENT_ID,
  process.env.OAUTH_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({ refresh_token: process.env.OAUTH_REFRESH_TOKEN });

// Create Nodemailer Transporter with OAuth2
async function createTransporter() {
  const accessToken = await oauth2Client.getAccessToken();

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_SENDER,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      accessToken: accessToken.token,
    },
  });
}

// API: Submit Referral Form
app.post("/api/referral", async (req, res) => {
  const {
    refereeName,
    refereeEmail,
    refereePhoneNumber,
    friendName,
    friendEmail,
    friendPhoneNumber,
    selectedOption,
  } = req.body;

  // Validate request body
  if (
    !refereeName || // Check if refereeName is missing
    !refereeEmail || // Check if refereeEmail is missing
    !refereePhoneNumber || // Check if refereePhoneNumber is missing
    !friendName || // Check if friendName is missing
    !friendEmail || // Check if friendEmail is missing
    !friendPhoneNumber || // Check if friendPhoneNumber is missing
    !selectedOption // Check if selectedOption is missing
  ) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    // Save referral to the database
    const referral = await prisma.referral.create({
      data: {
        refereeName,
        refereeEmail,
        refereePhone: refereePhoneNumber,
        friendName,
        friendEmail,
        friendPhone: friendPhoneNumber,
        selectedOption,
      },
    });

    // Send referral email using Gmail API with OAuth2
    const transporter = await createTransporter();

    const mailOptions = {
      from: refereeEmail,
      to: friendEmail,
      subject: `Referral Invitation from ${refereeName}`,
      text: `Hey ${friendName},\n\n${refereeName} has referred you to join our ${selectedOption} program!\n\nSign up today and enjoy amazing benefits! 🚀`,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(201)
      .json({ message: "Referral submitted successfully!", referral });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving referral", error: error.message });
  }
});

// API: Get All Referrals
app.get("/api/referrals", async (req, res) => {
  try {
    const referrals = await prisma.referral.findMany();
    res.status(200).json(referrals);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching referrals", error: error.message });
  }
});

// API: Delete a Referral
app.delete("/api/referral/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.referral.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: "Referral deleted successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting referral", error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
