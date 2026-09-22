# DriveIQ — Vehicle Image Management System Documentation

This document explains how to manually manage, edit, and update vehicle photos across the entire **DriveIQ Automotive Intelligence Platform**.

---

## 📍 1. Central Location for Vehicle Data & Image Config

All vehicle data and image sources are stored in a single, clearly visible file:

📁 **[`src/data/vehicles.ts`](file:///c:/Users/NATIVE%20SOFTWARE/Desktop/Jay%20Patel/Car/src/data/vehicles.ts)**

Every vehicle record contains an `images` object configured like this:

```typescript
{
  id: 'hyundai-creta',
  name: 'Hyundai Creta',
  brand: 'Hyundai',

  // 📸 CENTRAL VEHICLE IMAGE CONFIGURATION
  images: {
    hero: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&q=80',
    front: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&q=80',
    side: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80',
    rear: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80',
    interior: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1200&q=80',
    dashboard: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&q=80'
  }
}
```

---

## 🖼️ 2. Two Options for Changing Vehicle Photos

### Option A: Using Web Image URLs (Easiest)
1. Copy any high-resolution image link from Google, Unsplash, Pexels, or manufacturer media rooms.
2. Open `src/data/vehicles.ts`.
3. Paste the URL into `images.hero`:
   ```typescript
   hero: "https://your-new-image-url.com/car-photo.jpg"
   ```
4. Save the file. The new image immediately updates everywhere on the website.

---

### Option B: Using Local Image Files on Your PC
1. Save your car photo inside your project's **`public/images/cars/`** folder.
   
   Folder structure:
   ```text
   public/
   └── images/
       └── cars/
           ├── creta/
           │   ├── hero.jpg
           │   ├── front.jpg
           │   ├── interior.jpg
           │   └── dashboard.jpg
           ├── nexon-ev/
           │   └── hero.jpg
           └── xuv700/
               └── hero.jpg
   ```
2. In `src/data/vehicles.ts`, point the path to `/images/cars/creta/hero.jpg`:
   ```typescript
   images: {
     hero: "/images/cars/creta/hero.jpg",
     front: "/images/cars/creta/front.jpg",
     interior: "/images/cars/creta/interior.jpg"
   }
   ```

---

## 🛡️ 3. Automatic Error Fallback Protection

DriveIQ includes an automatic fallback system implemented in [`VehicleImage.tsx`](file:///c:/Users/NATIVE%20SOFTWARE/Desktop/Jay%20Patel/Car/src/components/ui/VehicleImage.tsx).

- If an image link returns **404**, fails to load, or is blocked, DriveIQ automatically renders an elegant **Vehicle Image Unavailable** placeholder badge showing the car name and brand.
- The browser will **never** display a broken image icon.
- A warning will be printed to your browser's developer console for quick debugging.

---

## 🛠️ 4. Visual Admin Tool

You can also test image URLs visually using the built-in development studio:
👉 **`http://localhost:5174/admin/vehicle-images`**

Features:
- Live image URL test input.
- Real-time preview of any vehicle.
- Copy-paste ready TypeScript code snippet for `src/data/vehicles.ts`.
