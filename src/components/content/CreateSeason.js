import { useEffect, useRef, useState } from 'react';
import Router from 'next/router'
import styles from '../styles/CreateSeason.module.css';
import NumberInput from './FormComponent/NumberInput';
import TextInput from './FormComponent/TextInput';

const CreateSeason = (props) => {

    /* Function confirm create new season */
    const confirm = async () => {

        /* Create object of season for create new season */
        const seasonObject = {
            title: titleRef.current.value.trim(),
            sequence: +sequenceRef.current.value,
            chapter_count: +chapterCountRef.current.value,
            anime_id: +animeId
        }

        /* Case user incomplete input */
        if (!seasonObject.title || !seasonObject.sequence || !seasonObject.chapter_count) {
            return setElertText("แจ้งเตือน : กรุณาใส่ข้อมูลให้ครบ");
        }

        /* Call API for create new season */
        const response = await fetch('/api/content/season/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(seasonObject)
        })

        /* Case create new season success */
        if (response.status === 200) {
            setElertText("");
            setCreatePopup(false);
            Router.reload(window.location.pathname);
        }
        /* Case create new season fail */
        else if (response.status === 400) {
            setElertText("หมายเหตุ : ไม่สามารถเพิ่มได้เนื่องจากปัญหาบางอย่าง");
        }
    }

    /* When create season popup showed then lock scrollbar */
    useEffect(() => {
        document.documentElement.style.overflowY = 'hidden';
        return () => {
            document.documentElement.style.overflowY = 'auto';
        }
    }, [])

    /* Get anime id, function close popup and last sequence from props */
    const { animeId, setCreatePopup, lastSequence } = props;

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
                    <TextInput title="ชื่อ Season" id={`season_title`} name="title" ref={titleRef} />
                    <NumberInput title="ลำดับ Season" id={`season_sequence`} name="sequence" ref={sequenceRef} value={lastSequence + 1} />
                    <NumberInput title="จำนวนตอน ⠀" id={`chapter_count`} name="chapter_count" ref={chapterCountRef} />
                </div>
                <p className={styles.elert}>{elertText}</p>
                <div className={styles.buttonZone}>
                    <button className={`${styles.button} ${styles.red}`} onClick={() => { setCreatePopup(false) }}>ยกเลิก</button>
                    <button className={styles.button} onClick={confirm}>ยืนยัน</button>
                </div>
            </div>
        </div>
    );
}

export default CreateSeason;