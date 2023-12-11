export default class Form {
  formation() {
    this.formElement = document.createElement('div');
    this.formElement.className = 'warning';
    this.formElement.innerHTML = `
      <text class="msg">Что-то пошло не так<br><br>
      К сожалению, нам не удалось определить ваше местоположение. 
      Пожалуйста, дайте разрешение на использование геолокации, 
      либо введите координаты вручную.<br><br>
      Широта и долгота через запятую (максимум 5 цифр после запятой):</text>
      <input class="coord_print">
      <ul class="form_btns">
        <li class="form_btn decline">Отмена</li>
        <li class="form_btn accept" type="submit">Ок</li>
      </ul>`;
  }

  static validateForm(coord) {
    if (!coord) return false;
    if (!coord.includes(',')) return false;

    const reg = /^-?[0-9]{1,2}\.[0-9]{1,5}$/;

    // eslint-disable-next-line
    const noBrackets = coord.replace(/[\[\]]+/g, '');
    const noSpaces = noBrackets.replace(/\s/g, '');
    const coordArr = noSpaces.split(',');
    if (coordArr.length > 2) return false;
    if (!reg.test(coordArr[0]) || !reg.test(coordArr[1])) {
      return false;
    }

    const cleanCoord = {
      lat: coordArr[0],
      long: coordArr[1],
    };
    return cleanCoord;
  }
}
