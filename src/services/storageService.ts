import { UserProfile, TestDriveEnquiry } from '../types/car';

const KEYS = {
  THEME: 'driveiq_theme',
  PROFILE: 'driveiq_user_profile',
  SHORTLIST: 'driveiq_shortlist_ids',
  COMPARE: 'driveiq_compare_ids',
  TEST_DRIVES: 'driveiq_test_drives',
  PURCHASE_STAGE: 'driveiq_purchase_stage',
  SAVED_CALCS: 'driveiq_saved_calcs'
};

export const DEFAULT_USER_PROFILE: UserProfile = {
  budgetLakhs: 15,
  fuelPreference: 'Petrol',
  transmissionPreference: 'Any Automatic',
  cityPercentage: 60,
  highwayPercentage: 40,
  hillsPercentage: 0,
  monthlyKm: 1500,
  familySize: 5,
  bootRequirement: 'Large',
  priorities: ['Safety', 'Mileage', 'Comfort', 'Features', 'Reliability', 'Resale']
};

export const storageService = {
  getTheme(): 'dark' | 'light' {
    const val = localStorage.getItem(KEYS.THEME);
    return (val === 'light' || val === 'dark') ? val : 'dark';
  },
  setTheme(theme: 'dark' | 'light'): void {
    localStorage.setItem(KEYS.THEME, theme);
  },

  getProfile(): UserProfile {
    try {
      const val = localStorage.getItem(KEYS.PROFILE);
      return val ? JSON.parse(val) : DEFAULT_USER_PROFILE;
    } catch {
      return DEFAULT_USER_PROFILE;
    }
  },
  saveProfile(profile: UserProfile): void {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  },

  getShortlist(): string[] {
    try {
      const val = localStorage.getItem(KEYS.SHORTLIST);
      return val ? JSON.parse(val) : ['hyundai-creta', 'tata-nexon-ev'];
    } catch {
      return ['hyundai-creta', 'tata-nexon-ev'];
    }
  },
  toggleShortlist(carId: string): string[] {
    const list = this.getShortlist();
    const exists = list.includes(carId);
    const updated = exists ? list.filter(id => id !== carId) : [...list, carId];
    localStorage.setItem(KEYS.SHORTLIST, JSON.stringify(updated));
    return updated;
  },

  getCompareList(): string[] {
    try {
      const val = localStorage.getItem(KEYS.COMPARE);
      return val ? JSON.parse(val) : ['hyundai-creta', 'kia-seltos'];
    } catch {
      return ['hyundai-creta', 'kia-seltos'];
    }
  },
  toggleCompare(carId: string): string[] {
    const list = this.getCompareList();
    if (list.includes(carId)) {
      const updated = list.filter(id => id !== carId);
      localStorage.setItem(KEYS.COMPARE, JSON.stringify(updated));
      return updated;
    } else {
      if (list.length >= 3) {
        // limit 3
        const updated = [...list.slice(1), carId];
        localStorage.setItem(KEYS.COMPARE, JSON.stringify(updated));
        return updated;
      }
      const updated = [...list, carId];
      localStorage.setItem(KEYS.COMPARE, JSON.stringify(updated));
      return updated;
    }
  },

  getTestDrives(): TestDriveEnquiry[] {
    try {
      const val = localStorage.getItem(KEYS.TEST_DRIVES);
      return val ? JSON.parse(val) : [];
    } catch {
      return [];
    }
  },
  addTestDrive(enquiry: Omit<TestDriveEnquiry, 'id' | 'createdAt' | 'status'>): TestDriveEnquiry {
    const list = this.getTestDrives();
    const newEnquiry: TestDriveEnquiry = {
      ...enquiry,
      id: `td-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Confirmed'
    };
    const updated = [newEnquiry, ...list];
    localStorage.setItem(KEYS.TEST_DRIVES, JSON.stringify(updated));
    return newEnquiry;
  },

  getPurchaseStage(): string {
    return localStorage.getItem(KEYS.PURCHASE_STAGE) || 'SHORTLIST';
  },
  setPurchaseStage(stage: string): void {
    localStorage.setItem(KEYS.PURCHASE_STAGE, stage);
  }
};
