// This is example of menu item without group for horizontal layout. There will be no children.

// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Home } from 'iconsax-react';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  dashboard: Home
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
      id: 'assessment-create',
      title: 'Nouveau bilan carbone',
      type: 'item',
      url: '/assessment-create',
    },
    {
      id: 'assessment-list',
      title: 'Bilans carbone',
      type: 'item',
      url: '/assessment-list',
    },
    {
      id: 'companies',
      title: 'Entreprises',
      type: 'item',
      url: '/companies',
    }
  ]
};

export default dashboard;
