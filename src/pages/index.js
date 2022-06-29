import { useState } from 'react';
import db from '../db';
import CheckBox from '../components/content/FormComponent/CheckBox';
import SelectOption from '../components/content/FormComponent/SelectOption';
import Footer from '../components/Footer';
import Header from '../components/Header';
import AnimeBox from '../components/home/AnimeBox';
import SearchText from '../components/home/SearchText';
import NavBar from '../components/NavBar';
import styles from '../styles/basic.module.css';

const index = (props) => {

    /* Set Use State Variable */
    const [searchText, setSearchText] = useState('');
    const [titleNow, setTitleNow] = useState(0);
    const [watchingFilter, setWatchingFilter] = useState(false);

    /* Option in title select */
    const optionTitle = [
        'ภาษาญี่ปุ่น',
        'ภาษาอังกฤษ',
        'ภาษาไทย',
    ];

    /* All anime in props */
    const { allAnimeJson } = props;
    const allAnime = JSON.parse(allAnimeJson);

    /* Anime in search */
    const animeElement = allAnime.filter((anime) => {
        const animeInSearchText = anime.title_jp.toLowerCase().includes(searchText.toLowerCase())
            || anime.title_en.toLowerCase().includes(searchText.toLowerCase())
            || anime.title_th.toLowerCase().includes(searchText.toLowerCase());
        if (watchingFilter) {
            return animeInSearchText && anime.is_watching;
        }
        return animeInSearchText;
    }).map((anime) => {
        return <AnimeBox key={anime.id} anime={anime} titleNow={titleNow} />;
    });

    return (
        <>
            <Header title="Home Page" />
            <div className={styles.screen}>
                <NavBar />
                <section className={styles.section}>
                    <div className={styles.container}>
                        <div className={styles.settingBox}>
                            <SelectOption title="ชื่อเรื่อง" id="title" name="title" optionValue={optionTitle} onValueChange={setTitleNow} defaultValue={titleNow} />
                            <CheckBox title="กำลังดู" id="watching" name="watching" onCheckedChange={setWatchingFilter} small={true} />
                        </div>
                        <SearchText value={searchText} onValueChange={setSearchText} />
                        {animeElement}
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}

export async function getServerSideProps() {
    let allAnime = [];
    try {

        allAnime = await db
            .select('a.id', 'a.title_jp', 'a.title_en', 'a.title_th', 'a.created_at',
                'a.last_update', 'a.is_watching')
            .count('s.anime_id AS season_count')
            .sum('s.chapter_count AS all_chapter')
            .from('anime AS a')
            .leftJoin('season AS s', 'a.id', 's.anime_id')
            .groupBy('a.id')
            .orderBy('a.id', 'asc');
            
    } catch (error) {
        console.error(error);
    }
    const allAnimeJson = JSON.stringify(allAnime);

    return { props: { allAnimeJson } };
}

export default index;