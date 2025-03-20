import styles from './Loading.module.css'
import React, { useState, useEffect } from 'react'


export function Loading() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div>
            {isLoading && (
                <div className={styles.loader_wrapper}>
                    <span className={styles.loader}><span className={styles.loader_inner}></span></span>
                </div>
            )}
        </div>
    )
}