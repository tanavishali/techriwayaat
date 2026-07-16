const express = require("express");
const upload = require("../middlewares/upload");
const { validateJobApplication } = require("../validators/careers.validator");
const { getCounts, applyToJob } = require("../controllers/careers.controller");

const router = express.Router();

/**
 * @openapi
 * /careers/counts:
 *   get:
 *     summary: Get current application counts per internship
 *     tags: [Careers]
 *     responses:
 *       200:
 *         description: Application counts for every listed internship
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 counts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       jobId:
 *                         type: number
 *                         example: 1
 *                       count:
 *                         type: number
 *                         example: 12
 *                       limit:
 *                         type: number
 *                         example: 100
 */
router.get("/counts", getCounts);

/**
 * @openapi
 * /careers/jobs/{jobId}/apply:
 *   post:
 *     summary: Submit an internship application
 *     tags: [Careers]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [fullName, email, phone, coverLetter, cv]
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               linkedin:
 *                 type: string
 *               portfolio:
 *                 type: string
 *               coverLetter:
 *                 type: string
 *               cv:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Application received and emailed to the company inbox
 *       400:
 *         description: Validation error
 *       409:
 *         description: Application limit reached for this internship
 *       500:
 *         description: Internal server error
 */
router.post("/jobs/:jobId/apply", upload.single("cv"), validateJobApplication, applyToJob);

module.exports = router;
