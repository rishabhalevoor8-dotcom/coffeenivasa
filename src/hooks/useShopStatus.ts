import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ShopSettings {
  openTime: string;
  closeTime: string;
  isManuallyOpen: boolean;
}

interface ShopStatus {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  isManuallyOpen: boolean;
  loading: boolean;
  refetch: () => Promise<void>;
}

const DEFAULT_SETTINGS: ShopSettings = {
  openTime: '06:00',
  closeTime: '00:00',
  isManuallyOpen: true,
};

export function useShopStatus(): ShopStatus {
  const [settings, setSettings] = useState<ShopSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    const { data } = await supabase
      .from('system_settings')
      .select('key, value')
      .in('key', ['shop_open_time', 'shop_close_time', 'shop_is_open']);

    if (data) {
      const newSettings = { ...DEFAULT_SETTINGS };
      data.forEach((setting) => {
        if (setting.key === 'shop_open_time') newSettings.openTime = setting.value;
        if (setting.key === 'shop_close_time') newSettings.closeTime = setting.value;
        if (setting.key === 'shop_is_open') newSettings.isManuallyOpen = setting.value === 'true';
      });
      setSettings(newSettings);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const isWithinOpenHours = useCallback(() => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [openHour, openMin] = settings.openTime.split(':').map(Number);
    const [closeHour, closeMin] = settings.closeTime.split(':').map(Number);

    const openMinutes = openHour * 60 + openMin;
    let closeMinutes = closeHour * 60 + closeMin;

    // Handle midnight case (00:00 means end of day)
    if (closeMinutes === 0) {
      closeMinutes = 24 * 60; // 24:00 = 1440 minutes
    }

    // Handle overnight case (e.g., open at 18:00, close at 02:00)
    if (closeMinutes < openMinutes) {
      // Shop is open overnight
      return currentMinutes >= openMinutes || currentMinutes < closeMinutes;
    }

    return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  }, [settings.openTime, settings.closeTime]);

  const isOpen = settings.isManuallyOpen && isWithinOpenHours();

  return {
    isOpen,
    openTime: settings.openTime,
    closeTime: settings.closeTime,
    isManuallyOpen: settings.isManuallyOpen,
    loading,
    refetch: fetchSettings,
  };
}

export function formatTime(time24: string): string {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}
