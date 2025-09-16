// src/utils/translationUtils.ts

type TranslationFunction = (key: any, params?: Record<string, string | number>) => string;

/**
 * Fonction utilitaire pour traduire les catégories d'émissions
 * @param category - La catégorie en anglais depuis le backend
 * @param t - Fonction de traduction du contexte de langue
 * @returns La catégorie traduite selon la langue sélectionnée
 */
export const translateCategory = (category: string, t: TranslationFunction): string => {
  const categoryMappings: { [key: string]: string } = {
    'Electricity': 'category-electricity',
    'Heating': 'category-heating',
    'Transportation': 'category-transportation',
    'Business Travel': 'category-business-travel',
    'Waste': 'category-waste',
    'Water': 'category-water',
    'Materials': 'category-materials',
    'Food': 'category-food',
    'Services': 'category-services',
    'Equipment': 'category-equipment'
  };

  const translationKey = categoryMappings[category];
  if (translationKey) {
    return t(translationKey);
  }
  
  // Si pas de traduction trouvée, retourner la valeur originale
  return category;
};

/**
 * Fonction utilitaire pour traduire les sources d'émissions
 * @param source - La source en anglais depuis le backend
 * @param t - Fonction de traduction du contexte de langue
 * @returns La source traduite selon la langue sélectionnée
 */
export const translateSource = (source: string, t: TranslationFunction): string => {
  const sourceMappings: { [key: string]: string } = {
    'Grid Electricity': 'source-grid-electricity',
    'Natural Gas': 'source-natural-gas',
    'Company Vehicles': 'source-company-vehicles',
    'Air Travel': 'source-air-travel',
    'Landfill Waste': 'source-landfill-waste',
    'Water Supply': 'source-water-supply',
    'Raw Materials': 'source-raw-materials',
    'Employee Meals': 'source-employee-meals',
    'Cloud Services': 'source-cloud-services',
    'IT Equipment': 'source-it-equipment'
  };

  const translationKey = sourceMappings[source];
  if (translationKey) {
    return t(translationKey);
  }
  
  // Si pas de traduction trouvée, retourner la valeur originale
  return source;
};