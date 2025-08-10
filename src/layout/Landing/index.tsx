import { ReactElement } from 'react';

// material-ui
import { styled } from '@mui/material/styles';

// ==============================|| LANDING LAYOUT ||============================== //

const LandingLayoutStyled = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  flexDirection: 'column'
}));

interface Props {
  children: ReactElement;
}

export default function LandingLayout({ children }: Props) {
  return <LandingLayoutStyled>{children}</LandingLayoutStyled>;
}
