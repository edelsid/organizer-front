export default class AttachPanel {
  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'attachWindow';
    this.element.innerHTML = AttachPanel.formation();
  }

  static formation() {
    const newWindow = `
      <span class="close"></span>
      <div class="dropWindow">
         <span class="dropMessage">Перенесите ваш файл сюда</span>
         <span class="or">или</span>
         <div class="inputWrapper">
            <input class="fileInput" type="file" accept="image/*, audio/*, video/*">
            <label for="fileInput" class="overlap">Выберите файл</label>
         </div>
      </div>`;
    return newWindow;
  }

  addHooks() {
    this.inputBtn = this.element.querySelector('.inputWrapper');
    this.overlapped = this.inputBtn.querySelector('.fileInput');
  }
}
