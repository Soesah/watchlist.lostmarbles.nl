import moment from 'Moment';

class DateTimeUtil {

  static now () {
    console.log('now', new moment().format('YYYY-MM-DD'))
    return new moment().format('YYYY-MM-DD');
  }
  
}