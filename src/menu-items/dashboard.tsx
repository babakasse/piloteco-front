// This is example of menu item without group for horizontal layout. There will be no children.

// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Home, BookSquare, Buildings, Flash } from 'iconsax-react';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  dashboard: Home,
  assessment: BookSquare,
  companies: Buildings,
  energy: Flash
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard: NavItemType = {
  id: 'dashboard',
  title: <FormattedMessage id="dashboard" />,
  type: 'group',
  icon: icons.dashboard,
  children: [
    {
      id: 'dashboard-main',
      title: <FormattedMessage id="dashboard" />,
      type: 'item',
      url: '/dashboard',
      icon: icons.dashboard
    },
    {
      id: 'assessment-list',
      title: <FormattedMessage id="assessments" />,
      type: 'item',
      url: '/assessment-list',
      icon: icons.assessment
    },
    {
      id: 'companies',
      title: <FormattedMessage id="companies" />,
      type: 'item',
      url: '/companies',
      icon: icons.companies
    },
    {
      id: 'energy',
      title: <FormattedMessage id="energy-dashboard" />,
      type: 'item',
      url: '/energy',
      icon: icons.energy
    }
  ]
};

export default dashboard;
