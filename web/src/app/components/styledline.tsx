import React from 'react';
import styles from './styledline.module.css'

interface StyledLineProps {
    color: 'red' | 'yellow' |'gold' | 'silver' | 'bronze';
    size: 'thick' | 'thin';
}

const StyledLine: React.FC<StyledLineProps> = ({ color, size }) => {
    return <div className={`${styles.line}
                            ${color === 'red' ? styles.red : ''}
                            ${color === 'yellow' ? styles.yellow : ''} 
                            ${color === 'silver' ? styles.silver : ''} 
                            ${color === 'bronze' ? styles.bronze : ''}
                            ${size === 'thick' ? styles.thick : styles.thin }`}
    />
};

export default StyledLine;