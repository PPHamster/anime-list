import React from 'react';
import styles from '../../styles/TextArea.module.css';

const TextArea = React.forwardRef((props, ref) => {
    const { title, id, name, value = '' } = props
    return (
        <div className={styles.box}>
            <label htmlFor={id} className={styles.label}>{title} : </label>
            <textarea
            id={id}
            name={name}
            rows={4}
            className={styles.input}
            ref={ref}
            defaultValue={value}
            />
        </div>
    );
});

TextArea.displayName = 'TextArea';
export default TextArea;