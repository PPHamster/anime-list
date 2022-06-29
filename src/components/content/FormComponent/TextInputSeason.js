import React, { useEffect } from 'react';
import styles from '../../styles/textInputSeason.module.css';

const TextInputSeason = React.forwardRef((props, ref) => {

    const { title, id, name } = props

    const addToRefs = (element) => {
        if(element && !ref.current.includes(element)) {
            ref.current.push(element);
        }
    }

    useEffect(() => {
        return () => {
            ref.current = ref.current.filter((element) => {
                return element.id !== id;
            });
        }
    }, [])
    
    return (
        <div className={styles.box}>
            <label htmlFor={id} className={styles.label}>{title} : </label>
            <input
                type="text"
                id={id}
                name={name}
                className={styles.input}
                maxLength={50}
                ref={addToRefs}
            />
        </div>
    );
});

TextInputSeason.displayName = 'TextInputSeason';
export default TextInputSeason;