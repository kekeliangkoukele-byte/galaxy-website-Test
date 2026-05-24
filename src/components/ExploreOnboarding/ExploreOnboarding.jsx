import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ExploreOnboarding.module.css';

export default function ExploreOnboarding({ onDismiss }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('explore-onboarded');
    if (dismissed) {
      setVisible(false);
      onDismiss();
    }
  }, [onDismiss]);

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem('explore-onboarded', '1');
    onDismiss();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.content}>
            <h2 className={styles.title}>探索宇宙尺度</h2>
            <p className={styles.hint}>
              <span className={styles.scrollIcon}>
                <span className={styles.mouse}>
                  <span className={styles.wheel} />
                </span>
              </span>
              滚动鼠标，穿梭于浩瀚宇宙的不同尺度之间
            </p>
            <p className={styles.subHint}>拖拽鼠标旋转视角 &middot; 点击天体查看详情</p>
            <button className={styles.startBtn} onClick={handleDismiss}>
              开始探索
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
