import styles from '../styles/AnimeWaifu.module.css';
import { useEffect, useState, useRef } from 'react';
import Router from 'next/router'
import { MdDelete, MdEdit } from 'react-icons/md';
import Swal from 'sweetalert2';
import TextInput from './FormComponent/TextInput';
import ImageFile from './FormComponent/ImageFile';
import SelectOption from './FormComponent/SelectOption';
import TextArea from './FormComponent/TextArea';
import { IoMdPersonAdd } from 'react-icons/io';
import ImagePopup from './ImagePopup';

const convertBlobToURL = (imageBlob) => {
    const arrayBuffer = new Uint8Array(imageBlob);
    return `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
}

const AnimeWaifu = (props) => {
    /* Get image after page render with server side props */
    useEffect(() => {
        const getImage = async () => {
            const res = await fetch(`/api/content/${waifu.anime_id}?target=waifu`)
            const resJson = await res.json();
            const { waifuImage } = resJson;
            setImageURL(convertBlobToURL(waifuImage.data));
        }
        /* Must have waifu in this anime then can get image */
        if (Object.keys(waifu).length !== 0) {
            getImage();
        }
    }, []);

    /* function delete anime */
    const deleteWaifu = async () => {
        /* Wait for user confirmation */
        const confirm = await Swal.fire({
            title: `ต้องการลบ ${waifu.name_eng} หรือไม่?`,
            text: "การลบจะทำให้เธอเสียใจนะ",
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
            const confirmAgain = await Swal.fire({
                title: `ป้องกันความผิดพลาด`,
                text: "กดยืนยันอีกครั้งเพื่อลบ Waifu คนนี้",
                icon: 'warning',
                showCancelButton: true,
                focusCancel: true,
                confirmButtonColor: '#08AEA4',
                confirmButtonText: 'ยืนยัน',
                cancelButtonColor: '#EA6262',
                cancelButtonText: 'ยกเลิก',
                reverseButtons: true
            })

            if (confirmAgain.isConfirmed) {
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
                const response = await fetch(`/api/content/waifu/${waifu.id}?type=delete`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify({ anime_id: +waifu.anime_id })
                })

                /* Case success */
                if (response.status === 200) {
                    Swal.fire({
                        title: 'ลบ Waifu สำเร็จ',
                        text: 'ขอให้คนใหม่ดีกว่าเดิมนะ',
                        icon: 'success',
                        confirmButtonColor: '#08AEA4',
                        confirmButtonText: 'ยืนยัน',
                    }).then((result) => {
                        if (result.isConfirmed || result.isDismissed) {
                            Router.reload(window.location.pathname);
                        }
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
    }

    /* Waifu data from props */
    const { waifu, animeId, showButton } = props;

    /* Use State for image, create mode and edit mode */
    const [imageURL, setImageURL] = useState(`/images/loading.gif`);
    const [createMode, setCreateMode] = useState(false);
    const [editMode, setEditMode] = useState(false);

    /* useState for image popup */
    const [imagePopup, setImagePopup] = useState(false);

    /* Variable for edit mode (useState, useRef) */
    const [elertText, setElertText] = useState("");
    const nameEngRef = useRef(null);
    const nameThRef = useRef(null);
    const levelRef = useRef(null);
    const imageRef = useRef(null);
    const descriptionRef = useRef(null);

    /* Variable for create mode */
    const nameEngCreateRef = useRef(null);
    const nameThCreateRef = useRef(null);
    const levelCreateRef = useRef(null);
    const imageCreateRef = useRef(null);
    const descriptionCreateRef = useRef(null);

    /* Button edit and delete can show when this waifu created by current user */
    let buttonZone = null;
    let buttonCreate = null;
    if (showButton) {
        buttonZone = (
            <div className={styles.buttonZoneHigh}>
                <button className={`${styles.button} ${styles.spaceRight}`} onClick={() => { setEditMode(true) }}>
                    <span className={styles.textButton}>
                        <MdEdit className={styles.iconButton} />แก้ไขข้อมูล
                    </span>
                </button>
                <button className={`${styles.button} ${styles.red}`} onClick={deleteWaifu}>
                    <span className={styles.textButton}>
                        <MdDelete className={styles.iconButton} />ลบ Waifu
                    </span>
                </button>
            </div>
        );

        buttonCreate = (
            <button className={styles.button} onClick={() => { setCreateMode(true) }}>
                <span className={styles.textButton}>
                    <IoMdPersonAdd className={styles.iconButton} />ลงทะเบียน Waifu
                </span>
            </button>
        );
    }


    /* Value in level of your waifu */
    const levelValue = [
        'ไม่ชอบเลย',
        'ไม่ค่อยชอบ',
        'เฉยๆ',
        'ชอบ',
        'ชอบมาก',
        'รักเลย'
    ];

    /* For in create mode */
    if (createMode) {

        /* Function for confirm create waifu */
        const confirmCreate = async () => {

            /* Function convert file input to base64 */
            const toBase64 = (file) => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result.split(',').pop());
                reader.onerror = error => reject(error);
            });

            /* If user input incomplete */
            if (!nameEngCreateRef.current.value
                || !nameThCreateRef.current.value
                || !levelCreateRef.current.value
                || !descriptionCreateRef.current.value
                || !imageCreateRef.current.files[0]) {
                return setElertText("แจ้งเตือน : กรุณาใส่ข้อมูลให้ครบ");
            }

            /* Create object from input */
            const waifuObject = {
                name_eng: nameEngCreateRef.current.value.trim(),
                name_th: nameThCreateRef.current.value.trim(),
                level: +levelCreateRef.current.value,
                description: descriptionCreateRef.current.value.trim(),
                image: await toBase64(imageCreateRef.current.files[0]),
                anime_id: animeId,
            };

            /* Wait for user confirmation */
            const confirm = await Swal.fire({
                title: 'เธอคือที่สุดของเรื่องสินะ',
                text: "ต้องเป็น Waifu คนนี้ใช่หรือไม่",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#08AEA4',
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก',
                cancelButtonColor: '#EA6262',
                reverseButtons: true
            })

            /* Case confirm */
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

                /* Call API for create waifu */
                const response = await fetch('/api/content/waifu/new', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify(waifuObject)
                })

                /* Case success */
                if (response.status === 200) {
                    Swal.fire({
                        title: 'เพิ่ม Waifu สำเร็จ',
                        text: 'กดยืนยันเพื่อกลับสู่เนื้อหา',
                        icon: 'success',
                        confirmButtonColor: '#08AEA4',
                        confirmButtonText: 'ยืนยัน',
                    }).then((result) => {
                        if (result.isConfirmed || result.isDismissed) {
                            setElertText("");
                            setCreateMode(false);
                            Router.reload(window.location.pathname);
                        };
                    })
                }
                /* Case error */
                else {
                    Swal.fire({
                        title: 'เพิ่ม Waifu ไม่สำเร็จ',
                        text: 'เกิดปัญหาขึ้น กรุณาลองอีกครั้ง',
                        icon: 'error',
                        confirmButtonColor: '#08AEA4',
                        confirmButtonText: 'เข้าใจแล้ว',
                    })
                }
            }
        }

        return (
            <>
                <TextInput title="ชื่อภาษาอังกฤษ" id="name_eng" name="name_eng" ref={nameEngCreateRef} />
                <TextInput title="ชื่อภาษาไทย" id="name_th" name="name_th" ref={nameThCreateRef} />
                <TextArea title="เหตุผลที่ชอบ" id="description" name="description" ref={descriptionCreateRef} />
                <SelectOption title="ความอวย" id="level" name="level" optionValue={levelValue} ref={levelCreateRef} />
                <ImageFile title="รูปภาพ Waifu" id="waifu_image" name="image" ref={imageCreateRef} />
                <p className={styles.elert}>{elertText}</p>
                <div className={styles.buttonZone}>
                    <button className={`${styles.button} ${styles.red} ${styles.spaceRight}`} onClick={() => { setCreateMode(false) }}>ยกเลิก</button>
                    <button className={styles.button} onClick={confirmCreate}>ยืนยัน</button>
                </div>
            </>
        );
    }

    /* Case not have waifu return here */
    if (Object.keys(waifu).length === 0 && !createMode) {
        return (
            <>
                <p className={`${styles.title} ${styles.spaceBottom}`}>{`ยังไม่มีข้อมูล`}</p>
                {buttonCreate}
            </>
        );
    }

    /* For in edit mode */
    if (editMode) {

        /* Function for confirm update waifu */
        const confirm = async () => {

            /* Function convert file input to base64 */
            const toBase64 = (file) => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result.split(',').pop());
                reader.onerror = error => reject(error);
            });

            /* If user input incomplete */
            if (!nameEngRef.current.value
                || !nameThRef.current.value
                || !levelRef.current.value
                || !descriptionRef.current.value) {
                return setElertText("แจ้งเตือน : กรุณาใส่ข้อมูลให้ครบ");
            }

            /* Create object from input */
            const waifuObject = {
                name_eng: nameEngRef.current.value.trim(),
                name_th: nameThRef.current.value.trim(),
                level: +levelRef.current.value,
                description: descriptionRef.current.value.trim(),
                anime_id: waifu.anime_id,
            };

            /* If user upload new image */
            let imageChange = !!imageRef.current.files[0];

            /* If image changed will set image to base64 */
            if (imageChange) {
                waifuObject.image = await toBase64(imageRef.current.files[0]);
            }
            else {
                waifuObject.image = null;
            }

            /* Case user confirm but all data not changed */
            if (waifuObject.name_eng === waifu.name_eng
                && waifuObject.name_th === waifu.name_th
                && waifuObject.level === waifu.level
                && waifuObject.description === waifu.description
                && !imageChange) {
                setElertText("");
                return setEditMode(false);
            }

            /* Call API to update waifu */
            const response = await fetch(`/api/content/waifu/${waifu.id}?type=update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(waifuObject)
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
                <TextInput title="ชื่อภาษาอังกฤษ" id="name_eng" name="name_eng" ref={nameEngRef} value={waifu.name_eng} />
                <TextInput title="ชื่อภาษาไทย" id="name_th" name="name_th" ref={nameThRef} value={waifu.name_th} />
                <SelectOption title="ความอวย" id="level" name="level" optionValue={levelValue} defaultValue={waifu.level} ref={levelRef} />
                <ImageFile title="รูปภาพ Waifu" id="waifu_image" name="image" ref={imageRef} filename={`${waifu.name_eng}.png`} src={imageURL} />
                <TextArea title="เหตุผลที่ชอบ" id="description" name="description" value={waifu.description} ref={descriptionRef} />
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
                <span className={styles.title}>ชื่อภาษาอังกฤษ : </span>
                <span>{waifu.name_eng}</span>
            </div>
            <div className={styles.content}>
                <span className={styles.title}>ชื่อภาษาไทย : </span>
                <span>{waifu.name_th}</span>
            </div>
            <div className={styles.content}>
                <span className={styles.title}>ระดับความอวย : </span>
                <span>{`${levelValue[waifu.level]} (${waifu.level} / 5)`}</span>
            </div>
            <div className={styles.imageBox}>
                <p className={styles.title}>รูปภาพ Waifu : </p>
                <img className={styles.image} alt={waifu.name_eng} src={imageURL} onClick={() => { setImagePopup(true) }} />
            </div>
            <div className={styles.content}>
                <p className={styles.title}>รายละเอียด : </p>
                <p className={styles.description}>{waifu.description}</p>
            </div>
            {
                imagePopup && (
                    <ImagePopup image={imageURL} detail={waifu.name_eng} onBackgroundClick={() => { setImagePopup(false) }} />
                )
            }
            {buttonZone}
        </div>
    )
}

export default AnimeWaifu;