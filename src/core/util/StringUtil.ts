const ALL_WHITESPACE = /[^\t\n\r ]/; // https://developer.mozilla.org/en-US/docs/Web/Guide/DOM/Whitespace_in_the_DOM

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
}
