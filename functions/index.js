const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Configure the email transporter with your email service credentials
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "julyenmarasigan@gmail.com", // replace with your email
    pass: "Syiarayen10",  // replace with your email password or app-specific password
  },
});

// Set threshold values for temperature and humidity
const TEMP_THRESHOLD = 25; // Adjust threshold as needed
const HUMIDITY_THRESHOLD = 55; // Adjust threshold as needed

// Trigger function on data writes to 'sensorData'
exports.sendNotificationOnThreshold = functions.database
  .ref("/sensorData/{pushId}")
  .onCreate(async (snapshot, context) => {
    const data = snapshot.val();
    const temperature = data.temperature;
    const humidity = data.humidity;

    if (temperature >= TEMP_THRESHOLD || humidity >= HUMIDITY_THRESHOLD) {
      const mailOptions = {
        from: "julyenmarasigan@gmail.com",
        to: "mjymarasigan1@tip.edu.ph", // User's email address
        subject: "Sensor Alert: Threshold Exceeded",
        text: `Alert! The sensor has detected levels above the set thresholds.\n\n` +
              `Temperature: ${temperature} °C\n` +
              `Humidity: ${humidity} %\n\n` +
              `Please take the necessary action.`,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("Notification email sent successfully!");
      } catch (error) {
        console.error("Error sending email notification:", error);
      }
    }
    return null;
  });
