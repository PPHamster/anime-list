import React, { useState, useEffect } from 'react';
import styles from '../../styles/NumberInputSeason.module.css';

const NumberInputSeason = React.forwardRef((props, ref) => {

    const [number, setNumber] = useState(0);
    const { title, id, name } = props

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
                    ref={addToRefs}
                />
                <button className={styles.plus} onClick={plus}>
                    <span>+</span>
                </button>
            </div>
        </div>
    );
});

export default NumberInputSeason;