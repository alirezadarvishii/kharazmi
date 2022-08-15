const { Router } = require("express");

const router = Router();

const schoolController = require("../controller/event.controller");
const asyncHandler = require("../middleware/asyncHandler");
const validate = require("../middleware/validate");
const eventValidation = require("../validation/event.validation");

// ---------------------- GET ROUTES ----------------------

// API
// Get a event details and return json data.
router.get("/:eventId", asyncHandler(schoolController.getEvent));

// ---------------------- POST ROUTES ----------------------

// Add a new event handler.
router.post(
  "/new",
  validate(eventValidation.event),
  asyncHandler(schoolController.newEvent),
);

// Edit a event handler.
router.post(
  "/edit",
  validate(eventValidation.event),
  asyncHandler(schoolController.editEvent),
);

// delete a event handler
router.post("/delete", asyncHandler(schoolController.deleteEvent));

module.exports = router;
