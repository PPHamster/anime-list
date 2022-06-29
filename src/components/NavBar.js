import Link from 'next/link'
import styles from './styles/NavBar.module.css';

const NavBar = () => {
    return (
        <header className={styles.navBar}>
            <div className={styles.navBarItem}>
                <Link href="/">
                    <a className={styles.navBarLogo}>
                        <img
                            className={styles.navBarImage}
                            src="/images/Tanya-logo.png"
                            alt="Logo"
                        />
                        <span className={styles.navBarText}>Anime List</span>
                    </a>
                </Link>
            </div>
            <div className={styles.navBarItem}>
                <Link href="/content/new">
                    <a className={`${styles.button} ${styles.buttonOutlined}`}>เพิ่มเรื่องใหม่</a>
                </Link>
            </div>
        </header>
    );
}

export default NavBar;