import React from 'react';
import styles from '../../styles/CheckBox.module.css';

const CheckBox = React.forwardRef((props, ref) => {
    const { title, id, name, small, onCheckedChange = () => {}, checked = false } = props;

    return (
        <div className={styles.box}>
            <label htmlFor={id} className={styles.label}>{title} : </label>
            <input
                type="checkbox"
                id={id}
                onChange={(event) => onCheckedChange(event.target.checked)}
                name={name}
                defaultChecked={checked}
                className={!!small && small ? styles.checkBoxSmall : styles.checkBox}
                ref={ref}
            />
        </div>
    );
});

CheckBox.displayName = 'CheckBox';
export default CheckBox;