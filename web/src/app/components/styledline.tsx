import React from 'react';
import styles from './styledline.module.css'

interface StyledLineProps {
    color: 'red' | 'yellow' |'gold' | 'silver' | 'bronze';
    size: 'thick' | 'thin' | 'sidebar' | 'overtaker';
}

const StyledLine: React.FC<StyledLineProps> = ({ color, size }) => {
    return <div className={`${size !== 'sidebar' ? styles.line : styles.sidebar}
                            ${color === 'red' ? styles.red : ''}
                            ${color === 'yellow' ? styles.yellow : ''} 
                            ${color === 'silver' ? styles.silver : ''} 
                            ${color === 'bronze' ? styles.bronze : ''}
                            ${size === 'thick' ? styles.thick : ''}
                            ${size === 'thin' ? styles.thin : ''}
                            ${size === 'sidebar' ? styles.sidebar : ''}
                            ${size === 'overtaker' ? styles.overtaker : ''}`}
    />
};

export default StyledLine;