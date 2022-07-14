import { useState, useRef } from 'react';
import { IoMdAddCircle } from 'react-icons/io'
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import NavBar from '../../components/NavBar';
import styles from '../../styles/basic.module.css';
import AnimeForm from '../../components/content/AnimeForm';
import SeasonForm from '../../components/content/SeasonForm';
import WaifuForm from '../../components/content/WaifuForm';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';

const NewPage = () => {

    /* Set useRouter for change page */
    const router = useRouter();

    /* Set useState for all season in anime */
    const [allSeasonRef, setAllSeasonRef] = useState([]);

    /* Function when user confirm to submit */
    const onSubmitButtonClick = async () => {

        /* Case user incomplete all input */
        const alertInfo = () => {
            return Swal.fire({
                title: 'แจ้งเตือน',
                text: 'ยังใส่ข้อมูลไม่ครบ',
                icon: 'info',
                confirmButtonColor: '#08AEA4',
                confirmButtonText: 'เข้าใจแล้ว'
            });
        }

        /* Function convert file input into base64 */
        const toBase64 = (file) => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',').pop());
            reader.onerror = error => reject(error);
        });


        /* Validate Title Anime Part */
        const { title_jp, title_en, title_th, image: animeImage, is_watching } = objectAnimeRef;
        if (!title_jp.current.value || !title_en.current.value || !title_th.current.value || !animeImage.current.files[0]) {
            return alertInfo();
        }

        /* Validate Season Part */
        const { title, sequence, chapter_count } = objectSeasonRef;
        for (let i = 0; i < title.current.length; i++) {
            if (!title.current[i].value || !sequence.current[i].value || !chapter_count.current[i].value) {
                return alertInfo();
            }
        }

        /* Create array of object season */
        const seasonList = title.current.map((title, index) => {
            return {
                title: title.value.trim(),
                sequence: +sequence.current[index].value,
                chapter_count: +chapter_count.current[index].value
            }
        })

        let waifuObject = {};

        /* Validate Waifu Part */
        const { have_waifu, name_eng, name_th, description, level, image: waifuImage } = objectWaifuRef;
        if (have_waifu.current.checked) {
            if (!name_eng.current.value || !name_th.current.value || !description.current.value || !level.current.value || !waifuImage.current.files[0]) {
                return alertInfo();
            }

            waifuObject = {
                name_eng: name_eng.current.value.trim(),
                name_th: name_th.current.value.trim(),
                description: description.current.value.trim(),
                level: +level.current.value,
                image: await toBase64(waifuImage.current.files[0])
            }
        }

        const data = {
            anime: {
                title_jp: title_jp.current.value.trim(),
                title_en: title_en.current.value.trim(),
                title_th: title_th.current.value.trim(),
                image: await toBase64(animeImage.current.files[0]),
                is_watching: is_watching.current.checked
            },
            season: seasonList,
            waifu: waifuObject,
        }

        const confirm = await Swal.fire({
            title: 'ต้องการบันทึกข้อมูลหรือไม่',
            text: "กรุณาตรวจสอบข้อมูลให้ถูกต้อง",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#08AEA4',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก',
            cancelButtonColor: '#EA6262',
            reverseButtons: true
        })

        if (confirm.isConfirmed) {
            Swal.fire({
                title: 'กรุณารอสักครู่',
                text: 'กำลังทำการบันทึกข้อมูล',
                icon: 'info',
                allowEscapeKey: false,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            });

            const response = await fetch('/api/content/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(data)
            })

            if (response.status === 200) {
                Swal.fire({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    text: 'กดปุ่มเพื่อกลับสู่หน้าหลัก',
                    icon: 'success',
                    confirmButtonColor: '#08AEA4',
                    confirmButtonText: 'ยืนยัน',
                }).then((result) => {
                    if (result.isConfirmed || result.isDismissed) router.push('/');
                })
            }
            else {
                Swal.fire({
                    title: 'บันทึกข้อมูลไม่สำเร็จ',
                    text: 'เกิดปัญหาขึ้น กรุณาลองอีกครั้ง',
                    icon: 'error',
                    confirmButtonColor: '#08AEA4',
                    confirmButtonText: 'เข้าใจแล้ว',
                })
            }
        }
    }

    const objectAnimeRef = {
        title_jp: useRef(null),
        title_en: useRef(null),
        title_th: useRef(null),
        image: useRef(null),
        is_watching: useRef(null)
    };

    const objectSeasonRef = {
        title: useRef([]),
        sequence: useRef([]),
        chapter_count: useRef([])
    };

    const objectWaifuRef = {
        have_waifu: useRef(null),
        name_eng: useRef(null),
        name_th: useRef(null),
        description: useRef(null),
        level: useRef(null),
        image: useRef(null)
    }

    const newSeasonCreate = () => {
        setAllSeasonRef((prevAllSeasonRef) => {
            return [...prevAllSeasonRef, { id: Date.now().toString() }];
        });
    }

    const seasonElement = allSeasonRef.map((seasonRef) => {
        return <SeasonForm key={seasonRef.id} id={seasonRef.id} objectRef={objectSeasonRef} setAllSeasonRef={setAllSeasonRef} />;
    });

    return (
        <>
            <Header title="New Content" />
            <div className={styles.screen}>
                <NavBar />
                <section className={styles.section}>
                    <div className={styles.container}>
                        <h2 className={styles.title}>เพิ่มอนิเมะเรื่องใหม่</h2>
                        <AnimeForm objectRef={objectAnimeRef} />
                        <hr className={styles.line} />
                        <h2 className={styles.title}>เพิ่ม Season และจำนวนตอน</h2>
                        {seasonElement}
                        <button onClick={newSeasonCreate} className={styles.button}>
                            <span className={styles.textButton}>
                                <IoMdAddCircle className={styles.iconButton} />เพิ่ม Season
                            </span>
                        </button>
                        <hr className={styles.line} />
                        <h2 className={styles.title}>เพิ่ม Waifu</h2>
                        <WaifuForm objectRef={objectWaifuRef} />
                        <button className={`${styles.button} ${styles.longButton}`} onClick={onSubmitButtonClick}>ยืนยัน</button>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}

export default NewPage;