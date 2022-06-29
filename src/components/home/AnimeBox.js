import styles from '../styles/AnimeBox.module.css';
import Link from 'next/link';
const dayjs = require('dayjs');
import 'dayjs/locale/th';

const AnimeBox = (props) => {
    /* Get anime and language of title now from props */
    const { anime, titleNow } = props;

    /* Get title language from anime object */
    const { title_jp, title_en, title_th } = anime;

    /* Get main title from title now */
    const title = +titleNow === 0 ? title_jp : +titleNow === 1 ? title_en : title_th;
    return (
        <Link href={`/content/${anime.id}`}>
            <a>
            <div className={styles.box}>
                <p className={styles.row}>
                    <span className={styles.title}>{'ชื่อเรื่อง : '}</span>
                    <span>{title}</span>
                </p>
                <p className={styles.row}>
                    <span className={styles.title}>{'จำนวน : '}</span>
                    <span>{`${anime.season_count} Season`}</span>
                </p>
                <p className={styles.row}>
                    <span className={styles.title}>{'รวม : '}</span>
                    <span>{`${!!anime.all_chapter ? anime.all_chapter : 0} ตอน`}</span>
                </p>
                <p className={styles.gray}>{`อัพเดตล่าสุด : ${dayjs(anime.last_update).locale('th').format('D MMM YYYY - H:mm')}`}</p>
            </div>
            </a>
        </Link>
    );
}

export default AnimeBox;