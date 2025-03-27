import styles from './Loading.module.css';
import React, { useState, useEffect } from 'react';

export function Loading() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 600);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div>
            {isLoading && (
                <div className={styles.loadingDiv}>
                    <svg className={styles.svg} viewBox="25 25 50 50">
                        <circle className={styles.circle} r="20" cy="50" cx="50"></circle>
                    </svg>
                </div>
            )}
        </div>
    )
}


