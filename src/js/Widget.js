/* eslint-disable no-console */
/* eslint-disable no-param-reassign */

import MessageView from './MessageView';
import WidgetAPI from './api/WidgetAPI';
import AttachPanel from './AttachPanel';
import FileView from './FileView';
import LabelPanel from './LabelPanel';

export default class Widget {
  constructor(container) {
    this.bindToDOM(container);
    this.view = new MessageView();
    this.fileView = new FileView();
    this.api = new WidgetAPI('https://organizer-9u9x.onrender.com', 'wss://organizer-9u9x.onrender.com/ws');
    /*this.api = new WidgetAPI('http://localhost:7070', 'ws://localhost:7070/ws');*/
    this.labelMenuOut = false;
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
        if (this.view.state !== 'all') {
          this.view.state = 'all';
          this.area.innerHTML = '';
          //или вместо этого можно было бы сбросить все счетчики до нуля
          this.loadState('filter');
        } else {
          this.view.renderMessage({ element }, this.area);
          this.addCount();
        }
        this.scrollDown();
      } else if (response && response.operation) {
        this.area.innerHTML = '';
        response.arr.forEach((element) => {
          this.view.renderMessage({ element }, this.area, response.value, response.operation);
        });
        this.scrollDown();
      }
    });
    this.loadState();
    this.registerEvents();
    this.addCount();
  }

  scrollDown() {
    this.area.scrollTop = this.area.scrollHeight;
  }

  registerEvents() {
    const inputField = this.container.querySelector('.msg-input');
    const searchField = this.container.querySelector('.search');
    const attachBtn = this.container.querySelector('.attach');
    const categories = this.container.querySelector('.categories');
    inputField.addEventListener('keypress', (e) => this.textInput(inputField, e, 'msg'));
    searchField.oninput = (e) => this.textInput(searchField, e, 'srch');
    attachBtn.addEventListener('click', () => this.showPanel());
    categories.addEventListener('click', (e) => this.sidePanelEvent(e));
    this.area.addEventListener('click', (e) => this.msgClick(e));
  }

  textInput(field, e, operation) {
    if (operation === 'msg' && e.key === 'Enter' && field.value) {
      e.preventDefault();
      const type = Widget.determineType(field.value);
      this.api.sendMessage(field.value, type);
      field.value = '';
    } else if (operation === 'srch' && field.value) {
      this.api.searchMessage(field.value);
    } else if (operation === 'srch' && !field.value) {
      this.area.innerHTML = '';
      this.loadState();
    }
  }

  sidePanelEvent(e) {
    const value = e.target.id;
    this.api.filterMessage(value);
    this.view.state = value;
  }

  msgClick(e) {
    let target = e.target;
    if (e.target.className !== 'labelWindow' && this.labelMenuOut) {
      this.labelPanel.element.remove();
      this.labelPanel = null;
      this.labelMenuOut = false;
      return;
    } 
    
    if (e.target.className === 'msg-info' || 'msg-body') {
      target = e.target.parentElement;
    } else if (e.target.parentElement === 'msg-info' || 'msg-body') {
      target = e.target.parentElement.parentElement;
    }
    this.labelPanel = new LabelPanel();
    target.appendChild(this.labelPanel.element);
    this.labelPanel.element.addEventListener('click', (e) => this.hookClick(e, target));
    this.labelMenuOut = true;
  }

  hookClick(e, msg) {
    console.log(e.target.id, msg);
    const msgBody = msg.querySelector('.msg-body');
    if (msgBody.className.includes('label-'+e.target.id)) {
      console.log('has already');
      return;
    }
    this.api.changeLabel(e.target.id, msg.id);
    console.log(msgBody.className);
    if (e.target.id === 'none') {
      msgBody.className = 'msg-body';
      this.view.none += 1;
      this.view[msgBody.id] = Math.max(0, this.view[msgBody.id] - 1);
    } else {
      msgBody.className = 'msg-body has-label label-'+e.target.id;
      if (msgBody.id === 'none') {
        this.view.none = Math.max(0, this.view.none - 1);
      } else {
        this.view[msgBody.id] = Math.max(0, this.view[msgBody.id] - 1);
      }
      this.view[e.target.id] += 1;
    }
    this.addCount();
  }

  // это перенести в MessageView
  static determineType(input) {
    let type = 'text';
    const reg = /(https?:\/\/[^\s]+)/;
    if (reg.test(input)) type = 'links';
    if (input.includes('@chaos')) type = 'command';
    return type;
  }

  loadState(operation) {
    const callback = (error, response) => {
      if (error) {
        console.log(error);
        return;
      }
      let lastPost;
      if (operation === 'filter') {
        lastPost = response.messages.pop();
      }
      response.messages.forEach((element) => {
        this.view.renderMessage({ element }, this.area, null, operation);
      });
      if (lastPost) {
        const element = lastPost;
        this.view.renderMessage({ element }, this.area);
      }
      this.addCount();
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
      const callback = (fileInfo, reqType) => {
        this.api.sendMessage(null, reqType, fileInfo);
        panel.element.remove();
      }
      this.fileView.read(file, callback);
    });
  }
}
