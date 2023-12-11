export default class Message {
  constructor(id, type, label, body, date) {
    this.id = id;
    this.type = type;
    this.label = label;
    this.body = body;
    this.date = date;
  }

  formation() {
    const newMsg = document.createElement('div');
    newMsg.className = 'message';
    this.checkLink();
    const labelString = this.determineLabel();

    newMsg.innerHTML = `
    <header class="msg-info">
    <span class="avatar"></span>
    <h3 class="autor">Chaos Organizer</h3>
    <time class="time">${this.date}</time>
    </header>${
  labelString}
      <text class="text">${this.body}</text>
    </div>`;

    return newMsg;
  }

  determineLabel() {
    let labelString;
    switch (this.label) {
      case 'imp': labelString = '<div class="msg-body has-label label-important">';
        break;
      case 'later': labelString = '<div class="msg-body has-label label-later">';
        break;
      case 'done': labelString = '<div class="msg-body has-label label-done">';
        break;
      default: labelString = '<div class="msg-body">';
    }
    return labelString;
  }

  checkLink() {
    if (this.type === 'links') {
      this.body = `<a href='${this.body}' target="_blank" rel="noopener noreferrer">${this.body}</a>`;
    }
  }
}
