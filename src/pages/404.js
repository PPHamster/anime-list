import Header from '../components/Header';
import NavBar from '../components/NavBar';
import Link from 'next/link';
import styles from '../styles/basic.module.css';
import Footer from '../components/Footer';

const NotFound = () => {
    return (
        <>
            <Header title="Not Found" />
            <div className={styles.screen}>
                <NavBar />
                <section className={styles.section} >
                    <div className={styles.container}>
                        <div className={styles.textCenter}>
                            <h1>404</h1>
                            <h2>Page not found !</h2>
                            <h4>ไม่เจอหน้านี้นะค้าาา</h4>
                            <Link href="/">
                                <a>
                                    <img alt="Not Found" src="/images/Maple.jpg" className={styles.imageCircle} />
                                </a>
                            </Link>
                            <p>⬆แตะที่ภาพเพื่อกลับหน้าหลัก⬆</p>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}

export default NotFound;