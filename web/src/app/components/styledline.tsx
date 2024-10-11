import React from 'react';
import styles from './styledline.module.css'

interface StyledLineProps {
    color: 'red' | 'yellow';
}

const StyledLine: React.FC<StyledLineProps> = ({ color }) => {
    return <div className={`${styles.line} ${color === 'red' ? styles.red : styles.yellow}`} />;
};

export default StyledLine;