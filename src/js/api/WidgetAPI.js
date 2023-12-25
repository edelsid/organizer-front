/* eslint-disable no-alert */

import createRequest from './createRequest';

export default class WidgetAPI {
  constructor(url, websocketURL) {
    this.url = url;
    this.websocket = new WebSocket(websocketURL);
  }

  load(callback) {
    createRequest({
      url: `${this.url}/archive`,
      method: 'GET',
      callback: (status, response) => {
        if (status) {
          callback(null, response);
        } else {
          alert('Ошибка!');
        }
      },
    });
  }

  sendMessage(value, type, attach) {
    const body = {
      type: 'send',
      msg: {
        type,
        label: 'none',
        body: value,
        attach,
        date: Date.now(),
      },
    };
    this.websocket.send(JSON.stringify(body));
  }

  searchMessage(value) {
    const body = {
      type: 'search',
      msg: value,
    };
    this.websocket.send(JSON.stringify(body));
  }
}
