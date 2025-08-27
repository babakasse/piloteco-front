// src/data/emissionFactors.ts
export interface EmissionFactor {
  value: number;
  unit: string;
  source: string;
  lastUpdated: string;
  methodology: string;
}

export interface EmissionFactorCategory {
  [subcategory: string]: EmissionFactor;
}

export interface EmissionFactorsDatabase {
  [category: string]: EmissionFactorCategory;
}

// Base ADEME 2024 + facteurs internationaux
export const emissionFactors: EmissionFactorsDatabase = {
  'Air Travel': {
    'Court-courrier (<1000km)': {
      value: 0.255,
      unit: 'tCO₂e/passager/km',
      source: 'ADEME 2024',
      lastUpdated: '2024-01-01',
      methodology: 'Cycle de vie avec RFI 1.9'
    },
    'Moyen-courrier (1000-3000km)': {
      value: 0.186,
      unit: 'tCO₂e/passager/km',
      source: 'ADEME 2024',
      lastUpdated: '2024-01-01',
      methodology: 'Cycle de vie avec RFI 1.9'
    },
    'Long-courrier (>3000km)': {
      value: 0.150,
      unit: 'tCO₂e/passager/km',
      source: 'ADEME 2024',
      lastUpdated: '2024-01-01',
      methodology: 'Cycle de vie avec RFI 1.9'
    }
  },
  'Company Vehicles': {
    'Voiture essence': {
      value: 0.195,
      unit: 'tCO₂e/km',
      source: 'ADEME 2024',
      lastUpdated: '2024-01-01',
      methodology: 'Facteur moyen parc français'
    },
    'Voiture diesel': {
      value: 0.171,
      unit: 'tCO₂e/km',
      source: 'ADEME 2024',
      lastUpdated: '2024-01-01',
      methodology: 'Facteur moyen parc français'
    },
    'Voiture électrique': {
      value: 0.047,
      unit: 'tCO₂e/km',
      source: 'ADEME 2024',
      lastUpdated: '2024-01-01',
      methodology: 'Mix électrique français'
    },
    'Camionnette diesel': {
      value: 0.261,
      unit: 'tCO₂e/km',
      source: 'ADEME 2024',
      lastUpdated: '2024-01-01',
      methodology: 'Facteur moyen parc français'
    }
  },
  'Grid Electricity': {
    'France': {
      value: 0.0571,
      unit: 'tCO₂e/MWh',
      source: 'RTE/ADEME 2024',
      lastUpdated: '2024-01-01',
      methodology: 'Mix électrique français moyen'
    },
    'Allemagne': {
      value: 0.4660,
      unit: 'tCO₂e/MWh',
      source: 'IEA 2024',
      lastUpdated: '2024-01-01',
      methodology: 'Mix électrique allemand'
    },
    'Royaume-Uni': {
      value: 0.1940,
      unit: 'tCO₂e/MWh',
      source: 'DEFRA 2024',
      lastUpdated: '2024-01-01',
      methodology: 'Mix électrique britannique'
    },
    'Espagne': {
      value: 0.2540,
      unit: 'tCO₂e/MWh',
      source: 'IEA 2024',
      lastUpdated: '2024-01-01',
      methodology: 'Mix électrique espagnol'
    }
  },
  'Natural Gas': {
    'Gaz naturel chauffage': {
      value: 0.2274,
      unit: 'tCO₂e/MWh PCI',
      source: 'ADEME 2024',
      lastUpdated: '2024-01-01',
      methodology: 'Combustion + amont'
    },
    'Gaz naturel industrie': {
      value: 0.2274,
      unit: 'tCO₂e/MWh PCI',
      source: 'ADEME 2024',
      lastUpdated: '2024-01-01',
      methodology: 'Combustion + amont'
    }
  },
  'Employee Meals': {
    'Repas moyen': {
      value: 2.5,
      unit: 'kgCO₂e/repas',
      source: 'ADEME 2024',
      lastUpdated: '2024-01-01',
      methodology: 'Analyse cycle de vie repas type'
    },
    'Repas végétarien': {
      value: 1.2,
      unit: 'kgCO₂e/repas',
      source: 'ADEME 2024',
      lastUpdated: '2024-01-01',
      methodology: 'Analyse cycle de vie repas végétarien'
    },
    'Repas carné': {
      value: 4.1,
      unit: 'kgCO₂e/repas',
      source: 'ADEME 2024',
      lastUpdated: '2024-01-01',
      methodology: 'Analyse cycle de vie repas avec viande'
    }
  },
  'Landfill Waste': {
    'Déchets ménagers': {
      value: 0.5,
      unit: 'tCO₂e/tonne',
      source: 'ADEME 2024',
      lastUpdated: '2024-01-01',
      methodology: 'Enfouissement + traitement'
    },
    'Déchets recyclables': {
      value: 0.05,
      unit: 'tCO₂e/tonne',
      source: 'ADEME 2024',
      lastUpdated: '2024-01-01',
      methodology: 'Évitement émissions recyclage'
    }
  },
  'Cloud Services': {
    'Stockage cloud': {
      value: 0.012,
      unit: 'kgCO₂e/GB/an',
      source: 'Green Software Foundation 2024',
      lastUpdated: '2024-01-01',
      methodology: 'PUE moyen datacenters'
    },
    'Calcul cloud': {
      value: 0.5,
      unit: 'kgCO₂e/heure CPU',
      source: 'Green Software Foundation 2024',
      lastUpdated: '2024-01-01',
      methodology: 'PUE moyen datacenters'
    }
  },
  'Water Supply': {
    'Eau potable réseau': {
      value: 0.132,
      unit: 'kgCO₂e/m³',
      source: 'ADEME 2024',
      lastUpdated: '2024-01-01',
      methodology: 'Production et distribution eau potable'
    },
    'Eau embouteillée': {
      value: 0.27,
      unit: 'kgCO₂e/litre',
      source: 'ADEME 2024',
      lastUpdated: '2024-01-01',
      methodology: 'Cycle de vie complet bouteille plastique'
    }
  },
  'Raw Materials': {
    'Acier': {
      value: 1.95,
      unit: 'tCO₂e/tonne',
      source: 'ADEME 2024',
      lastUpdated: '2024-01-01',
      methodology: 'Production primaire acier'
    },
    'Aluminium': {
      value: 8.24,
      unit: 'tCO₂e/tonne',
      source: 'ADEME 2024',
      lastUpdated: '2024-01-01',
      methodology: 'Production primaire aluminium'
    },
    'Béton': {
      value: 0.324,
      unit: 'tCO₂e/tonne',
      source: 'ADEME 2024',
      lastUpdated: '2024-01-01',
      methodology: 'Production ciment + granulats'
    },
    'Plastique PET': {
      value: 2.15,
      unit: 'tCO₂e/tonne',
      source: 'ADEME 2024',
      lastUpdated: '2024-01-01',
      methodology: 'Production résine plastique'
    }
  },
  'IT Equipment': {
    'Ordinateur portable': {
      value: 300,
      unit: 'kgCO₂e/unité',
      source: 'ADEME 2024',
      lastUpdated: '2024-01-01',
      methodology: 'Cycle de vie complet sur 4 ans'
    },
    'Smartphone': {
      value: 70,
      unit: 'kgCO₂e/unité',
      source: 'ADEME 2024',
      lastUpdated: '2024-01-01',
      methodology: 'Cycle de vie complet sur 3 ans'
    },
    'Écran 24 pouces': {
      value: 250,
      unit: 'kgCO₂e/unité',
      source: 'ADEME 2024',
      lastUpdated: '2024-01-01',
      methodology: 'Cycle de vie complet sur 5 ans'
    },
    'Serveur': {
      value: 1200,
      unit: 'kgCO₂e/unité',
      source: 'ADEME 2024',
      lastUpdated: '2024-01-01',
      methodology: 'Cycle de vie complet sur 5 ans'
    }
  }
};

// Fonction utilitaire pour obtenir les facteurs par source
export const getFactorsBySource = (source: string): EmissionFactorCategory | null => {
  return emissionFactors[source] || null;
};

// Fonction pour obtenir un facteur spécifique
export const getEmissionFactor = (source: string, subcategory: string): EmissionFactor | null => {
  const sourceFactors = getFactorsBySource(source);
  return sourceFactors?.[subcategory] || null;
};

// Fonction pour obtenir les suggestions basées sur le pays
export const getSuggestionsByCountry = (source: string, country: string): EmissionFactor | null => {
  if (source === 'Grid Electricity') {
    return getEmissionFactor(source, country);
  }
  return null;
};
