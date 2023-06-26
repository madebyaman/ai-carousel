export function isRgbColor(color: string | any) {
  var rgbPattern = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/;
  return rgbPattern.test(color);
}

export function rgbToHex(rgb: string | any) {
  var result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(rgb);
  return result ? '#' +
    (parseInt(result[1], 10) | (1 << 8)).toString(16).slice(1) +
    (parseInt(result[2], 10) | (1 << 8)).toString(16).slice(1) +
    (parseInt(result[3], 10) | (1 << 8)).toString(16).slice(1) : rgb;
}
