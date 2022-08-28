const path = require("path");

const httpStatus = require("http-status");

const Event = require("../model/event");
const ApiError = require("../errors/ApiError");
const downloadFile = require("../shared/download-file");
const deleteFile = require("../utils/deleteFile");

class EventService {
  async getEvents(query) {
    const events = await Event.find({ ...query });
    return events;
  }

  async findOne(eventId) {
    const event = await Event.findOne({ _id: eventId });
    return event;
  }

  async newEvent(eventDto) {
    const filename = `${Date.now()}.jpeg`;
    await downloadFile({
      path: path.join(__dirname, "..", "public", "events", filename),
      quality: 60,
      buffer: eventDto.eventImg,
    });
    await Event.create({ ...eventDto, eventImg: filename });
  }

  async editEvent(eventId, eventDto) {
    const event = await Event.findOne({ _id: eventId });
    if (eventDto.eventImg) {
      await downloadFile({
        path: path.join(__dirname, "..", "public", "events", event.eventImg),
        quality: 60,
        buffer: eventDto.eventImg,
      });
      delete eventDto.eventImg;
    }
    const result = await Event.updateOne({ _id: eventId }, { ...eventDto });
    return result;
  }

  async deleteEvent(eventId) {
    const result = await Event.findOneAndDelete({ _id: eventId });
    if (!result) {
      throw new ApiError({
        statusCode: httpStatus.NOT_FOUND,
        code: httpStatus[404],
        message: "رویدادی با چنین مشخصاتی یافت نشد!",
        redirectionPath: "back",
      });
    }
    deleteFile(path.join(__dirname, "..", "public", "events", result.eventImg));
    return result;
  }
}
module.exports = new EventService();
