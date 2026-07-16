const express = require("express");
const { createContact } = require("../controllers/contact.controller");
const { validateContact } = require("../validators/contact.validator");

const router = express.Router();

/**
 * @openapi
 * /contact:
 *   post:
 *     summary: Submit a contact form message
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email, phone, service, message]
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jane@example.com
 *               phone:
 *                 type: string
 *                 example: "+44 7911 123456"
 *               service:
 *                 type: string
 *                 example: Web Development
 *               message:
 *                 type: string
 *                 example: I'd like a quote for a new website.
 *     responses:
 *       201:
 *         description: Message received and saved; email dispatched to the company inbox
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Thank you, we received your message.
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Internal server error
 */
router.post("/", validateContact, createContact);

module.exports = router;
