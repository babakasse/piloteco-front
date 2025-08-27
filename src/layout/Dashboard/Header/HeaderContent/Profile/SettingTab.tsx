import { useState, MouseEvent } from 'react';

// material-ui
import List from '@mui/material/List';
import Link from '@mui/material/Link';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// project imports
import { useLanguage } from 'contexts/LanguageContext';

// assets
import { Clipboard, I24Support, Lock1, Messages1, Profile } from 'iconsax-react';

// ==============================|| HEADER PROFILE - SETTING TAB ||============================== //

export default function SettingTab() {
  const { t } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const handleListItemClick = (event: MouseEvent<HTMLDivElement>, index: number) => {
    setSelectedIndex(index);
  };

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      <Link style={{ textDecoration: 'none' }}>
        <ListItemButton selected={selectedIndex === 0} onClick={(event: MouseEvent<HTMLDivElement>) => handleListItemClick(event, 0)}>
          <ListItemIcon>
            <I24Support variant="Bulk" size={18} />
          </ListItemIcon>
          <ListItemText primary={t('support')} />
        </ListItemButton>
      </Link>
      <ListItemButton selected={selectedIndex === 1} onClick={(event: MouseEvent<HTMLDivElement>) => handleListItemClick(event, 1)}>
        <ListItemIcon>
          <Profile variant="Bulk" size={18} />
        </ListItemIcon>
        <ListItemText primary={t('account-settings')} />
      </ListItemButton>
      <ListItemButton selected={selectedIndex === 2} onClick={(event: MouseEvent<HTMLDivElement>) => handleListItemClick(event, 2)}>
        <ListItemIcon>
          <Lock1 variant="Bulk" size={18} />
        </ListItemIcon>
        <ListItemText primary={t('privacy-center')} />
      </ListItemButton>
      <Link style={{ textDecoration: 'none' }}>
        <ListItemButton selected={selectedIndex === 3} onClick={(event: MouseEvent<HTMLDivElement>) => handleListItemClick(event, 3)}>
          <ListItemIcon>
            <Messages1 variant="Bulk" size={18} />
          </ListItemIcon>
          <ListItemText primary={t('feedback')} />
        </ListItemButton>
      </Link>
      <ListItemButton selected={selectedIndex === 4} onClick={(event: MouseEvent<HTMLDivElement>) => handleListItemClick(event, 4)}>
        <ListItemIcon>
          <Clipboard variant="Bulk" size={18} />
        </ListItemIcon>
        <ListItemText primary={t('history')} />
      </ListItemButton>
    </List>
  );
}
