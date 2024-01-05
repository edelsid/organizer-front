export default class FileView {
  constructor() {
    this.reader = new FileReader();
  }

  read(file, callback) {
    let { name } = file;
    if (file.name.length > 20) {
      name = `${file.name.slice(0, 20)}...`;
    }
    const size = (file.size / (1024 * 1024)).toFixed(2);
    let rawData;

    this.reader.onload = (e) => {
      rawData = e.target.result;
      const fileInfo = {
        name,
        type: file.type,
        size,
        data: rawData,
      };
      const reqType = FileView.determineFileType(file.type);
      callback(fileInfo, reqType);
    }

    this.reader.readAsDataURL(file);
  }

  static determineFileType(input) {
    let type = 'text';
    if (input.includes('image')) type = 'img';
    else if (input.includes('audio')) type = 'audio';
    else if (input.includes('video')) type = 'video';
    return type;
  }
}
