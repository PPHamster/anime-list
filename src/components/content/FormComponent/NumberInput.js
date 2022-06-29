import React, { useState } from 'react';
import styles from '../../styles/NumberInput.module.css';

const NumberInput = React.forwardRef((props, ref) => {

    const { title, id, name, value = 0 } = props
    const [number, setNumber] = useState(value);

    const plus = () => {
        setNumber((prevNumber) => {
            return Number(prevNumber) + 1;
        })
    }

    const minus = () => {
        if(number <= 0) return;
        setNumber((prevNumber) => {
            return Number(prevNumber) - 1;
        })
    }

    return (
        <div className={styles.box}>
            <label htmlFor={id} className={styles.label}>{title} : </label>
            <div className={styles.numberBox}>
                <button className={styles.minus} onClick={minus}>
                    <span>-</span>
                </button>
                <input 
                    type="number"
                    min={0}
                    value={number}
                    onChange={(event) => {setNumber(event.target.value)}}
                    id={id}
                    name={name}
                    className={styles.input}
                    ref={ref}
                />
                <button className={styles.plus} onClick={plus}>
                    <span>+</span>
                </button>
            </div>
        </div>
    );
});

export default NumberInput;