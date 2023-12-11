/* eslint-disable no-console */
/* eslint-disable no-param-reassign */

import MessageView from './MessageView';
import WidgetAPI from './api/WidgetAPI';

export default class Widget {
  constructor(container) {
    this.bindToDOM(container);
    this.view = new MessageView();
    this.api = new WidgetAPI('https://organizer-9u9x.onrender.com', 'wss://organizer-9u9x.onrender.com/ws');
  }

  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
    this.area = document.querySelector('.messages');
    this.counters = Array.from(this.container.querySelectorAll('.counter'));
  }

  init() {
    this.api.websocket.addEventListener('message', (e) => {
      const element = JSON.parse(e.data);
      if (element) {
        this.view.renderMessage({ element }, this.area);
        this.addCount();
      }
    });
    this.loadState();
    this.registerEvents();
    this.addCount();
  }

  registerEvents() {
    const inputField = this.container.querySelector('.msg-input');
    inputField.addEventListener('keypress', (e) => {
      if (e.key !== 'Enter') return;
      if (!inputField.value) return;
      e.preventDefault();
      const type = Widget.determineType(inputField.value);
      this.api.sendMessage(inputField.value, type);
      inputField.value = '';
    });
  }

  static determineType(input) {
    let type = 'text';
    const reg = /(https?:\/\/[^\s]+)/;
    if (reg.test(input)) type = 'links';
    return type;
  }

  loadState() {
    const callback = (error, response) => {
      if (error) {
        console.log(error);
        return;
      }
      response.messages.forEach((element) => {
        this.view.renderMessage({ element }, this.area);
        this.addCount();
      });
    };
    this.api.load(callback);
  }

  addCount() {
    this.counters.forEach((counter) => {
      counter.innerHTML = this.view[counter.id];
    });
  }
}
