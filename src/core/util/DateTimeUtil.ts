import moment from 'moment';

export class DateTimeUtil {
  static now(): string {
    return moment().format('YYYY-MM-DD');
  }

  static year(): number {
    return moment().year();
  }
}
