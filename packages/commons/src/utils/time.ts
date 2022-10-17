import moment from 'moment';

type FormatDateTime = (timeStringUTC: string, format?: string) => string;

const formatDateTime: FormatDateTime = (timeStringUTC, format = 'MM/DD/YY, h:mm A') => moment.utc(timeStringUTC).local().format(format);

export default {
  formatDateTime,
};
