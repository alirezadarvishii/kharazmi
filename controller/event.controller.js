const { ForbiddenError } = require("@casl/ability");

const EventService = require("../services/event.service");

// API
module.exports.getEvent = async (req, res) => {
  const { eventId } = req.params;
  const event = await EventService.findOne(eventId);
  res.status(200).json(event);
};

module.exports.newEvent = async (req, res) => {
  ForbiddenError.from(req.ability).throwUnlessCan("create", "Event");
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
