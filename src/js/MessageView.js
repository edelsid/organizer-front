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
    const mm = JSON.stringify((rawDate.getMonth() + 1)).padStart(2, 0);
    const dd = JSON.stringify(rawDate.getDate()).padStart(2, 0);
    const hh = JSON.stringify(rawDate.getHours()).padStart(2, 0);
    const min = JSON.stringify(rawDate.getMinutes()).padStart(2, 0);

    const date = `${dd}.${mm}.${yy} ${hh}:${min}`;
    return date;
  }

  renderMessage({ element }, area, highlight) {
    const date = MessageView.getDate(element.date);
    const msg = new Message({ element }, date, highlight);
    let newMsg;
    if (element.type === 'text' || element.type === 'links') {
      newMsg = msg.formation();
    } else {
      newMsg = msg.attachFormation();
    }
    area.appendChild(newMsg);
    this.msgCount(element.type, element.label);
  }

  msgCount(type, label) {
    this.all += 1;
    if (this[type] !== undefined) this[type] += 1;
    if (this[label] !== undefined) this[label] += 1;
  }
}
