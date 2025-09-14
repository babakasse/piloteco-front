// Components for role-based menu items
import { FormattedMessage } from 'react-intl';
import useCompany from 'hooks/useCompany';

// Company menu item title based on user role
export const CompaniesMenuTitle = () => {
  const { isSuperAdmin, isAdmin } = useCompany();

  if (isSuperAdmin) {
    return <FormattedMessage id="manage-companies" />;
  } else if (isAdmin) {
    return <FormattedMessage id="my-company" />;
  } else {
    return <FormattedMessage id="my-company" />;
  }
};

export default CompaniesMenuTitle;
