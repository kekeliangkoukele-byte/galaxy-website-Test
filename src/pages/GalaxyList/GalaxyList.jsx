import { useState, useMemo } from 'react';
import PageTransition from '../../components/PageTransition/PageTransition';
import SearchFilter from '../../components/SearchFilter/SearchFilter';
import GalaxyCard from '../../components/GalaxyCard/GalaxyCard';
import galaxies from '../../data/galaxies';
import styles from './GalaxyList.module.css';

export default function GalaxyList() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [hasSystemsFilter, setHasSystemsFilter] = useState(false);

  const filtered = useMemo(() => {
    let result = galaxies;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.nameEn.toLowerCase().includes(q) ||
          g.type.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q)
      );
    }

    if (typeFilter) {
      result = result.filter((g) => g.type.includes(typeFilter));
    }

    if (hasSystemsFilter) {
      result = result.filter((g) => g.hasSystems);
    }

    return result;
  }, [search, typeFilter, hasSystemsFilter]);

  const handleClear = () => {
    setSearch('');
    setTypeFilter('');
    setHasSystemsFilter(false);
  };

  return (
    <PageTransition>
      <div className={styles.page}>
        <div className="container">
          <div className={styles.hero}>
            <h1 className={styles.title}>
              <span>宇宙星系馆</span>
            </h1>
            <p className={styles.subtitle}>
              探索宇宙中的典型星系——从我们所在的银河系出发，了解本星系群中形形色色的星系世界
            </p>
          </div>

          <SearchFilter
            search={search}
            onSearchChange={setSearch}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
            hasSystemsFilter={hasSystemsFilter}
            onHasSystemsChange={setHasSystemsFilter}
            onClear={handleClear}
          />

          {filtered.length > 0 ? (
            <div className={styles.grid}>
              {filtered.map((galaxy, i) => (
                <GalaxyCard key={galaxy.id} galaxy={galaxy} index={i} />
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>&#128301;</span>
              没有找到匹配的星系
            </div>
          )}

          <p className={styles.count}>共 {filtered.length} 个星系</p>
        </div>
      </div>
    </PageTransition>
  );
}
