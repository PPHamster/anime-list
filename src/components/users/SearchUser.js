import styles from '../styles/SearchUser.module.css'

const SearchUser = (props) => {
    /* Value and function on value change from useState */
    const { value, onValueChange, mobileSearch = false } = props;
    return (
        <input
            className={styles.searchUserInput}
            type="text"
            value={value}
            placeholder="ค้นหาผู้ใช้"
            onChange={(e) => { onValueChange(e.target.value) }}
            id="searchUserInput"
            onFocus={(e) => { e.target.select() }}
            autoFocus={mobileSearch}
        />
    );
}

export default SearchUser;