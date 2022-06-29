import React from 'react';
import styles from '../../styles/TextInput.module.css';

const TextInput = React.forwardRef((props, ref) => {
    const { title, id, name, value = '' } = props
    return (
        <div className={styles.box}>
            <label htmlFor={id} className={styles.label}>{title} : </label>
            <input
                type="text"
                autoComplete="off"
                id={id}
                name={name}
                defaultValue={value}
                className={styles.input}
                maxLength={50}
                ref={ref}
            />
        </div>
    );
});

export default TextInput;