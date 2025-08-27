import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import IconButton from 'components/@extended/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import { Global } from 'iconsax-react';
import { useLanguage } from 'contexts/LanguageContext';
import { ThemeMode } from 'config';

// Flags icons (you can replace with actual flag images)
const FrenchFlag = () => <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>🇫🇷</span>;

const EnglishFlag = () => <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>🇬🇧</span>;

const LanguageSelector = () => {
  const theme = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (newLanguage: 'fr' | 'en') => {
    setLanguage(newLanguage);
    handleClose();
  };

  const iconBackColorOpen = theme.palette.mode === ThemeMode.DARK ? 'background.paper' : 'secondary.200';
  const iconBackColor = theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'secondary.100';

  return (
    <>
      <Tooltip title={t('language')}>
        <IconButton
          color="secondary"
          variant="light"
          onClick={handleClick}
          size="large"
          sx={{
            color: 'secondary.main',
            bgcolor: open ? iconBackColorOpen : iconBackColor,
            p: 1,
            ml: 0.5
          }}
        >
          <Global variant="Bold" />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuItem onClick={() => handleLanguageChange('fr')} selected={language === 'fr'}>
          <ListItemIcon>
            <FrenchFlag />
          </ListItemIcon>
          <ListItemText>Français</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleLanguageChange('en')} selected={language === 'en'}>
          <ListItemIcon>
            <EnglishFlag />
          </ListItemIcon>
          <ListItemText>English</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default LanguageSelector;
