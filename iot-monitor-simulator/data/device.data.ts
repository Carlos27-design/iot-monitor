interface Device {
  name: string;
  serialNumber: string;
  status: string;
}

interface data {
  devices: Device[];
}

export const initialData: data = {
  devices: [
    {
      name: 'Sensor de Temperatura 1',
      serialNumber: 'SN-001',
      status: 'online',
    },
    { name: 'Sensor de Humedad 2', serialNumber: 'SN-002', status: 'online' },
    { name: 'Sensor de Presión 3', serialNumber: 'SN-003', status: 'online' },
    { name: 'Cámara de Puerta 4', serialNumber: 'SN-004', status: 'online' },
    { name: 'Alarma de Seguridad 5', serialNumber: 'SN-005', status: 'online' },
    { name: 'Detector de Humo 6', serialNumber: 'SN-006', status: 'online' },
    {
      name: 'Sensor de Fugas de Agua 7',
      serialNumber: 'SN-007',
      status: 'online',
    },
    {
      name: 'Sensor de Movimiento 8',
      serialNumber: 'SN-008',
      status: 'online',
    },
    { name: 'Sensor de Luz 9', serialNumber: 'SN-009', status: 'online' },
    { name: 'Sensor de CO2 10', serialNumber: 'SN-010', status: 'online' },
    {
      name: 'Sensor de Temperatura 11',
      serialNumber: 'SN-011',
      status: 'online',
    },
    { name: 'Sensor de Humedad 12', serialNumber: 'SN-012', status: 'online' },
    { name: 'Sensor de Presión 13', serialNumber: 'SN-013', status: 'online' },
    { name: 'Cámara de Puerta 14', serialNumber: 'SN-014', status: 'online' },
    {
      name: 'Alarma de Seguridad 15',
      serialNumber: 'SN-015',
      status: 'online',
    },
    { name: 'Detector de Humo 16', serialNumber: 'SN-016', status: 'online' },
    {
      name: 'Sensor de Fugas de Agua 17',
      serialNumber: 'SN-017',
      status: 'online',
    },
    {
      name: 'Sensor de Movimiento 18',
      serialNumber: 'SN-018',
      status: 'online',
    },
    { name: 'Sensor de Luz 19', serialNumber: 'SN-019', status: 'online' },
    { name: 'Sensor de CO2 20', serialNumber: 'SN-020', status: 'online' },
  ],
};
