import styles from '../styles/AnimeDetail.module.css';
import { useEffect, useState, useRef } from 'react';
import Router, { useRouter } from 'next/router';
import { MdDelete, MdEdit } from 'react-icons/md';
import TextInput from './FormComponent/TextInput';
import ImageFile from './FormComponent/ImageFile';
import CheckBox from './FormComponent/CheckBox';
import Swal from 'sweetalert2';
import ImagePopup from './ImagePopup';

const convertBlobToURL = (imageBlob) => {
    const arrayBuffer = new Uint8Array(imageBlob);
    return `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
}

const AnimeDetail = (props) => {
    /* Get image after page render with server side props */
    useEffect(() => {
        const getImage = async () => {
            const res = await fetch(`/api/content/${anime.id}?target=anime`)
            const resJson = await res.json();
            const { animeImage } = resJson;
            setImageURL(convertBlobToURL(animeImage.data));
        }
        getImage();
    }, []);

    /* function delete anime */
    const deleteAnime = async () => {
        /* Wait for user confirmation */
        const confirm = await Swal.fire({
            title: `ต้องการลบ ${anime.title_en} หรือไม่?`,
            text: "การลบจะไม่สามารถกู้คืนได้",
            icon: 'warning',
            showCancelButton: true,
            focusCancel: true,
            confirmButtonColor: '#08AEA4',
            confirmButtonText: 'ยืนยัน',
            cancelButtonColor: '#EA6262',
            cancelButtonText: 'ยกเลิก',
            reverseButtons: true
        })

        /* Case confirm */
        if (confirm.isConfirmed) {
            Swal.fire({
                title: 'กรุณารอสักครู่',
                text: 'กำลังลบข้อมูล',
                icon: 'info',
                allowEscapeKey: false,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            });
            /* Call API to delete anime */
            const response = await fetch(`/api/content/anime/${anime.id}?type=delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({ anime_id: +anime.id })
            })

            /* Case success */
            if (response.status === 200) {
                Swal.fire({
                    title: 'ลบอนิเมะสำเร็จ',
                    text: 'กดปุ่มเพื่อกลับสู่หน้าหลัก',
                    icon: 'success',
                    confirmButtonColor: '#08AEA4',
                    confirmButtonText: 'ยืนยัน',
                }).then((result) => {
                    if (result.isConfirmed || result.isDismissed) router.push('/');
                })
            }
            /* Case error */
            else if (response.status === 400) {
                Swal.fire({
                    title: 'ลบไม่สำเร็จ',
                    text: 'เกิดปัญหาขึ้น กรุณาลองอีกครั้ง',
                    icon: 'error',
                    confirmButtonColor: '#08AEA4',
                    confirmButtonText: 'เข้าใจแล้ว',
                })
            }
        }
    }

    /* Anime data from props */
    const { anime, showButton } = props;

    /* Button edit and delete can show when this anime created by current user */
    let buttonZone = null;
    if (showButton) {
        buttonZone = (
            <>
                <button className={`${styles.button} ${styles.spaceRight}`} onClick={() => { setEditMode(true) }}>
                    <span className={styles.textButton}>
                        <MdEdit className={styles.iconButton} />แก้ไขข้อมูล
                    </span>
                </button>
                <button className={`${styles.button} ${styles.red}`} onClick={deleteAnime}>
                    <span className={styles.textButton}>
                        <MdDelete className={styles.iconButton} />ลบอนิเมะ
                    </span>
                </button>
            </>
        );
    }

    /* Use State for image and edit mode */
    const [imageURL, setImageURL] = useState(`/images/loading.gif`);
    const [editMode, setEditMode] = useState(false);

    /* useState for image popup */
    const [imagePopup, setImagePopup] = useState(false);

    /* Use Router */
    const router = useRouter();

    /* Variable for edit mode (useState, useRef) */
    const [elertText, setElertText] = useState("");
    const titleJpRef = useRef(null);
    const titleEnRef = useRef(null);
    const titleThRef = useRef(null);
    const imageRef = useRef(null);
    const isWatchingRef = useRef(null);

    /* For in edit mode */
    if (editMode) {

        /* Function for update anime */
        const confirm = async () => {

            /* Function convert file input to base64 */
            const toBase64 = (file) => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result.split(',').pop());
                reader.onerror = error => reject(error);
            });

            /* If user input incomplete */
            if (!titleJpRef.current.value
                || !titleEnRef.current.value
                || !titleThRef.current.value) {
                return setElertText("แจ้งเตือน : กรุณาใส่ข้อมูลให้ครบ");
            }

            /* Create object from input */
            const animeObject = {
                title_jp: titleJpRef.current.value.trim(),
                title_en: titleEnRef.current.value.trim(),
                title_th: titleThRef.current.value.trim(),
                is_watching: isWatchingRef.current.checked
            }

            /* If user upload new image */
            let imageChange = !!imageRef.current.files[0];

            /* If image changed will set image to base64 */
            if (imageChange) {
                animeObject.image = await toBase64(imageRef.current.files[0]);
            }
            else {
                animeObject.image = null;
            }

            /* Case user confirm but all data not changed */
            if (animeObject.title_jp === anime.title_jp
                && animeObject.title_en === anime.title_en
                && animeObject.title_th === anime.title_th
                && animeObject.is_watching == anime.is_watching
                && !imageChange) {
                setElertText("");
                return setEditMode(false);
            }

            /* Call API to update anime */
            const response = await fetch(`/api/content/anime/${anime.id}?type=update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(animeObject)
            })

            /* Case success */
            if (response.status === 200) {
                setElertText("");
                setEditMode(false);
                Router.reload(window.location.pathname);
            }
            /* Case error */
            else if (response.status === 400) {
                setElertText("หมายเหตุ : ไม่สามารถแก้ไขได้เนื่องจากปัญหาบางอย่าง");
            }
        }

        return (
            <>
                <TextInput title="ชื่อเรื่องภาษาญี่ปุ่น" id="title_jp" name="title_jp" ref={titleJpRef} value={anime.title_jp} />
                <TextInput title="ชื่อเรื่องภาษาอังกฤษ" id="title_en" name="title_en" ref={titleEnRef} value={anime.title_en} />
                <TextInput title="ชื่อเรื่องภาษาไทย" id="title_th" name="title_th" ref={titleThRef} value={anime.title_th} />
                <ImageFile title="รูปภาพอนิเมะ" id="anime_image" name="image" ref={imageRef} filename={`${anime.title_en}.png`} src={imageURL} />
                <CheckBox title="กำลังดูเรื่องนี้" id="is_watching" name="is_watching" ref={isWatchingRef} checked={anime.is_watching} />
                <p className={styles.elert}>{elertText}</p>
                <div className={styles.buttonZone}>
                    <button className={`${styles.button} ${styles.red} ${styles.spaceRight}`} onClick={() => { setEditMode(false) }}>ยกเลิก</button>
                    <button className={styles.button} onClick={confirm}>ยืนยัน</button>
                </div>
            </>
        );
    }

    /* For in view mode */
    return (
        <div className={styles.box}>
            <div className={styles.content}>
                <span className={styles.title}>ชื่อภาษาญี่ปุ่น : </span>
                <span>{anime.title_jp}</span>
            </div>
            <div className={styles.content}>
                <span className={styles.title}>ชื่อภาษาอังกฤษ : </span>
                <span>{anime.title_en}</span>
            </div>
            <div className={styles.content}>
                <span className={styles.title}>ชื่อภาษาไทย : </span>
                <span>{anime.title_th}</span>
            </div>
            <div className={styles.imageBox}>
                <p className={styles.title}>รูปภาพอนิเมะ : </p>
                <img className={styles.image} alt={anime.title_en} src={imageURL} onClick={() => { setImagePopup(true) }} />
            </div>
            {
                imagePopup && (
                    <ImagePopup image={imageURL} detail={anime.title_en} onBackgroundClick={() => { setImagePopup(false) }} />
                )
            }
            {buttonZone}
        </div>
    );
}

export default AnimeDetail;