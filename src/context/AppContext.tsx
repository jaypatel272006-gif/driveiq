import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, TestDriveEnquiry } from '../types/car';
import { storageService, DEFAULT_USER_PROFILE } from '../services/storageService';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface AppContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  userProfile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
  shortlistIds: string[];
  toggleShortlist: (carId: string) => void;
  isShortlisted: (carId: string) => boolean;
  compareIds: string[];
  toggleCompare: (carId: string) => void;
  isInCompare: (carId: string) => boolean;
  clearCompare: () => void;
  testDrives: TestDriveEnquiry[];
  addTestDrive: (enquiry: Omit<TestDriveEnquiry, 'id' | 'createdAt' | 'status'>) => void;
  purchaseStage: string;
  setPurchaseStage: (stage: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isAIAdvisorOpen: boolean;
  setIsAIAdvisorOpen: (open: boolean) => void;
  testDriveModalData: { carId: string; carName: string; variantName?: string } | null;
  openTestDriveModal: (carId: string, carName: string, variantName?: string) => void;
  closeTestDriveModal: () => void;
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<'dark' | 'light'>(storageService.getTheme());
  const [userProfile, setUserProfileState] = useState<UserProfile>(storageService.getProfile());
  const [shortlistIds, setShortlistIds] = useState<string[]>(storageService.getShortlist());
  const [compareIds, setCompareIds] = useState<string[]>(storageService.getCompareList());
  const [testDrives, setTestDrives] = useState<TestDriveEnquiry[]>(storageService.getTestDrives());
  const [purchaseStage, setPurchaseStageState] = useState<string>(storageService.getPurchaseStage());
  
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isAIAdvisorOpen, setIsAIAdvisorOpen] = useState<boolean>(false);
  const [testDriveModalData, setTestDriveModalData] = useState<{ carId: string; carName: string; variantName?: string } | null>(null);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
    storageService.setTheme(theme);
  }, [theme]);

  // Global Keyboard Command Listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setThemeState(next);
    showToast(`Switched to ${next === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
  };

  const updateProfile = (partial: Partial<UserProfile>) => {
    const updated = { ...userProfile, ...partial };
    setUserProfileState(updated);
    storageService.saveProfile(updated);
  };

  const toggleShortlist = (carId: string) => {
    const updated = storageService.toggleShortlist(carId);
    setShortlistIds(updated);
    const added = updated.includes(carId);
    showToast(added ? 'Added to My Garage shortlist' : 'Removed from shortlist', added ? 'success' : 'info');
  };

  const isShortlisted = (carId: string) => shortlistIds.includes(carId);

  const toggleCompare = (carId: string) => {
    const updated = storageService.toggleCompare(carId);
    setCompareIds(updated);
    const added = updated.includes(carId);
    showToast(added ? `Car added to comparison (${updated.length}/3)` : 'Removed from comparison', added ? 'success' : 'info');
  };

  const isInCompare = (carId: string) => compareIds.includes(carId);

  const clearCompare = () => {
    setCompareIds([]);
    localStorage.setItem('driveiq_compare_ids', JSON.stringify([]));
    showToast('Comparison list cleared', 'info');
  };

  const addTestDrive = (enquiry: Omit<TestDriveEnquiry, 'id' | 'createdAt' | 'status'>) => {
    const created = storageService.addTestDrive(enquiry);
    setTestDrives(prev => [created, ...prev]);
    showToast(`Test Drive confirmed for ${created.carName}! Added to Garage.`, 'success');
  };

  const setPurchaseStage = (stage: string) => {
    setPurchaseStageState(stage);
    storageService.setPurchaseStage(stage);
    showToast(`Journey stage updated to ${stage}`, 'info');
  };

  const openTestDriveModal = (carId: string, carName: string, variantName?: string) => {
    setTestDriveModalData({ carId, carName, variantName });
  };

  const closeTestDriveModal = () => {
    setTestDriveModalData(null);
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        userProfile,
        updateProfile,
        shortlistIds,
        toggleShortlist,
        isShortlisted,
        compareIds,
        toggleCompare,
        isInCompare,
        clearCompare,
        testDrives,
        addTestDrive,
        purchaseStage,
        setPurchaseStage,
        isSearchOpen,
        setIsSearchOpen,
        isAIAdvisorOpen,
        setIsAIAdvisorOpen,
        testDriveModalData,
        openTestDriveModal,
        closeTestDriveModal,
        toasts,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
