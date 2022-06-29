import React from 'react';
import styles from '../../styles/SelectOption.module.css';

const SelectOption = React.forwardRef((props, ref) => {
    const { title, id, name, optionValue, defaultValue = 0, onValueChange = () => {} } = props;
    const optionElement = optionValue.map((option, index) => {
        return (
            <option key={index} value={index}>{option}</option>
        );
    });
    return (
        <div className={styles.box}>
            <label htmlFor={id} className={styles.label}>{title} : </label>
            <div className={styles.select}>
                <select 
                className={styles.selectInput}
                defaultValue={defaultValue}
                name={name}
                id={id}
                ref={ref}
                onChange={(e) => onValueChange(e.target.value)}
                >
                    {optionElement}
                </select>
            </div>
        </div>
    );
});

SelectOption.displayName = 'SelectOption';
export default SelectOption;