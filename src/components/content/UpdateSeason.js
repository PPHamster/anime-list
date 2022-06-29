import { useEffect, useRef, useState } from 'react';
import Router from 'next/router'
import styles from '../styles/UpdateSeason.module.css';
import NumberInput from './FormComponent/NumberInput';
import TextInput from './FormComponent/TextInput';

const UpdateSeason = (props) => {

    /* Function confirm update season */
    const confirm = async () => {
        /* Create object of season for update season */
        const seasonObject = {
            title: titleRef.current.value.trim(),
            sequence: +sequenceRef.current.value,
            chapter_count: +chapterCountRef.current.value,
            anime_id: +season.anime_id
        }

        /* Case user incomplete input */
        if (!seasonObject.title || !seasonObject.sequence || !seasonObject.chapter_count) {
            return setElertText("แจ้งเตือน : กรุณาใส่ข้อมูลให้ครบ");
        }

        /* Case user confirm but all data not changed */
        if (seasonObject.title === season.title
            && seasonObject.sequence === season.sequence
            && seasonObject.chapter_count === season.chapter_count) {
            setElertText("");
            return setUpdatePopup(null);
        }

        /* Call API for update season */
        const response = await fetch(`/api/content/season/${season.id}?type=update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(seasonObject)
        })

        /* Case update season success */
        if (response.status === 200) {
            setElertText("");
            setUpdatePopup(null);
            Router.reload(window.location.pathname);
        }
        /* Case update season fail */
        else if (response.status === 400) {
            setElertText("หมายเหตุ : ไม่สามารถแก้ไขได้เนื่องจากปัญหาบางอย่าง");
        }
    }

    /* When update season popup showed then lock scrollbar */
    useEffect(() => {
        document.documentElement.style.overflowY = 'hidden';
        return () => {
            document.documentElement.style.overflowY = 'auto';
        }
    }, [])

    /* Get season and function close popup from props */
    const { season, setUpdatePopup } = props;

    /* Set useState and useRef for popup */
    const [elertText, setElertText] = useState("");
    const titleRef = useRef(null);
    const sequenceRef = useRef(null);
    const chapterCountRef = useRef(null);
    
    return (
        <div className={styles.popup}>
            <div className={styles.popupBackground} />
            <div className={styles.popupContent}>
                <div className={styles.seasonBox}>
                    <TextInput title="ชื่อ Season" id={`season_title`} name="title" ref={titleRef} value={season.title} />
                    <NumberInput title="ลำดับ Season" id={`season_sequence`} name="sequence" ref={sequenceRef} value={season.sequence} />
                    <NumberInput title="จำนวนตอน ⠀" id={`chapter_count`} name="chapter_count" ref={chapterCountRef} value={season.chapter_count} />
                </div>
                <p className={styles.elert}>{elertText}</p>
                <div className={styles.buttonZone}>
                    <button className={`${styles.button} ${styles.red}`} onClick={() => { setUpdatePopup(null) }}>ยกเลิก</button>
                    <button className={styles.button} onClick={confirm}>ยืนยัน</button>
                </div>
            </div>
        </div>
    );
}

export default UpdateSeason;