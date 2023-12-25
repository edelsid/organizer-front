/* eslint-disable no-console */
/* eslint-disable no-param-reassign */

import MessageView from './MessageView';
import WidgetAPI from './api/WidgetAPI';
import AttachPanel from './AttachPanel';
import FileView from './FileView';

export default class Widget {
  constructor(container) {
    this.bindToDOM(container);
    this.view = new MessageView();
    this.fileView = new FileView();
    this.api = new WidgetAPI('https://organizer-9u9x.onrender.com', 'wss://organizer-9u9x.onrender.com/ws');
    /*this.api = new WidgetAPI('http://localhost:7070', 'ws://localhost:7070/ws');*/
  }

  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
    this.area = this.container.querySelector('.messages');
    this.counters = Array.from(this.container.querySelectorAll('.counter'));
  }

  init() {
    this.api.websocket.addEventListener('message', (e) => {
      const response = JSON.parse(e.data);
      // раздробить на отдельные методы
      if (response && !response.operation) {
        const element = response;
        this.view.renderMessage({ element }, this.area);
        this.addCount();
      } else if (response && response.operation) {
        this.area.innerHTML = '';
        response.arr.forEach((element) => {
          this.view.renderMessage({ element }, this.area, response.value);
        });
      }
    });
    this.loadState();
    this.registerEvents();
    this.addCount();
  }

  registerEvents() {
    const inputField = this.container.querySelector('.msg-input');
    const searchField = this.container.querySelector('.search');
    const attachBtn = this.container.querySelector('.attach');
    inputField.addEventListener('keypress', (e) => this.textInput(inputField, e, 'msg'));
    // поиск должен идти с каждым нажатием клавиши
    searchField.addEventListener('keypress', (e) => this.textInput(searchField, e, 'srch'));
    attachBtn.addEventListener('click', () => this.showPanel());
  }

  textInput(field, e, operation) {
    if (e.key !== 'Enter') return;
    if (!field.value) return;
    e.preventDefault();

    if (operation === 'msg') {
      const type = Widget.determineType(field.value);
      this.api.sendMessage(field.value, type);
      field.value = '';
    } else if (operation === 'srch') {
      this.api.searchMessage(field.value);
    }
  }

  // это перенести в MessageView
  static determineType(input) {
    let type = 'text';
    const reg = /(https?:\/\/[^\s]+)/;
    if (reg.test(input)) type = 'links';
    return type;
  }

  // это перенести в MessageView
  static determineFileType(input) {
    let type = 'text';
    if (input.includes('image')) type = 'img';
    else if (input.includes('audio')) type = 'audio';
    else if (input.includes('video')) type = 'video';
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

  showPanel() {
    const panel = new AttachPanel();
    this.container.appendChild(panel.element);
    panel.element.querySelector('.close').addEventListener('click', () => {
      panel.element.remove();
    });
    panel.addHooks();
    this.panelEvents(panel);
  }

  panelEvents(panel) {
    panel.inputBtn.addEventListener('click', () => {
      panel.overlapped.dispatchEvent(new MouseEvent('click'));
    });

    panel.inputBtn.addEventListener('change', () => {
      const file = panel.overlapped.files && panel.overlapped.files[0];
      if (!file) return;
      const fileInfo = FileView.read(file);
      const type = Widget.determineFileType(fileInfo.type);
      this.api.sendMessage(null, type, fileInfo);
      panel.element.remove();
    });
  }
}
