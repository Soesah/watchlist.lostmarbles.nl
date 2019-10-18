import { format } from 'date-fns';

export class DateTimeUtil {
  static now(): string {
    return format(new Date(), 'YYYY-MM-DD');
  }

  static year(): number {
    return new Date().getFullYear();
  }
}
