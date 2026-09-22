import { CARS_DATA } from '../data/cars';
import { UserProfile } from '../types/car';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedCars?: string[]; // Vehicle IDs
}

export function generateAIAdvisorResponse(
  query: string,
  userProfile?: UserProfile
): { responseText: string; suggestedCarIds: string[] } {
  const q = query.toLowerCase().trim();
  const suggestedCarIds: string[] = [];

  // Query Parsing & Deterministic Intent Engine
  if (q.includes('creta') && q.includes('seltos')) {
    suggestedCarIds.push('hyundai-creta', 'kia-seltos');
    return {
      responseText: `**Creta vs Seltos Comparison:**
Both SUVs share the same platform and engine options, but differ significantly in tuning and feature packaging:
- **Hyundai Creta**: Focuses on **plush ride comfort**, softer suspension compliance, superior noise insulation, and higher resale demand.
- **Kia Seltos**: Focuses on **aggressive modern styling**, slightly stiffer sporty suspension, 160 PS Turbo Petrol engine, and dual-zone climate control.

*Recommendation*: If your top priority is ride comfort and smooth urban commuting, go for **Creta**. If you want aggressive styling and sharp turbo handling, choose **Seltos**.`,
      suggestedCarIds
    };
  }

  if (q.includes('ev') || q.includes('electric')) {
    suggestedCarIds.push('tata-nexon-ev', 'tata-curvv-ev');
    return {
      responseText: `**EV Viability Analysis:**
- For driving **1,000–2,000 km/month**, an EV saves you **₹6,000–₹12,000 per month** in fuel compared to a Petrol SUV.
- Charging costs average **~₹1.1 per km** (home charging) vs **₹6.5 per km** for Petrol.
- **Top EV Recommendations**:
  1. **Tata Nexon EV**: 5-Star Bharat NCAP safety, ~300-350 km real range, ideal for urban commuting.
  2. **Tata Curvv EV**: 55 kWh battery, ~420 km real highway range, Level-2 ADAS.`,
      suggestedCarIds
    };
  }

  if (q.includes('15') || q.includes('15 lakh') || q.includes('under 15')) {
    const under15Cars = CARS_DATA.filter(c => c.startingPriceLakhs <= 15);
    under15Cars.forEach(c => suggestedCarIds.push(c.id));

    return {
      responseText: `Here are the top automatic SUVs and sedans available under **₹15 Lakhs**:
1. **Maruti Brezza ZXi Plus / VXi AT** (₹11.15L – ₹13.98L): 4-Star safety, ultra-reliable 1.5L NA petrol, 6-speed torque converter.
2. **Hyundai Creta S(O) IVT** (₹15.8L): Smooth CVT automatic, panoramic sunroof, superior ride comfort.
3. **Honda City VX CVT** (₹14.85L): Executive sedan, Honda Sensing ADAS, 506L boot space.
4. **Maruti Grand Vitara Delta CNG/Hybrid** (₹13.15L – ₹14.5L): Up to 27.97 km/l fuel efficiency.`,
      suggestedCarIds
    };
  }

  if (q.includes('variant') || q.includes('adas') || q.includes('sunroof')) {
    suggestedCarIds.push('hyundai-creta', 'mahindra-xuv700', 'honda-city');
    return {
      responseText: `**Variant Selection Advice:**
- If you specifically want **Level-2 ADAS without compromising safety**:
  - **Honda City VX CVT** (₹14.85L): ADAS standard in sedan format.
  - **Hyundai Creta SX Tech ADAS** (₹18.9L): Full suite ADAS + Panoramic Sunroof.
  - **Mahindra XUV700 AX7** (₹24.5L): Level-2 ADAS with 200 PS engine.
Use our **Variant Finder Tool** (/variants) to check exact feature inclusions per trim.`,
      suggestedCarIds
    };
  }

  // Fallback response using active user profile context
  const topMatchCars = CARS_DATA.slice(0, 3);
  topMatchCars.forEach(c => suggestedCarIds.push(c.id));

  const budgetStr = userProfile ? `₹${userProfile.budgetLakhs} Lakhs` : '₹15 Lakhs';
  const fuelStr = userProfile ? userProfile.fuelPreference : 'Petrol';

  return {
    responseText: `Based on current automotive intelligence data and your budget of ${budgetStr} (${fuelStr}):
1. **Hyundai Creta**: Best overall for comfort, feature list, and resale retention.
2. **Tata Nexon EV**: Best for minimum running cost and 5-Star Bharat NCAP safety.
3. **Maruti Grand Vitara**: Best for maximum fuel economy (27.97 km/l hybrid) and low maintenance.

You can ask me specific questions like:
- *"Creta vs Seltos?"*
- *"Is EV worth it for 1500 km/month?"*
- *"Best automatic SUV under ₹15 Lakhs?"*`,
    suggestedCarIds
  };
}
