const path = require("sharp");

const sharp = require("sharp");

const Event = require("../model/event");
const ErrorResponse = require("../utils/errorResponse");
const deleteFile = require("../utils/deleteFile");
const pick = require("../utils/pick");
const eventValidation = require("../validation/event.validation");

// API
exports.getEvent = async (req, res) => {
  const { eventId } = req.params;
  const event = await Event.findOne({ _id: eventId });
  res.status(200).json(event);
};

exports.newEvent = async (req, res) => {
  const validate = eventValidation.eventSchema.validate(req.body);
  if (validate.error) {
    throw new ErrorResponse(422, validate.error.message, "back");
  }
  if (!req.files.eventImg) {
    throw new ErrorResponse(404, "فیلد تصویر رویداد الزامی است!", "back");
  }
  const filename = `${Date.now()}.jpeg`;
  sharp(req.files.eventImg[0].buffer)
    .jpeg({
      quality: 40,
    })
    .toFile(path.join(__dirname, "..", "public", "events", filename), async (err) => {
      if (err) {
        throw new ErrorResponse(402, "خطا در بارگیری تصویر، لطفا دوباره تلاش کنید!", "back");
      }
      await Event.create({ ...req.body, eventImg: filename });
      req.flash("success", "رویداد جدید با موفقیت ایجاد شد!");
      res.redirect("back");
    });
};

exports.editEvent = async (req, res) => {
  const { eventId } = req.body;
  const validate = eventValidation.eventSchema.validate(req.body);
  if (validate.error) {
    throw new ErrorResponse(402, validate.error.message, "back");
  }
  const newValues = pick(req.body, ["title", "description", "start", "time"]);
  // if(req.files.eventImg) {}
  const event = await Event.updateOne({ _id: eventId }, { ...newValues });
  if (event.n === 0) {
    throw new ErrorResponse(404, "رویداد مورد نظر یافت نشد!", "back");
  }
  req.flash("success", "رویداد مورد نظر با موفقیت ویرایش گردید!");
  res.redirect("back");
};

exports.deleteEvent = async (req, res) => {
  const { eventId } = req.params;
  const event = await Event.findOneAndDelete({ _id: eventId });
  console.log(event);
  if (!event) throw new ErrorResponse(404, "رویدادی با چنین مشخصاتی یافت نشد!", "/404");
  deleteFile(path.join(__dirname, "..", "public", "events", event.eventImg));
  req.flash("success", "رویداد مورد نظر با موفقیت حذف گردید!");
  res.redirect("back");
};
