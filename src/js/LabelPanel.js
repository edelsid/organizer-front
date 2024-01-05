export default class LabelPanel {
   constructor() {
     this.element = document.createElement('div');
     this.element.className = 'labelWindow';
     this.element.innerHTML = this.formation();
   }

   formation() {
      const newWindow = `
      <span class="labelBtn label none" id="none"></span>
      <span class="labelBtn label important" id="imp"></span>
      <span class="labelBtn label later" id="later"></span>
      <span class="labelBtn label done" id="done"></span>
      `;
      return newWindow;
   }
}