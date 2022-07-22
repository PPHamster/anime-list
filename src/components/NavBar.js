import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'
import { auth, signInWithGoogle } from '../services/firebase';
import Swal from 'sweetalert2';
import styles from './styles/NavBar.module.css';
import SearchUser from './users/SearchUser';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { BiSearchAlt2 } from 'react-icons/bi';

const NavBar = () => {
    /* Set useState */
    const [user, setUser] = useState(null);
    const [userText, setUserText] = useState('');
    const [profileClick, setProfileClick] = useState(false);
    const [mobileMode, setMobileMode] = useState(false);
    const [searchUser, setSearchUser] = useState(false);
    const [mobileSearch, setMobileSearch] = useState(false);
    const [userList, setUserList] = useState([]);   

    /* Set useRouter */
    const router = useRouter();

    /* Responsive */
    const setResponsive = () => {
        if (window.innerWidth < 700) {
            setMobileMode(true);
        }
        else {
            setMobileMode(false);
        }
    }

    /* Dropdown profile menu */
    const dropdown = (event) => {
        if (auth.currentUser) {
            if (event.target.classList.contains(styles.navBarProfile)) {
                setProfileClick(!profileClick);
            }
            else {
                setProfileClick(false);
            }
        }
    }

    /* When searchUserText out of focus */
    const userListShow = (event) => {
        if(event.target.id === 'searchUserInput') {
            setSearchUser(true);
        }
        else if(event.target.id === 'iconSearch') {
            setMobileSearch(true);
            setSearchUser(true);
        }
        else if(!event.target.classList.contains(styles.userList)) {
            setMobileSearch(false);
            setSearchUser(false);
        }
    }

    /* Sign out function */
    const signOut = async () => {
        const confirm = await Swal.fire({
            title: 'ออกจากระบบ',
            text: "ต้องการออกจากระบบใช่หรือไม่",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#08AEA4',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก',
            cancelButtonColor: '#EA6262',
            reverseButtons: true
        })

        if (confirm.isConfirmed) {
            auth.signOut();
        }
    }

    /* User list show when search user text focus */
    const userListElement = (
        <div className={`${styles.userList} ${searchUser ? styles.show : ''}`}>
            {
                userList.filter((user) => {
                    return user.name.toLowerCase().includes(userText.toLowerCase());
                }).map((user) => {
                    const username = user.email.split('@')[0];
                    return (
                        <Link href={`/${username}`} key={user.id}>
                            <a className={styles.userListItem}>
                                <img alt="User Profile" referrerPolicy="no-referrer" src={user.image} className={styles.userListImage} />
                                <span>{user.name}</span>
                            </a>
                        </Link>
                    );
                })
            }
        </div>
    );

    /* Logo hide when search user */
    let logoNavBar = null;

    /* Navigation bar item can change when user logged in */
    let navBarItem = null;

    /* Search User */
    let searchUserElement = null;

    if (searchUser || mobileSearch) {
        logoNavBar = (
            <AiOutlineArrowLeft className={styles.iconCircle} />
        );
    }
    else {
        logoNavBar = (
            <Link href="/">
                <a className={styles.navBarLogo}>
                    {!mobileMode && (
                        <img
                            className={styles.navBarImage}
                            src="/images/Tanya-logo.png"
                            alt="Logo"
                        />
                    )}
                    <img
                        className={styles.navBarImage}
                        src="/images/PP-Anilist-Logo.png"
                        alt="Logo"
                    />
                </a>
            </Link>
        );
    }

    if (!!user) {
        navBarItem = (
            <>
                {/* Have button add new anime when pc screen */}
                {mobileMode || router.route === '/content/new' ? null : (
                    <Link href="/content/new">
                        <a className={`${styles.button} ${mobileMode ? '' : styles.buttonOutlined}`}>
                            เพิ่มเรื่องใหม่
                        </a>
                    </Link>
                )}
                {/* Search users icon instead of add anime button */}
                {mobileMode && (
                    <BiSearchAlt2 className={styles.iconCircleMobile} id="iconSearch" />
                )}
                {/* profile menu */}
                <a className={styles.navBarLogo}>
                    <img
                        referrerPolicy="no-referrer"
                        className={styles.navBarProfile}
                        src={user.photoURL}
                        alt="profile"
                    />
                </a>
                {/* Dropdown profile menu */}
                <div className={`${styles.dropdownMenu} ${profileClick ? styles.show : ''}`}>
                    {mobileMode && router.route !== '/content/new' && (
                        <Link href="/content/new">
                            <a className={styles.item}>
                                <div>เพิ่มเรื่องใหม่</div>
                            </a>
                        </Link>
                    )}
                    <div className={styles.item} onClick={signOut}>ออกจากระบบ</div>
                </div>
            </>
        )
    }
    else {
        navBarItem = (
            <>
                {mobileMode && (
                    <BiSearchAlt2 className={styles.iconCircleMobile} id="iconSearch" />
                )}
                <a className={`${styles.button} ${styles.spaceLeft} ${mobileMode ? '' : styles.buttonOutlined}`} onClick={signInWithGoogle}>
                    เข้าสู่ระบบ
                </a>
            </>
        )
    }

    if (!mobileMode || mobileSearch) {
        searchUserElement = (
            <SearchUser value={userText} onValueChange={setUserText} mobileSearch={mobileSearch} />
        );
    }

    useEffect(() => {
        /* Get all user from database */
        const getUser = async () => {
            const response = await fetch('/api/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                }
            });

            const allUser = await response.json();

            if (response.status === 200) {
                setUserList(allUser);
            }
            else {
                setUserList([]);
            }
        }

        getUser();
        setResponsive();
        window.addEventListener('resize', setResponsive);
        document.addEventListener('mouseup', dropdown);
        document.addEventListener('mouseup', userListShow);
        auth.onAuthStateChanged((user) => {
            setUser(user);
        });
    }, []);
    
    /* Navigation bar default */
    return (
        <header className={styles.navBar}>
            <div className={`${styles.navBarItem} ${mobileSearch && mobileMode ? styles.navBarItemMobile : ''}`}>
                {logoNavBar}
                {searchUserElement}
                {userListElement}
            </div>
            {!mobileSearch && (
                <div className={styles.navBarItem}>
                    {navBarItem}
                </div>
            )}
        </header>
    );
}

export default NavBar;