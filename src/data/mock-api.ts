// Mock API and data hooks using @tanstack/react-query

// Production KPIs
export const fetchProductionKPIs = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return {
    crushingRate: { value: 610, unit: 'TCH', target: 600 },
    sugarRecoveryFactor: { value: 11.2, unit: '%', trend: 'up' as const },
    downtimeSummary: { 
      totalHours: 12.5, 
      mechanical: 6.5, 
      process: 3.0, 
      electrical: 3.0 
    },
    hourlyThroughput: [
      { hour: '00:00', tons: 580, target: 600 },
      { hour: '02:00', tons: 595, target: 600 },
      { hour: '04:00', tons: 610, target: 600 },
      { hour: '06:00', tons: 605, target: 600 },
      { hour: '08:00', tons: 620, target: 600 },
      { hour: '10:00', tons: 615, target: 600 },
      { hour: '12:00', tons: 610, target: 600 },
      { hour: '14:00', tons: 595, target: 600 },
      { hour: '16:00', tons: 600, target: 600 },
      { hour: '18:00', tons: 590, target: 600 },
      { hour: '20:00', tons: 585, target: 600 },
      { hour: '22:00', tons: 580, target: 600 },
    ]
  };
};

// Farmer Payments
export const fetchFarmerPayments = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return [
    { id: 1, name: 'Rajesh Kumar', tonnage: 125.5, qualityDeduction: 2.5, netPayable: 187250, status: 'Paid' as const },
    { id: 2, name: 'Amit Patel', tonnage: 98.2, qualityDeduction: 1.8, netPayable: 146580, status: 'Paid' as const },
    { id: 3, name: 'Suresh Desai', tonnage: 156.7, qualityDeduction: 3.2, netPayable: 234050, status: 'Pending' as const },
    { id: 4, name: 'Mahesh Shah', tonnage: 72.3, qualityDeduction: 1.0, netPayable: 108300, status: 'Paid' as const },
    { id: 5, name: 'Dinesh Mehta', tonnage: 103.4, qualityDeduction: 2.1, netPayable: 154650, status: 'Pending' as const },
    { id: 6, name: 'Prakash Rao', tonnage: 89.6, qualityDeduction: 1.5, netPayable: 134100, status: 'Paid' as const },
    { id: 7, name: 'Vijay Singh', tonnage: 142.8, qualityDeduction: 2.8, netPayable: 213720, status: 'Pending' as const },
    { id: 8, name: 'Anil Verma', tonnage: 67.9, qualityDeduction: 0.9, netPayable: 101700, status: 'Paid' as const },
  ];
};

// Yield Forecast
export const fetchYieldForecast = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return {
    forecast: 45892,
    actual: 48250,
    lastYear: 42100,
    unit: 'Tons'
  };
};

// Trucks
export const fetchTrucks = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return [
    { id: 1, vehicle: 'GJ-01-AB-1234', status: 'Unloading' as const, timeInQueueMinutes: 15, eta: '10:45 AM' },
    { id: 2, vehicle: 'GJ-02-CD-5678', status: 'In Queue' as const, timeInQueueMinutes: 45, eta: '11:15 AM' },
    { id: 3, vehicle: 'GJ-03-EF-9012', status: 'En Route' as const, timeInQueueMinutes: 0, eta: '12:30 PM' },
    { id: 4, vehicle: 'GJ-04-GH-3456', status: 'In Queue' as const, timeInQueueMinutes: 78, eta: '11:00 AM' },
    { id: 5, vehicle: 'GJ-05-IJ-7890', status: 'Unloading' as const, timeInQueueMinutes: 22, eta: '10:30 AM' },
    { id: 6, vehicle: 'GJ-06-KL-2345', status: 'En Route' as const, timeInQueueMinutes: 0, eta: '01:15 PM' },
    { id: 7, vehicle: 'GJ-07-MN-6789', status: 'In Queue' as const, timeInQueueMinutes: 92, eta: '10:50 AM' },
    { id: 8, vehicle: 'GJ-08-OP-1234', status: 'En Route' as const, timeInQueueMinutes: 0, eta: '02:00 PM' },
  ];
};

// Power Metrics
export const fetchPowerMetrics = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return {
    generatedMW: 65,
    consumedMW: 37,
    netExportMW: 28
  };
};

// Distillery Metrics
export const fetchDistilleryMetrics = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return {
    ethanolYield: 285,
    inventoryLiters: 142500,
    fermentationBatches: [
      { id: 1, status: 'Active' as const, daysActive: 3 },
      { id: 2, status: 'Active' as const, daysActive: 5 },
      { id: 3, status: 'Complete' as const, daysActive: 7 },
      { id: 4, status: 'Active' as const, daysActive: 2 },
      { id: 5, status: 'Complete' as const, daysActive: 7 },
    ]
  };
};

// Sustainability Metrics
export const fetchSustainability = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return {
    waterConsumption: { current: 8.5, target: 10.0, unit: 'Liters/Ton Sugar' },
    effluentQuality: { bod: 28, cod: 95, bodLimit: 30, codLimit: 100 }
  };
};
