const path = require("path");

const Event = require("../model/event");
const ErrorResponse = require("../utils/errorResponse");
const downloadFile = require("../shared/download-file");
const deleteFile = require("../utils/deleteFile");

class EventService {
  async find(query) {
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

  // TODO Check update mechanism
  async editEvent(eventId, eventDto) {
    const result = await Event.updateOne({ _id: eventId }, { ...eventDto });
    return result;
  }

  async deleteEvent(eventId) {
    const result = await Event.findOneAndDelete({ _id: eventId });
    if (!result) {
      throw new ErrorResponse(404, "رویدادی با چنین مشخصاتی یافت نشد!", "/404");
    }
    deleteFile(path.join(__dirname, "..", "public", "events", result.eventImg));
    return result;
  }
}
module.exports = new EventService();
