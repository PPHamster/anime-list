import { useState } from 'react';
import Link from 'next/link';
import db from '../db';
import CheckBox from '../components/content/FormComponent/CheckBox';
import SelectOption from '../components/content/FormComponent/SelectOption';
import Footer from '../components/Footer';
import Header from '../components/Header';
import AnimeBox from '../components/home/AnimeBox';
import SearchText from '../components/home/SearchText';
import NavBar from '../components/NavBar';
import styles from '../styles/basic.module.css';
import ScrollTopButton from '../components/ScrollTopButton';

const UserPage = (props) => {
    const { user, allAnimeJson } = props;
    const allAnime = JSON.parse(allAnimeJson);

    /* Set Use State Variable */
    const [searchText, setSearchText] = useState('');
    const [titleNow, setTitleNow] = useState(0);
    const [watchingFilter, setWatchingFilter] = useState(false);
    const [sortLatest, setSortLatest] = useState(false);

    /* Option in title select */
    const optionTitle = [
        'ภาษาญี่ปุ่น',
        'ภาษาอังกฤษ',
        'ภาษาไทย',
    ];

    /* Anime that show in screen */
    const animeElement = allAnime.filter((anime) => {
        /* Anime in search text */
        const animeInSearchText = anime.title_jp.toLowerCase().includes(searchText.toLowerCase())
            || anime.title_en.toLowerCase().includes(searchText.toLowerCase())
            || anime.title_th.toLowerCase().includes(searchText.toLowerCase());
        if (watchingFilter) {
            return animeInSearchText && anime.is_watching;
        }
        return animeInSearchText;
    }).sort((anime2, anime1) => {
        /* Sort by created latest date */
        if (sortLatest) {
            return new Date(anime1.created_at) - new Date(anime2.created_at);
        }
        return new Date(anime2.created_at) - new Date(anime1.created_at);
    }).map((anime) => {
        /* Convert anime into AnimeBox */
        return <AnimeBox key={anime.id} anime={anime} titleNow={titleNow} />;
    });

    /* Change when found user or not */
    let contentElement = null;
    if (!!user) {
        contentElement = (
            <>
                <div className={styles.userDetailZone}>
                    <img alt="Profile" referrerPolicy="no-referrer" src={user.image} className={styles.profileImage} />
                    <p className={styles.profileName}>{user.name}</p>
                </div>
                <div className={styles.settingBox}>
                    <SelectOption title="ชื่อเรื่อง" id="title" name="title" optionValue={optionTitle} onValueChange={setTitleNow} defaultValue={titleNow} />
                    <CheckBox title="เรียงจากวันที่ลงล่าสุด" id="sortdate" name="sortdate" onCheckedChange={setSortLatest} small={true} />
                    <CheckBox title="อนิเมะที่กำลังดู" id="watching" name="watching" onCheckedChange={setWatchingFilter} small={true} />
                </div>
                <SearchText value={searchText} onValueChange={setSearchText} />
                {animeElement}
            </>
        );
    }
    else {
        contentElement = (
            <div className={styles.textCenter}>
                <h1>ไม่พบผู้ใช้นี้</h1>
                <Link href="/">
                    <a>
                        <img alt="Not Found" src="/images/Maple.jpg" className={styles.imageCircle} />
                    </a>
                </Link>
                <p>⬆แตะที่ภาพเพื่อกลับหน้าหลัก⬆</p>
            </div>
        );
    }

    return (
        <>
            <Header title={!!user ? `${user.name}` : 'User Not Found!'} />
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

    const { user: userId } = context.query;

    let users = [];
    let user = null;
    let allAnime = [];

    try {
        users = await db
            .select('*')
            .from('users')
            .where('id', '=', userId)
            .orWhereRaw(`email LIKE '${userId}@%'`);

        if (users.length > 0) {
            user = users[0];
            allAnime = await db
                .select('a.id', 'a.title_jp', 'a.title_en', 'a.title_th', 'a.created_at',
                    'a.last_update', 'a.is_watching')
                .count('s.anime_id AS season_count')
                .sum('s.chapter_count AS all_chapter')
                .from('anime AS a')
                .leftJoin('season AS s', 'a.id', 's.anime_id')
                .where('a.user_id', '=', user.id)
                .groupBy('a.id')
                .orderBy('a.id', 'asc');
        }

    } catch (error) {
        console.error(error);
    }

    const allAnimeJson = JSON.stringify(allAnime);
    return { props: { user, allAnimeJson } };
}

export default UserPage;