const { Router } = require("express");

const router = Router();

const schoolController = require("../controller/event.controller");
const asyncHandler = require("../middleware/asyncHandler");

//! ---------------------- GET ROUTES ----------------------

// API
//? Get a event details and return json data.
router.get("/:eventId", asyncHandler(schoolController.getEvent));

//? delete a event handler
router.get("/delete/:eventId", asyncHandler(schoolController.deleteEvent));

//! ---------------------- POST ROUTES ----------------------

//? Add a new event handler.
router.post("/new", asyncHandler(schoolController.newEvent));

//? Edit a event handler.
router.post("/edit", asyncHandler(schoolController.editEvent));


module.exports = router;
