// This is example of menu item without group for horizontal layout. There will be no children.

// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Home, BookSquare, Buildings } from 'iconsax-react';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  dashboard: Home,
  assessment: BookSquare,
  companies: Buildings
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard: NavItemType = {
  id: 'dashboard',
  title: 'Tableau de bord',
  type: 'group',
  icon: icons.dashboard,
  children: [
    {
      id: 'dashboard-main',
      title: 'Tableau de bord',
      type: 'item',
      url: '/dashboard',
      icon: icons.dashboard
    },
    {
      id: 'assessment-list',
      title: 'Bilans carbone',
      type: 'item',
      url: '/assessment-list',
      icon: icons.assessment
    },
    {
      id: 'companies',
      title: 'Entreprises',
      type: 'item',
      url: '/companies',
      icon: icons.companies
    }
  ]
};

export default dashboard;
