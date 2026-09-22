/*
================================================================================
DRIVEIQ — CENTRAL VEHICLE IMAGE CONFIGURATION DICTIONARY
================================================================================

HOW TO MANUALLY CHANGE ANY VEHICLE PHOTO IN DRIVEIQ:

1. Locate the vehicle ID or model slug in `VEHICLE_IMAGES_CONFIG` below.
2. Edit or add its `hero`, `front`, `side`, `rear`, `interior`, or `dashboard` URL.
3. Save this file and refresh your browser.

Editing a link here INSTANTLY updates the photo 100% EVERYWHERE across the platform
(Homepage, Cars Discovery, Search, Finder, Compare Matrix, Detail Pages, Garage, etc.).

EXAMPLES:
- Web URL:    hero: "https://your-domain.com/car-photo.jpg"
- Local File:  hero: "/images/cars/maruti/swift/hero.jpg"

================================================================================
*/

import { Vehicle, VehicleImageSet } from '../types/car';
import { getAllUIVehicles } from '../services/dataAdapter';

// CENTRAL EDITABLE IMAGE OVERRIDE DICTIONARY FOR VEHICLE MODELS
// Add or edit any vehicle key below to override its image across the site.
export const VEHICLE_IMAGES_CONFIG: Record<string, Partial<VehicleImageSet>> = {
  // MARUTI SUZUKI
  'model-alto-k10': {
    hero: 'https://imgd.aeplcdn.com/1920x1080/n/cw/ec/127563/alto-k10-exterior-right-front-three-quarter-63.png?isig=0&q=80&q=80'
  },
  'model-swift': {
    hero: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/159099/swift-exterior-right-front-three-quarter.jpeg?isig=0&q=80&q=80'
  },
  'model-dzire': {
    hero: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/45691/dzire-exterior-right-front-three-quarter-3.jpeg?isig=0&q=80&q=80'
  },
  'model-baleno': {
    hero: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/37710/baleno-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80&q=80'
  },
  'model-fronx': {
    hero: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/130583/fronx-exterior-right-front-three-quarter-109.jpeg?isig=0&q=80&q=80'
  },
  'model-brezza': {
    hero: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/122589/brezza-exterior-right-front-three-quarter-3.jpeg?isig=0&q=80&q=80'
  },

  // TATA MOTORS
  'model-nexon': {
    hero: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/141867/nexon-exterior-right-front-three-quarter-71.jpeg?isig=0&q=80&q=80'
  },
  'model-nexon-ev': {
    hero: 'https://imgd.aeplcdn.com/1920x1080/n/cw/ec/149123/nexon-ev-exterior-right-front-three-quarter-80.png?isig=0&q=80&q=80'
  },
  'model-punch': {
    hero: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/39015/punch-exterior-right-front-three-quarter-4.jpeg?isig=0&q=80&q=80'
  },
  'model-curvv': {
    hero: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/139651/curvv-exterior-right-front-three-quarter-4.jpeg?isig=0&q=80&q=80'
  },

  // MAHINDRA
  'model-thar': {
    hero: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/40087/thar-exterior-right-front-three-quarter-35.jpeg?isig=0&q=80&q=80'
  },
  'model-scorpio-n': {
    hero: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/40432/scorpio-n-exterior-right-front-three-quarter-75.jpeg?isig=0&q=80&q=80'
  },
  'model-xuv700': {
    hero: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/42355/xuv700-exterior-right-front-three-quarter-2.png?isig=0&q=80&q=80'
  },

  // HYUNDAI
  'model-creta': {
    hero: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/106815/creta-exterior-right-front-three-quarter-6.png?isig=0&q=80&q=80'
  },
  'model-venue': {
    hero: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/141113/venue-exterior-right-front-three-quarter-4.jpeg?isig=0&q=80&q=80'
  },

  // TOYOTA
  'model-fortuner': {
    hero: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/44709/fortuner-exterior-right-front-three-quarter-20.jpeg?isig=0&q=80&q=80'
  }
};

// Helper function to resolve image set for any vehicle ID flexibly
export function getVehicleImageSet(id: string, fallbackHero?: string): VehicleImageSet {
  const cleanId = id.toLowerCase();
  const strippedId = cleanId.replace(/^model-/, '');

  let config = VEHICLE_IMAGES_CONFIG[cleanId] 
            || VEHICLE_IMAGES_CONFIG[`model-${strippedId}`] 
            || VEHICLE_IMAGES_CONFIG[strippedId];

  if (!config) {
    const keys = Object.keys(VEHICLE_IMAGES_CONFIG);
    const matchKey = keys.find(k => {
      const normK = k.toLowerCase().replace(/^model-/, '');
      return normK === strippedId || cleanId.endsWith(normK) || strippedId.endsWith(normK);
    });
    if (matchKey) {
      config = VEHICLE_IMAGES_CONFIG[matchKey];
    }
  }

  // Primary image priority: Explicit Config -> Fallback (models.ts) -> Default Unsplash
  const heroUrl = config?.hero || fallbackHero || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80';

  return {
    hero: heroUrl,
    front: config?.front || heroUrl,
    side: config?.side || heroUrl,
    rear: config?.rear || heroUrl,
    interior: config?.interior || heroUrl,
    dashboard: config?.dashboard || heroUrl
  };
}

// Export complete vehicle dataset with synchronized image properties
export const VEHICLES_DATA: Vehicle[] = getAllUIVehicles().map(v => {
  const imgSet = getVehicleImageSet(v.id, v.image);
  return {
    ...v,
    image: imgSet.hero,
    images: imgSet
  };
});

export function getVehicleById(id: string): Vehicle | undefined {
  return VEHICLES_DATA.find(v => v.id === id);
}
