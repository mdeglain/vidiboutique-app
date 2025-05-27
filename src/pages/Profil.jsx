import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useTheme } from '../themes/useTheme';
import DefaultOrdersList from '../components/default-orders/default-orders-list';

const Profil = () => {
  const theme = useTheme();

  const styles = {
    container: {
      padding: theme.space.l,
      maxWidth: '1200px',
      margin: '0 auto',
    },
    section: {
      marginBottom: theme.space.l,
    },
    paper: {
      padding: theme.space.m,
    },
  };

  return (
    <Box sx={styles.container}>
      <Typography variant="h4" component="h1" gutterBottom>
        Mon profil
      </Typography>

      {/* Section des commandes par défaut */}
      <Box sx={styles.section}>
        <Paper sx={styles.paper}>
          <DefaultOrdersList />
        </Paper>
      </Box>

      {/* Autres sections du profil peuvent être ajoutées ici */}
    </Box>
  );
};

export default Profil;
