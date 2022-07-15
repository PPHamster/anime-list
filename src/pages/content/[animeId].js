import Link from 'next/link';
import db from '../../db';
import Header from '../../components/Header';
import NavBar from '../../components/NavBar';
import styles from '../../styles/basic.module.css';
import AnimeDetail from '../../components/content/AnimeDetail';
import Footer from '../../components/Footer';
import AnimeSeason from '../../components/content/AnimeSeason';
import AnimeWaifu from '../../components/content/AnimeWaifu';
import { IoMdAddCircle } from 'react-icons/io';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { useState } from 'react';
import UpdateSeason from '../../components/content/UpdateSeason';
import CreateSeason from '../../components/content/CreateSeason';
import ScrollTopButton from '../../components/ScrollTopButton';

const AnimeId = (props) => {
    /* Object anime in props */
    const success = props.success;
    const anime = JSON.parse(props.anime);
    const seasons = JSON.parse(props.seasons);
    const waifu = JSON.parse(props.waifu);

    /* Crerate and Update Season in each anime */
    const [createSeasonPopup, setCreateSeasonPopup] = useState(false);
    const [updateSeasonPopup, setUpdateSeasonPopup] = useState(null);

    /* Element content, season and season popup */
    let contentElement = null;
    let seasonContent = null;
    let createSeasonPopupElement = null;
    let updateSeasonPopupElement = null;

    /* Popup create season */
    if (createSeasonPopup) {
        const lastSequence = seasons.length !== 0 ? seasons[seasons.length - 1].sequence : 0;
        createSeasonPopupElement = <CreateSeason animeId={anime.id} setCreatePopup={setCreateSeasonPopup} lastSequence={lastSequence} />;
    }

    /* Popup update season */
    if (!!updateSeasonPopup) {
        updateSeasonPopupElement = <UpdateSeason season={updateSeasonPopup} setUpdatePopup={setUpdateSeasonPopup} />
    }

    /* Have Season at least 1 season */
    if (seasons.length !== 0) {
        let allChapter = 0;
        const allSeasonElement = seasons.map((season) => {
            allChapter += season.chapter_count;
            return <AnimeSeason key={season.id} season={season} setUpdatePopup={setUpdateSeasonPopup} />;
        });

        seasonContent = (
            <>
                <p className={styles.title}>{`รวม : ${seasons.length} Season , ${allChapter} ตอน`}</p>
                <div className={styles.spaceBottom}>{allSeasonElement}</div>
            </>
        )
    }
    else {
        seasonContent = <p className={styles.title}>{`ยังไม่มีข้อมูล`}</p>
    }

    /* Get data in database success */
    if (success) {
        contentElement = (
            <>
                {/* Detail in each anime */}
                <h2 className={styles.title}>ข้อมูลอนิเมะ</h2>
                <AnimeDetail anime={anime} />
                <hr className={styles.line} />
                {/* Season in each anime */}
                <h2 className={styles.title}>Season และตอนทั้งหมด</h2>
                {seasonContent}
                <button className={styles.button} onClick={() => { setCreateSeasonPopup(true) }}>
                    <span className={styles.textButton}>
                        <IoMdAddCircle className={styles.iconButton} />เพิ่ม Season
                    </span>
                </button>
                <hr className={styles.line} />
                {/* Waifu in each anime */}
                <h2 className={styles.title}>Waifu ประจำเรื่อง</h2>
                <AnimeWaifu waifu={waifu} animeId={anime.id} />
                <hr className={styles.line} />
                {/* Created date and last update */}
                <p><span className={styles.topic}>{`วันที่ลง : `}</span>{dayjs(anime.created_at).tz('Asia/Bangkok').locale('th').format('D MMMM YYYY - H:mm')}</p>
                <p><span className={styles.topic}>{`อัพเดทล่าสุด : `}</span>{dayjs(anime.last_update).tz('Asia/Bangkok').locale('th').format('D MMMM YYYY - H:mm')}</p>
                {/* For create and update season */}
                {createSeasonPopupElement}
                {updateSeasonPopupElement}
            </>
        );
    }
    /* Can't get data from database */
    else {
        contentElement = (
            <div className={styles.textCenter}>
                <h1>ไม่พบเนื้อหาที่ต้องการ</h1>
                <Link href="/">
                    <a>
                        <img alt="Not Found" src="/images/Maple.jpg" className={styles.imageCircle} />
                    </a>
                </Link>
                <p>⬆แตะที่ภาพเพื่อกลับหน้าหลัก⬆</p>
            </div>
        )
    }

    return (
        <>
            <Header title={success ? `${anime.title_en}` : 'Content Not Found!'} />
            <div className={styles.screen}>
                <NavBar />
                <section className={styles.section}>
                    <div className={styles.container}>
                        {contentElement}
                    </div>
                </section>
                <ScrollTopButton />
            </div>
            <Footer />
        </>
    );
}

export async function getServerSideProps(context) {
    const decodeAnimeId = (animeIdCode) => {
        return Number(animeIdCode) - new Date(2002, 10, 25).getTime();
    }

    const { animeId: animeIdCode } = context.query;
    const animeId = decodeAnimeId(animeIdCode);

    let arrayAnime = [];
    let arraySeason = [];
    let arrayWaifu = [];

    try {
        arrayAnime = await db
            .select('id', 'title_jp', 'title_en', 'title_th', 'created_at', 'last_update', 'is_watching')
            .from('anime')
            .where('id', '=', +animeId);

        arraySeason = await db
            .select('id', 'title', 'sequence', 'chapter_count', 'anime_id')
            .from('season')
            .orderBy('sequence', 'asc')
            .where('anime_id', '=', +animeId);

        arrayWaifu = await db
            .select('id', 'name_eng', 'name_th', 'description', 'level', 'anime_id')
            .from('waifu')
            .where('anime_id', '=', +animeId);

    } catch (error) {
        console.error(error);
    }

    const anime = !!arrayAnime[0] ? JSON.stringify(arrayAnime[0]) : '{}';
    const seasons = arraySeason.length !== 0 ? JSON.stringify(arraySeason) : '[]';
    const waifu = !!arrayWaifu[0] ? JSON.stringify(arrayWaifu[0]) : '{}';
    const success = arrayAnime.length !== 0;

    return { props: { anime, seasons, waifu, success } };
}

export default AnimeId;