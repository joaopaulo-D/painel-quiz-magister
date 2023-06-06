import moment from 'moment';

export function convertTimeStampToString(timestamp: any) {
  if (timestamp == null) {
    return
  } else {
    const date = timestamp.toDate();
    return moment(date).format('DD/MM/YYYY HH:mm');
  }
}