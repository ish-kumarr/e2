// app/(root)/events/[id]/loading.js

import styles from './loading.module.css'; // Ensure the path is correct

const LoadingSpinner = () => {
  return (
    <div className={styles['loading-container']}>
      <div className={styles['spinner']} />
    </div>
  );
};

export default LoadingSpinner;
