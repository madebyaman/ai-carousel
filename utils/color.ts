export function isRgbColor(color: string | any | undefined) {
  var rgbPattern = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/;
  if (!color) return false;
  return rgbPattern.test(color);
}

export function isHexColor(color: string | any): boolean {
  const hexColorRegex = /^#([0-9A-F]{3}){1,2}$/i;
  return hexColorRegex.test(color);
}

function hexToHSL(hex: string): [number, number, number] {
  let r: number = 0, g: number = 0, b: number = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;
  if (delta === 0)
    h = 0;
  else if (cmax === r)
    h = ((g - b) / delta) % 6;
  else if (cmax === g)
    h = (b - r) / delta + 2;
  else
    h = (r - g) / delta + 4;
  h = Math.round(h * 60);
  if (h < 0)
    h += 360;
  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);
  return [h, s, l];
}

export function isLight(hex: string) {
  const hsl = hexToHSL(hex);
  return hsl[2] > 50;  // Returns true if lightness is greater than 50%
}


export function rgbToHex(rgb: string | any) {
  var result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(rgb);
  return result ? '#' +
    (parseInt(result[1], 10) | (1 << 8)).toString(16).slice(1) +
    (parseInt(result[2], 10) | (1 << 8)).toString(16).slice(1) +
    (parseInt(result[3], 10) | (1 << 8)).toString(16).slice(1) : rgb;
}
