import NumberInputSeason from "./FormComponent/NumberInputSeason";
import TextInputSeason from "./FormComponent/TextInputSeason";
import styles from "../../styles/basic.module.css";

const SeasonForm = (props) => {
    /* Get Id, object from useRef and function delete form season */
    const { id, objectRef, setAllSeasonRef } = props;
    const { title, sequence, chapter_count } = objectRef;

    /* Function delete season form */
    const onCloseClick = () => {
        setAllSeasonRef((prevSeasonRef) => {
            return prevSeasonRef.filter((season) => {
                return season.id !== id;
            })
        });
    }
    
    return (
        <div className={styles.seasonBox}>
            <div className={styles.rightBox}>
                <span className={styles.right} onClick={onCloseClick} >X</span>
            </div>
            <TextInputSeason title="ชื่อ Season" id={`season_title_${id}`} name="title" ref={title} />
            <NumberInputSeason title="ลำดับ Season" id={`season_sequence_${id}`} name="sequence" ref={sequence} />
            <NumberInputSeason title="จำนวนตอน ⠀" id={`chapter_count_${id}`} name="chapter_count" ref={chapter_count} />
        </div>
    );
}

export default SeasonForm;