const asyncHandler = require("../utils/asyncHandler");
const { submitContact } = require("../services/contact.service");

const createContact = asyncHandler(async (req, res) => {
  const { fullName, email, phone, service, message } = req.body;

  await submitContact({ fullName, email, phone, service, message });

  res.status(201).json({ success: true, message: "Thank you, we received your message." });
});

module.exports = { createContact };
