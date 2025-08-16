// src/data/sectorTemplates.ts
export interface EmissionTemplate {
  source: string;
  subcategory: string;
  category: string;
  description: string;
  estimatedQuantity?: number;
  priority: 'high' | 'medium' | 'low';
}

export interface SectorTemplate {
  name: string;
  description: string;
  emissions: EmissionTemplate[];
}

export const sectorTemplates: { [key: string]: SectorTemplate } = {
  'technology': {
    name: 'Technologie / IT',
    description: 'Entreprise de services numériques',
    emissions: [
      {
        source: 'Grid Electricity',
        subcategory: 'France',
        category: 'Electricity',
        description: 'Consommation électricité bureaux',
        estimatedQuantity: 50, // MWh
        priority: 'high'
      },
      {
        source: 'Cloud Services',
        subcategory: 'Stockage cloud',
        category: 'Services',
        description: 'Hébergement et stockage de données',
        estimatedQuantity: 1000, // GB/an
        priority: 'high'
      },
      {
        source: 'Air Travel',
        subcategory: 'Court-courrier (<1000km)',
        category: 'Business Travel',
        description: 'Déplacements commerciaux équipe',
        estimatedQuantity: 5000, // km
        priority: 'medium'
      },
      {
        source: 'Employee Meals',
        subcategory: 'Repas moyen',
        category: 'Food',
        description: 'Repas d\'équipe et événements',
        estimatedQuantity: 200, // repas
        priority: 'medium'
      },
      {
        source: 'Company Vehicles',
        subcategory: 'Voiture électrique',
        category: 'Transportation',
        description: 'Véhicules de fonction',
        estimatedQuantity: 10000, // km
        priority: 'low'
      }
    ]
  },
  'manufacturing': {
    name: 'Industrie / Manufacturing',
    description: 'Entreprise de production industrielle',
    emissions: [
      {
        source: 'Natural Gas',
        subcategory: 'Gaz naturel industrie',
        category: 'Heating',
        description: 'Chauffage et procédés industriels',
        estimatedQuantity: 200, // MWh
        priority: 'high'
      },
      {
        source: 'Grid Electricity',
        subcategory: 'France',
        category: 'Electricity',
        description: 'Machines et éclairage usine',
        estimatedQuantity: 300, // MWh
        priority: 'high'
      },
      {
        source: 'Company Vehicles',
        subcategory: 'Camionnette diesel',
        category: 'Transportation',
        description: 'Livraisons et transport marchandises',
        estimatedQuantity: 50000, // km
        priority: 'high'
      },
      {
        source: 'Landfill Waste',
        subcategory: 'Déchets ménagers',
        category: 'Waste',
        description: 'Déchets de production',
        estimatedQuantity: 10, // tonnes
        priority: 'medium'
      },
      {
        source: 'Air Travel',
        subcategory: 'Moyen-courrier (1000-3000km)',
        category: 'Business Travel',
        description: 'Déplacements commerciaux',
        estimatedQuantity: 15000, // km
        priority: 'medium'
      }
    ]
  },
  'retail': {
    name: 'Commerce / Retail',
    description: 'Commerce de détail et distribution',
    emissions: [
      {
        source: 'Grid Electricity',
        subcategory: 'France',
        category: 'Electricity',
        description: 'Éclairage et climatisation magasins',
        estimatedQuantity: 150, // MWh
        priority: 'high'
      },
      {
        source: 'Company Vehicles',
        subcategory: 'Camionnette diesel',
        category: 'Transportation',
        description: 'Livraisons clients',
        estimatedQuantity: 30000, // km
        priority: 'high'
      },
      {
        source: 'Natural Gas',
        subcategory: 'Gaz naturel chauffage',
        category: 'Heating',
        description: 'Chauffage points de vente',
        estimatedQuantity: 80, // MWh
        priority: 'medium'
      },
      {
        source: 'Landfill Waste',
        subcategory: 'Déchets recyclables',
        category: 'Waste',
        description: 'Emballages et déchets',
        estimatedQuantity: 5, // tonnes
        priority: 'medium'
      },
      {
        source: 'Air Travel',
        subcategory: 'Court-courrier (<1000km)',
        category: 'Business Travel',
        description: 'Déplacements professionnels',
        estimatedQuantity: 3000, // km
        priority: 'low'
      }
    ]
  },
  'services': {
    name: 'Services / Conseil',
    description: 'Entreprise de services et conseil',
    emissions: [
      {
        source: 'Air Travel',
        subcategory: 'Moyen-courrier (1000-3000km)',
        category: 'Business Travel',
        description: 'Missions clients',
        estimatedQuantity: 25000, // km
        priority: 'high'
      },
      {
        source: 'Grid Electricity',
        subcategory: 'France',
        category: 'Electricity',
        description: 'Bureaux et équipements informatiques',
        estimatedQuantity: 60, // MWh
        priority: 'high'
      },
      {
        source: 'Company Vehicles',
        subcategory: 'Voiture essence',
        category: 'Transportation',
        description: 'Déplacements consultants',
        estimatedQuantity: 40000, // km
        priority: 'medium'
      },
      {
        source: 'Employee Meals',
        subcategory: 'Repas moyen',
        category: 'Food',
        description: 'Repas clients et équipe',
        estimatedQuantity: 300, // repas
        priority: 'medium'
      },
      {
        source: 'Natural Gas',
        subcategory: 'Gaz naturel chauffage',
        category: 'Heating',
        description: 'Chauffage bureaux',
        estimatedQuantity: 40, // MWh
        priority: 'low'
      }
    ]
  },
  'healthcare': {
    name: 'Santé / Healthcare',
    description: 'Établissement de santé',
    emissions: [
      {
        source: 'Grid Electricity',
        subcategory: 'France',
        category: 'Electricity',
        description: 'Équipements médicaux et éclairage',
        estimatedQuantity: 400, // MWh
        priority: 'high'
      },
      {
        source: 'Natural Gas',
        subcategory: 'Gaz naturel chauffage',
        category: 'Heating',
        description: 'Chauffage et eau chaude',
        estimatedQuantity: 150, // MWh
        priority: 'high'
      },
      {
        source: 'Landfill Waste',
        subcategory: 'Déchets ménagers',
        category: 'Waste',
        description: 'Déchets médicaux et généraux',
        estimatedQuantity: 20, // tonnes
        priority: 'medium'
      },
      {
        source: 'Company Vehicles',
        subcategory: 'Voiture essence',
        category: 'Transportation',
        description: 'Véhicules médicaux',
        estimatedQuantity: 15000, // km
        priority: 'medium'
      },
      {
        source: 'Employee Meals',
        subcategory: 'Repas moyen',
        category: 'Food',
        description: 'Restauration personnel et patients',
        estimatedQuantity: 1000, // repas
        priority: 'low'
      }
    ]
  }
};

export const getSectorTemplate = (sector: string): SectorTemplate | null => {
  return sectorTemplates[sector] || null;
};

export const getAllSectors = (): Array<{value: string, label: string}> => {
  return Object.entries(sectorTemplates).map(([key, template]) => ({
    value: key,
    label: template.name
  }));
};
