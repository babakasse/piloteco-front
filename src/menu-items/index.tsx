// project import
import dashboard from './dashboard';
import support from './support';
import pages from './pages';

// types
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [dashboard, pages, support]
};

export default menuItems;
