const { ForbiddenError } = require("@casl/ability");

const EventService = require("../services/event.service");
const ErrorResponse = require("../utils/errorResponse");
const eventValidation = require("../validation/event.validation");

// Public API for any type of users.
module.exports.getEvent = async (req, res) => {
  const { eventId } = req.params;
  const event = await EventService.findOne(eventId);
  res.status(200).json(event);
};

module.exports.newEvent = async (req, res) => {
  ForbiddenError.from(req.ability).throwUnlessCan("create", "Event");
  const validate = eventValidation.eventSchema.validate(req.body);
  if (validate.error) {
    throw new ErrorResponse(422, validate.error.message, "back");
  }
  if (!req.files.eventImg) {
    throw new ErrorResponse(404, "فیلد تصویر رویداد الزامی است!", "back");
  }
  const eventDto = {
    ...req.body,
    eventImg: req.files.eventImg[0].buffer,
  };
  await EventService.newEvent(eventDto);
  req.flash("success", "رویداد جدید با موفقیت ایجاد شد!");
  res.redirect("back");
};

module.exports.editEvent = async (req, res) => {
  ForbiddenError.from(req.ability).throwUnlessCan("update", "Event");
  const { eventId } = req.body;
  const validate = eventValidation.eventSchema.validate(req.body);
  if (validate.error) {
    throw new ErrorResponse(402, validate.error.message, "back");
  }
  // TODO Check update mechanism
  const eventDto = {
    ...req.body,
  };
  if (req.files.eventImg) {
    eventDto.eventImg = req.files.eventImg[0].buffer;
  }
  await EventService.editEvent(eventId, eventDto);
  req.flash("success", "رویداد مورد نظر با موفقیت ویرایش گردید!");
  res.redirect("back");
};

module.exports.deleteEvent = async (req, res) => {
  ForbiddenError.from(req.ability).throwUnlessCan("delete", "Event");
  const { eventId } = req.body;
  await EventService.deleteEvent(eventId);
  req.flash("success", "رویداد مورد نظر با موفقیت حذف گردید!");
  res.redirect("back");
};
