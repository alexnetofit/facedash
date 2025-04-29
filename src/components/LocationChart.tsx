import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { Box, Typography } from '@mui/material';

interface LocationChartProps {
  data: Array<{
    region: string;
    spend: number;
  }>;
}

export const LocationChart: React.FC<LocationChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    id: item.region,
    label: item.region,
    value: item.spend,
  }));

  const colors = {
    'São Paulo': '#4285F4',
    'Rio de Janeiro': '#34A853',
    'Minas Gerais': '#FBBC05',
    'Bahia': '#EA4335',
    'Rio Grande do Sul': '#8B5CF6',
    'Outros': '#F472B6',
  };

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Gastos por Localização
      </Typography>
      <ResponsivePie
        data={chartData}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        colors={({ id }) => colors[id as keyof typeof colors]}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
        legends={[
          {
            anchor: 'right',
            direction: 'column',
            justify: false,
            translateX: 70,
            translateY: 0,
            itemWidth: 100,
            itemHeight: 20,
            itemsSpacing: 0,
            symbolSize: 20,
            itemDirection: 'left-to-right'
          }
        ]}
      />
    </Box>
  );
}; 