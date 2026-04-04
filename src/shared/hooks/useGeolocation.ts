import { useState, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

/**
 * Shared hook to retrieve high-precision device coordinates.
 * Used for core spiritual features like Prayer Times and Qibla Finder.
 */
export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(s => ({ ...s, error: "Geolocation not supported", loading: false }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (error) => {
        setState(s => ({ ...s, error: error.message, loading: false }));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 1000 * 60 * 60 }
    );
  }, []);

  return state;
}
