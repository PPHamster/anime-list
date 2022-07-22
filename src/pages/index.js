import { useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import CheckBox from '../components/content/FormComponent/CheckBox';
import SelectOption from '../components/content/FormComponent/SelectOption';
import Footer from '../components/Footer';
import Header from '../components/Header';
import AnimeBox from '../components/home/AnimeBox';
import SearchText from '../components/home/SearchText';
import NavBar from '../components/NavBar';
import styles from '../styles/basic.module.css';
import ScrollTopButton from '../components/ScrollTopButton';

const IndexPage = () => {

    /* Set Use State Variable */
    const [searchText, setSearchText] = useState('');
    const [titleNow, setTitleNow] = useState(0);
    const [watchingFilter, setWatchingFilter] = useState(false);
    const [sortLatest, setSortLatest] = useState(false);
    const [user, setUser] = useState(null);
    const [allAnime, setAllAnime] = useState([]);
    const [loading, setLoading] = useState(true);

    /* Option in title select */
    const optionTitle = [
        'ภาษาญี่ปุ่น',
        'ภาษาอังกฤษ',
        'ภาษาไทย',
    ];

    /* Content that show in screen */
    let animeElement = null;

    /* Check if user is not login */
    if (!loading && !user) {
        animeElement = <h3 className={styles.loginFirst}>เข้าสู่ระบบเพื่อบันทึกอนิเมะ</h3>
    }
    /* If user Logged in */
    else if (!loading && user) {
        animeElement = allAnime.filter((anime) => {
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
    }

    useEffect(() => {
        /* Get all anime from database */
        const getAnimeFromUserId = async (userId) => {
            const response = await fetch('/api/home', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({ userId })
            });

            const allAnime = await response.json();

            if(response.status === 200) {
                setAllAnime(allAnime);    
            }
            else  {
                setAllAnime([]);
            }
            setLoading(false);
        }

        /* When user login or logout */
        auth.onAuthStateChanged((user) => {
            setUser(user);
            if (user) {
                setLoading(true);
                getAnimeFromUserId(user.uid);
            }
            else {
                setLoading(false);
            }
        });
    }, []);

    return (
        <>
            <Header title="Home Page" />
            <div className={styles.screen}>
                <NavBar />
                <section className={styles.section}>
                    <div className={styles.container}>
                        <div className={styles.settingBox}>
                            <SelectOption title="ชื่อเรื่อง" id="title" name="title" optionValue={optionTitle} onValueChange={setTitleNow} defaultValue={titleNow} />
                            <CheckBox title="เรียงจากวันที่ลงล่าสุด" id="sortdate" name="sortdate" onCheckedChange={setSortLatest} small={true} />
                            <CheckBox title="อนิเมะที่กำลังดู" id="watching" name="watching" onCheckedChange={setWatchingFilter} small={true} />
                        </div>
                        <SearchText value={searchText} onValueChange={setSearchText} />
                        {animeElement}
                    </div>
                </section>
                <ScrollTopButton />
            </div>
            <Footer />
        </>
    );
}

export default IndexPage;