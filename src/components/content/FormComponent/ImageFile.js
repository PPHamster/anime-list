import React, { useEffect, useRef } from 'react';
import styles from '../../styles/ImageFile.module.css';
import { BsFillImageFill } from 'react-icons/bs'

const onFileChange = (fileInput, imageRef, filenameRef) => {
    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imageRef.current.src = e.target.result;
            // filenameRef.current.innerHTML = fileInput.value.match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1];
            filenameRef.current.innerHTML = fileInput.value.split('\\').pop();
        }

        reader.readAsDataURL(fileInput.files[0]);

    }
}

const ImageFile = React.forwardRef((props, ref) => {
    const imageRef = useRef(null);
    const filenameRef = useRef(null);
    const { title, id, name, src, filename } = props

    useEffect(() => {
        if (!!src) {
            imageRef.current.src = src;
            filenameRef.current.innerHTML = filename;
        }
    }, [])

    return (
        <div className={styles.box}>
            <label htmlFor={id} className={styles.label}>{title} : </label>
            <div className={styles.imageBox}>

            </div>
            <img
                ref={imageRef}
                className={styles.image}
            />
            <input
                type="file"
                id={id}
                name={name}
                accept="image/*"
                hidden={true}
                className={styles.file}
                ref={ref}
                onChange={(event) => onFileChange(event.target, imageRef, filenameRef)}
            />
            <label htmlFor={id} type="button" className={styles.button}>
                <span className={styles.textButton}>
                    <BsFillImageFill className={styles.iconButton} />เลือกรูปภาพ
                </span>
            </label>
            <span className={styles.filename} ref={filenameRef}>ยังไม่มีไฟล์ที่ถูกเลือก</span>
        </div>
    );
});

export default ImageFile;