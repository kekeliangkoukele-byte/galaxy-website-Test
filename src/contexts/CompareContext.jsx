import { createContext, useContext, useState, useCallback } from 'react';

const CompareContext = createContext(null);

export function CompareProvider({ children }) {
  const [compareGalaxies, setCompareGalaxies] = useState([]);
  const [comparePlanets, setComparePlanets] = useState([]);

  const addGalaxy = useCallback((galaxy) => {
    setCompareGalaxies((prev) => {
      if (prev.find((g) => g.id === galaxy.id)) return prev;
      if (prev.length >= 4) return prev;
      return [...prev, galaxy];
    });
  }, []);

  const removeGalaxy = useCallback((id) => {
    setCompareGalaxies((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const addPlanet = useCallback((planet) => {
    setComparePlanets((prev) => {
      if (prev.find((p) => p.id === planet.id)) return prev;
      if (prev.length >= 4) return prev;
      return [...prev, planet];
    });
  }, []);

  const removePlanet = useCallback((id) => {
    setComparePlanets((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clearGalaxies = useCallback(() => setCompareGalaxies([]), []);
  const clearPlanets = useCallback(() => setComparePlanets([]), []);

  return (
    <CompareContext.Provider
      value={{
        compareGalaxies,
        comparePlanets,
        addGalaxy,
        removeGalaxy,
        addPlanet,
        removePlanet,
        clearGalaxies,
        clearPlanets,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
}
