export default class Message {
  constructor({ element }, date, highlight) {
    this.id = element.id;
    this.type = element.type;
    this.label = element.label;
    this.body = element.body;
    this.attach = element.attach;
    this.date = date;
    this.highlight = highlight;
  }

  formation() {
    const newMsg = document.createElement('div');
    newMsg.className = 'message';
    this.checkLink();
    this.body = this.checkHighlight();
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

  attachFormation() {
    const newMsg = document.createElement('div');
    newMsg.className = 'message';
    const labelString = this.determineLabel();

    newMsg.innerHTML = `
    <header class="msg-info">
      <span class="avatar"></span>
      <h3 class="autor">Chaos Organizer</h3>
      <time class="time">${this.date}</time>
    </header>${
  labelString}
      <div class="attachWrapper">
        <a class="img-link" href=${this.attach.src} rel="noopener" download=${this.attach.name}>
          <img class="attachment" src=${this.attach.src}></img>
        </a>
        <div class="nameplate">
          <text class="attachName">${this.attach.name}</text>
          <text class="attachSize">${this.attach.size}Mb</text>
        </div>
      </div>
    </div>`;

    return newMsg;
  }

  determineLabel() {
    let labelString;
    switch (this.label) {
      case 'imp': labelString = '<div class="msg-body has-label label-important">';
        return labelString;
      case 'later': labelString = '<div class="msg-body has-label label-later">';
        return labelString;
      case 'done': labelString = '<div class="msg-body has-label label-done">';
        return labelString;
      default: labelString = '<div class="msg-body">';
    }
    return labelString;
  }

  checkLink() {
    if (this.type === 'links') {
      this.body = `<a href='${this.body}' target="_blank" rel="noopener noreferrer">${this.body}</a>`;
    }
  }

  checkHighlight() {
    let highlighed;
    if (!this.highlight) return this.body;
    if (this.type === 'links') {
      highlighed = `<span class="highlight">${this.body}</span>`;
      return highlighed;
    }
    highlighed = this.body.replace(this.highlight, `<span class="highlight">${this.highlight}</span>`);
    return highlighed;
  }
}
