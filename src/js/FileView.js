export default class FileView {
  static read(file) {
    const url = URL.createObjectURL(file);
    let { name } = file;
    if (file.name.length > 20) {
      name = `${file.name.slice(0, 20)}...`;
    }
    const size = (file.size / (1024 * 1024)).toFixed(2);
    const fileInfo = {
      name,
      type: file.type,
      size,
      src: url,
    };
    return fileInfo;
  }
}
