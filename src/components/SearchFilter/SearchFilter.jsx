import styles from './SearchFilter.module.css';

const TYPE_OPTIONS = [
  { label: '全部', value: '' },
  { label: '棒旋星系', value: '棒旋星系' },
  { label: '螺旋星系', value: '螺旋星系' },
  { label: '不规则矮星系', value: '不规则' },
];

export default function SearchFilter({ search, onSearchChange, typeFilter, onTypeChange, hasSystemsFilter, onHasSystemsChange, onClear }) {
  const hasActiveFilters = search || typeFilter || hasSystemsFilter;

  return (
    <div className={styles.panel}>
      <input
        type="text"
        className={styles.search}
        placeholder="搜索星系名称..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      {TYPE_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          className={`${styles.filterBtn} ${typeFilter === opt.value ? styles.active : ''}`}
          onClick={() => onTypeChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}

      <button
        className={`${styles.filterBtn} ${hasSystemsFilter ? styles.active : ''}`}
        onClick={() => onHasSystemsChange(!hasSystemsFilter)}
      >
        有已知行星系统
      </button>

      {hasActiveFilters && (
        <button className={styles.clearBtn} onClick={onClear}>
          清除筛选
        </button>
      )}
    </div>
  );
}
