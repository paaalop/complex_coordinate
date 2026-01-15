"use client";

import React from 'react';
import { Coordinates } from 'mafs';

export const PolarGrid = () => {
  return (
      <Coordinates.Polar 
        subdivisions={2}
        lines={2}
      />
  );
};
