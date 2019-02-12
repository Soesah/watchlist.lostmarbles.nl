const ALL_WHITESPACE: RegExp = /[^\t\n\r ]/; // https://developer.mozilla.org/en-US/docs/Web/Guide/DOM/Whitespace_in_the_DOM
const CHARS: string = 'abcdefghijklmnopqrstuvwxyz0123456789';

export class StringUtil {
  static isWhitespace(str: string): boolean {
    return !ALL_WHITESPACE.test(str);
  }

  static capitalize(str: string): string {
    return str.replace(
      /\w\S*/g,
      txt => txt.charAt(0).toUpperCase() + txt.substring(1)
    );
  }

  static leadingZero(str: string, size: number): string {
    size = size !== undefined ? size : 2;
    while (String(str).length < size) str = '0' + str;
    return str;
  }

  static hashify = (str: string): string => {
    while (str.length < 15) {
      str = str.repeat(2);
    }

    return str
      .split('')
      .map((s: string) => s.charCodeAt(0))
      .map((i: number) => Math.floor(i * Math.random()) % 36)
      .map((i: number, index: number) =>
        (index + 1) % 4 === 0 ? CHARS[i] + '-' : CHARS[i]
      )
      .join('')
      .substring(0, 19);
  };
}
