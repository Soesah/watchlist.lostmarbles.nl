import { format } from 'date-fns';

export class DateTimeUtil {
  static now(): string {
    return format(new Date(), 'yyyy-MM-dd');
  }

  static year(): number {
    return new Date().getFullYear();
  }
}
