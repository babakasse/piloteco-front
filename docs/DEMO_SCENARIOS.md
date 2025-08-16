# PilotEco - Scénarios de Démonstration MVP & Simplification de la Collecte de Données

## 🎯 Scénarios de Démonstration pour Clients

### Scénario 1: "L'Entreprise Débutante" (15 min)

**Profile**: PME de 50 employés, premier bilan carbone

**Narration**:

1. **Connexion** → Dashboard vide, accueil personnalisé
2. **Création du premier bilan** → "Bilan Carbone 2024 - TechCorp"
3. **Ajout d'émissions simples**:

   - Scope 1: Véhicules société (2 véhicules × 15,000 km × 0.195 kgCO₂/km = **5.85 tCO₂e**)
   - Scope 2: Électricité bureau (120 MWh × 0.0571 tCO₂/MWh = **6.85 tCO₂e**)
   - Scope 3: Déplacements aériens (Paris-Londres × 10 voyages × 0.255 tCO₂ = **2.55 tCO₂e**)

4. **Visualisation immédiate**: Graphiques se mettent à jour automatiquement
5. **Total**: **15.25 tCO₂e** avec répartition visuelle par scope

**Messages clés**:

- "Simplicité de saisie"
- "Calculs automatiques"
- "Visualisation immédiate"

### Scénario 2: "L'Entreprise Mature" (20 min)

**Profile**: Entreprise 200+ employés, historique multi-années

**Données pré-remplies**:

- **2022**: 245 tCO₂e
- **2023**: 198 tCO₂e (-19%)
- **2024**: 156 tCO₂e (-21%)

**Démonstration**:

1. **Dashboard avancé**: Évolution temporelle, objectifs environnementaux
2. **Analyse par catégorie**: Transport (45%), Électricité (30%), Autres (25%)
3. **Benchmarking**: "Objectif -50% d'ici 2030" avec progression visualisée
4. **Export** (simulation): "Rapport réglementaire PDF généré"

**Messages clés**:

- "Suivi des progrès"
- "Conformité réglementaire"
- "Aide à la décision"

### Scénario 3: "Multi-Sites" (10 min)

**Profile**: Groupe avec plusieurs filiales

**Démonstration**:

1. **Vue consolidée**: Agrégation automatique des bilans
2. **Comparaison inter-sites**: Intensité carbone par employé
3. **Identification**: Site le plus performant vs. site à améliorer

## 🚀 Simplification de la Collecte de Données Carbone

### 📊 Problèmes Actuels Identifiés

1. **Saisie manuelle** fastidieuse (facteurs d'émission)
2. **Sources de données** éparpillées
3. **Calculs complexes** pour les non-experts
4. **Facteurs d'émission** pas à jour

### 💡 Solutions MVP Implémentables

#### 1. **Base de Facteurs d'Émission Intégrée**

```typescript
// Ajout dans EmissionForm.tsx
const emissionFactors = {
  'Air Travel': {
    'Short haul (<1000km)': 0.255,
    'Medium haul (1000-3000km)': 0.186,
    'Long haul (>3000km)': 0.15
  },
  'Company Vehicles': {
    'Petrol car': 0.195,
    'Diesel car': 0.171,
    'Electric car': 0.047
  },
  'Grid Electricity': {
    France: 0.0571,
    Germany: 0.466,
    UK: 0.194
  }
};
```

#### 2. **Import CSV/Excel**

```typescript
// Nouveau composant: BulkImportForm.tsx
const handleFileUpload = (file: File) => {
  // Parse CSV → Validation → Import automatique
  // Template: Source, Quantité, Unité, Période
};
```

#### 3. **Suggestions Intelligentes**

```typescript
// Dans EmissionForm.tsx
const getSuggestions = (source: string, company: Company) => {
  if (source === 'Grid Electricity') {
    return {
      factor: emissionFactors['Grid Electricity'][company.country],
      unit: 'MWh',
      tipText: 'Valeur moyenne pour votre pays'
    };
  }
};
```

#### 4. **Calculs Automatiques Avancés**

```typescript
// Extension du calcul actuel
const calculateEmissions = (activityData: number, source: string, metadata: any) => {
  const factor = getEmissionFactor(source, metadata);
  const uncertainty = getUncertainty(source);

  return {
    amount: activityData * factor,
    uncertainty: uncertainty,
    methodology: getMethodology(source)
  };
};
```

### 🎯 Roadmap d'Amélioration Post-MVP

#### Phase 1 (Court terme - 2-4 semaines)

- **Facteurs d'émission pré-remplis** par pays/secteur
- **Templates de saisie** par type d'entreprise
- **Validation automatique** des données incohérentes

#### Phase 2 (Moyen terme - 2-3 mois)

- **Import API** factures électricité/gaz
- **Géolocalisation automatique** pour facteurs régionaux
- **Suggestions ML** basées sur secteur d'activité

#### Phase 3 (Long terme - 6+ mois)

- **Connecteurs ERP** (SAP, Oracle)
- **IoT Integration** pour données temps réel
- **Benchmark sectoriel** automatique

### 🛠️ Améliorations Techniques Immédiates

#### 1. **Optimisation UX du Formulaire**

```typescript
// Ajout d'un wizard step-by-step
const EmissionWizard = () => {
  const [step, setStep] = useState(1);
  // Step 1: Choix source/catégorie
  // Step 2: Saisie quantité
  // Step 3: Validation/calcul
  // Step 4: Confirmation
};
```

#### 2. **Aide Contextuelle**

```tsx
// Tooltips explicatifs sur chaque champ
<Tooltip title="Facteur d'émission basé sur la base ADEME 2024">
  <TextField label="Facteur d'émission" />
</Tooltip>
```

#### 3. **Sauvegarde Progressive**

```typescript
// Auto-save toutes les 30 secondes
useEffect(() => {
  const autoSave = setInterval(() => {
    if (isDirty) saveAsDraft(emissions);
  }, 30000);

  return () => clearInterval(autoSave);
}, [emissions, isDirty]);
```

### 📈 Métriques de Succès MVP

**Facilité d'utilisation**:

- Temps de saisie < 5 min pour 10 émissions
- Taux d'erreur < 5%
- Satisfaction utilisateur > 4/5

**Fiabilité des données**:

- 95% facteurs d'émission à jour
- Validation automatique des incohérences
- Traçabilité complète des calculs

**Adoption**:

- 80% utilisateurs complètent leur premier bilan
- 60% reviennent pour un second bilan
- 90% recommandent l'outil

### 🎤 Arguments de Vente MVP

1. **"5 minutes vs 5 heures"**: Saisie d'un bilan complet
2. **"Zéro expertise carbone requise"**: Facteurs pré-calculés
3. **"Conformité garantie"**: Standards GHG Protocol
4. **"ROI immédiat"**: Identification des gisements d'économies
5. **"Évolutivité"**: De la PME au groupe international

Cette approche positionne PilotEco comme la solution **"anti-Excel"** pour le bilan carbone, avec un focus sur la simplicité sans sacrifier la précision.
