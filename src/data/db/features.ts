import { Feature } from '../../types/database';

export const FEATURES_DB: Feature[] = [
  // Comfort
  { id: 'feat-auto-ac', name: 'Automatic Climate Control', category: 'Comfort', description: 'Maintains set temperature automatically.' },
  { id: 'feat-sunroof', name: 'Panoramic / Electric Sunroof', category: 'Comfort', description: 'Glass roof opening.' },
  { id: 'feat-vent-seats', name: 'Ventilated Front Seats', category: 'Comfort', description: 'Cooled air perforated seats.' },
  { id: 'feat-power-seats', name: 'Powered Driver Seat', category: 'Comfort', description: 'Electric seat position adjustment.' },
  { id: 'feat-rear-ac', name: 'Rear AC Vents', category: 'Comfort', description: 'Dedicated air vents for rear passengers.' },

  // Technology
  { id: 'feat-infotainment', name: 'Touchscreen Infotainment', category: 'Technology', description: 'Central HD touchscreen display.' },
  { id: 'feat-wireless-carplay', name: 'Wireless Android Auto & Apple CarPlay', category: 'Technology', description: 'Wireless smartphone projection.' },
  { id: 'feat-wireless-charger', name: 'Wireless Phone Charger', category: 'Technology', description: 'Inductive phone charging pad.' },
  { id: 'feat-digital-cluster', name: 'Digital Driver Display', category: 'Technology', description: 'Digital instrument cluster.' },
  { id: 'feat-bose-audio', name: 'Premium Bose / JBL Audio', category: 'Technology', description: 'Multi-speaker surround sound system.' },

  // Safety & ADAS
  { id: 'feat-airbags-6', name: '6 Airbags Standard', category: 'Safety', description: 'Front, side, and curtain airbags.' },
  { id: 'feat-esc', name: 'Electronic Stability Control (ESC)', category: 'Safety', description: 'Prevents skid and traction loss.' },
  { id: 'feat-adas-l2', name: 'Level-2 ADAS', category: 'Safety', description: 'Autonomous emergency braking, lane assist, adaptive cruise.' },
  { id: 'feat-isofix', name: 'ISOFIX Child Seat Mounts', category: 'Safety', description: 'Child safety seat anchors.' },

  // Parking & Exterior
  { id: 'feat-camera-360', name: '360° Surround View Camera', category: 'Parking', description: 'Birdseye view parking cameras.' },
  { id: 'feat-rear-camera', name: 'Rear Parking Camera', category: 'Parking', description: 'Reverse camera with dynamic guidelines.' },
  { id: 'feat-alloy-wheels', name: 'Precision Cut Alloy Wheels', category: 'Exterior', description: 'Lightweight alloy wheels.' },
  { id: 'feat-led-headlamps', name: 'Full LED Headlamps', category: 'Exterior', description: 'Bright LED headlights & DRLs.' }
];
