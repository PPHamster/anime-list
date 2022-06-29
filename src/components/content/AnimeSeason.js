import styles from '../styles/AnimeSeason.module.css';
import Swal from 'sweetalert2';
import Router from 'next/router'
import { MdDelete, MdEdit } from 'react-icons/md';

const AnimeSeason = (props) => {
    /* Get data each season and function close popup */
    const { season, setUpdatePopup } = props;

    /* Function delete season */
    const deleteSeason = async () => {

        /* Wait for user confirmation */
        const confirm = await Swal.fire({
            title: `ต้องการลบ ${season.title} หรือไม่?`,
            text: "การลบจะไม่สามารถกู้คืนได้",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#08AEA4',
            confirmButtonText: 'ยืนยัน',
            cancelButtonColor: '#EA6262',
            cancelButtonText: 'ยกเลิก',
            reverseButtons: true
        })

        /* If user confirmed */
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

            /* Call API for delete season */
            const response = await fetch(`/api/content/season/${season.id}?type=delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({ anime_id: +season.anime_id })
            })

            /* If API return success */
            if (response.status === 200) {
                Router.reload(window.location.pathname);
            }
            /* If API return error */
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

    return (
        <div className={styles.box}>
            <div className={styles.rightBox}>
                <span className={styles.rightItem} onClick={deleteSeason}><MdDelete /></span>
                <span className={styles.rightItem} onClick={() => { setUpdatePopup(season) }}><MdEdit /></span>
            </div>
            <p className={styles.row}>
                <span className={styles.title}>{'ชื่อ Season : '}</span>
                <span>{`${season.title}`}</span>
            </p>
            <p className={styles.row}>
                <span className={styles.title}>{'จำนวน : '}</span>
                <span>{`${season.chapter_count} ตอน`}</span>
            </p>
        </div>
    )
}

export default AnimeSeason;