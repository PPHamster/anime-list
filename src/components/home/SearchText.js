import styles from '../styles/SearchText.module.css'

const SearchText = (props) => {
    /* Value and function on value change from useState */
    const { value, onValueChange } = props;
    return (
        <div className={styles.searchText}>
            <input 
                className={styles.searchTextInput}
                type="text"
                value={value}
                placeholder="ค้นหา"
                onChange={(e) => {onValueChange(e.target.value)}} 
            />
        </div>
    );
}

export default SearchText;