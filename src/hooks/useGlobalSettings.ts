import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Settings = Record<string, any>;

export const useGlobalSettings = () => {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const isMountedRef = useRef(true);

  const fetchSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('global_settings').select('key, value');
      if (!isMountedRef.current) return;

      if (error) {
        console.error('Failed to fetch settings:', error.message);
        setLoading(false);
        return;
      }

      const nextSettings: Settings = {};
      (data ?? []).forEach((row: any) => {
        nextSettings[row.key] = row.value;
      });

      setSettings(nextSettings);
    } catch (err) {
      console.error('Settings fetch error:', err);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    void fetchSettings();

    const channel = supabase
      .channel('global_settings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'global_settings' }, () => {
        if (isMountedRef.current) {
          void fetchSettings();
        }
      })
      .subscribe();

    return () => {
      isMountedRef.current = false;
      supabase.removeChannel(channel);
    };
  }, [fetchSettings]);

  const getSetting = useCallback((key: string, fallback: any = null) => {
    return settings[key] ?? fallback;
  }, [settings]);

  const updateSetting = useCallback(async (key: string, value: any) => {
    try {
      const { error } = await supabase
        .from('global_settings')
        .upsert({ key, value }, { onConflict: 'key' });

      if (error) {
        console.error(`Failed to update setting "${key}":`, error.message);
        return { error: { message: error.message } };
      }

      setSettings((prev) => ({ ...prev, [key]: value }));
      return { error: null };
    } catch (err: any) {
      console.error(`Unexpected update error for "${key}":`, err);
      return { error: { message: err?.message || 'Unknown error' } };
    }
  }, []);

  return { settings, loading, getSetting, updateSetting, refetch: fetchSettings };
};
