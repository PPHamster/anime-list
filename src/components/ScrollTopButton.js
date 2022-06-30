import styles from './styles/ScrollTopButton.module.css';
import { FaArrowAltCircleUp } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const ScrollTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return (
        <span className={`${styles.scrollTopButton} ${isVisible ? styles.visible : ''}`} onClick={scrollToTop}>
            <FaArrowAltCircleUp className={styles.icon} />
        </span>
    );
}

export default ScrollTopButton;