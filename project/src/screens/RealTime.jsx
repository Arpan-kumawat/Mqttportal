import React from 'react';
import Sensor from '../Views/Dashboard/Sensor';

export default function RealTime({ onNewAlert }) {
  return (
    <>
      <Sensor onNewAlert={onNewAlert} />
    </>
  );
}
