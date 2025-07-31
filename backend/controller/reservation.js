import ErrorHandler from "../middlewares/error.js";
import { Reservation } from "../models/reservation.js";

const send_reservation = async (req, res, next) => {
  const { firstName, lastName, email, date, time, phone } = req.body;
  console.log("📥 Received Request Body:", req.body);
  // Check for missing fields
  if (!firstName || !lastName || !email || !date || !time || !phone) {
    return next(new ErrorHandler("Please fill the full reservation form!", 400));
  }

  try {
    // Save reservation to database
    const reservation = await Reservation.create({
      firstName,
      lastName,
      email,
      date,
      time,
      phone,
    });
 console.log("✅ Reservation Created:", reservation);
    // Send success response with data
    return res.status(201).json({
      success: true,
      message: "Reservation sent successfully!",
      reservation,
    });

  } catch (error) {
    console.error("❌ Error while saving:", error);
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return next(new ErrorHandler(validationErrors.join(', '), 400));
    }

    // Handle all other errors
    return next(error);
  }
};

export default send_reservation;
