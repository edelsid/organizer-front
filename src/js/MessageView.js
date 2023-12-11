/* eslint-disable no-alert */

import Message from './Message';

export default class MessageView {
  constructor() {
    this.all = 0;
    this.text = 0;
    this.audio = 0;
    this.video = 0;
    this.links = 0;
    this.img = 0;
    this.none = 0;
    this.imp = 0;
    this.later = 0;
    this.done = 0;
  }

  static getDate(info) {
    const rawDate = new Date(info);
    const yy = rawDate.getFullYear().toString().slice(-2);
    const mm = MessageView.insertZeroes(rawDate.getMonth() + 1);
    const dd = MessageView.insertZeroes(rawDate.getDate());
    const hh = MessageView.insertZeroes(rawDate.getHours());
    const min = MessageView.insertZeroes(rawDate.getMinutes());

    const date = `${dd}.${mm}.${yy} ${hh}:${min}`;
    return date;
  }

  static insertZeroes(value) {
    let newValue;
    if (value < 10) {
      newValue = `0${value}`;
      return newValue;
    }
    return value;
  }

  renderMessage({ element }, area) {
    const date = MessageView.getDate(element.date);
    const msg = new Message(element.id, element.type, element.label, element.body, date);
    const newMsg = msg.formation();
    area.appendChild(newMsg);
    this.msgCount(element.type, element.label);
  }

  msgCount(type, label) {
    this.all += 1;
    if (this[type] !== undefined) this[type] += 1;
    if (this[label] !== undefined) this[label] += 1;
  }
}
