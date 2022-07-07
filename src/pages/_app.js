import '../styles/globals.css'
import '../styles/normalize.css'
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

/* Config timezone to Thailand time */
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Bangkok');

function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />
}

export default MyApp
