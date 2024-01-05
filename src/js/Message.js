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
    newMsg.id = this.id;
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
    newMsg.id = this.id;
    const labelString = this.determineLabel();
    const preview = this.determinePreview();

    newMsg.innerHTML = `
    <header class="msg-info">
      <span class="avatar"></span>
      <h3 class="autor">Chaos Organizer</h3>
      <time class="time">${this.date}</time>
    </header>${
  labelString}
      <div class="attachWrapper">
        ${preview}
        <div class="nameplate">
          <text class="attachName">${this.attach.name}</text>
          <text class="attachSize">${this.attach.size}Mb</text>
        </div>
      </div>
    </div>`;

    return newMsg;
  }

  determinePreview() {
    let attachData;
    if (this.type === 'img') {
      attachData = `
      <a class="link img-link" href=${this.attach.data} rel="noopener" download=${this.attach.name}>
      <img class="attachment" src=${this.attach.data}></img>
      </a>`;
    } else if (this.type === 'video') {
      attachData = `
      <a class="link vid-link" href=${this.attach.data} rel="noopener" download=${this.attach.name}>
      <video class="attachment" src=${this.attach.data}></video>
      <span class="overlay"></span>
      </a>`;
    } else if (this.type === 'audio') {
      attachData = `
      <a class="link audio-link" href=${this.attach.data} rel="noopener" download=${this.attach.name}>
      <span class="audio-overlay"></span>
      </a>`;
    }
    return attachData;
  }

  determineLabel() {
    let labelString;
    switch (this.label) {
      case 'imp': labelString = '<div class="msg-body has-label label-imp" id="imp">';
        return labelString;
      case 'later': labelString = '<div class="msg-body has-label label-later" id="later">';
        return labelString;
      case 'done': labelString = '<div class="msg-body has-label label-done" id="done">';
        return labelString;
      default: labelString = '<div class="msg-body" id="none">';
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
    const reg = new RegExp(this.highlight, 'gi');
    highlighed = this.body.replaceAll(reg, '<span class="highlight">$&</span>');
    return highlighed;
  }
}
