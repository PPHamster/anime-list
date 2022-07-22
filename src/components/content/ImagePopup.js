import styles from '../styles/ImagePopup.module.css';
import { useEffect } from 'react';

const ImagePopup = (props) => {
    const { image, detail, onBackgroundClick } = props;

    /* When image popup showed then lock scrollbar */
    useEffect(() => {
        document.documentElement.style.overflowY = 'hidden';
        return () => {
            document.documentElement.style.overflowY = 'auto';
        }
    }, [])

    return (
        <div className={styles.imagePopup}>
            <div className={styles.popupBackground} onClick={onBackgroundClick} />
            <div className={styles.popupContent}>
                <img src={image} alt={detail} />
                <h3>{detail}</h3>
            </div>
        </div>
    );
}

export default ImagePopup;