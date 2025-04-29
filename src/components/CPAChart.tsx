import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { Box, Typography } from '@mui/material';

interface CPAChartProps {
  data: Array<{
    month: string;
    cpa: number;
  }>;
}

export const CPAChart: React.FC<CPAChartProps> = ({ data }) => {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        CPA Mensal
      </Typography>
      <ResponsiveBar
        data={data}
        keys={['cpa']}
        indexBy="month"
        margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        colors="#8B5CF6"
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          format: (value) => `R$ ${value}`,
        }}
        labelFormat={(value) => `R$ ${value}`}
        role="application"
        ariaLabel="CPA Mensal"
        barAriaLabel={e => `CPA para ${e.indexValue}: R$ ${e.value}`}
      />
    </Box>
  );
}; 