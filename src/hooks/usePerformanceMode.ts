import { useEffect, useState } from 'react';

interface NavigatorConnection {
  effectiveType?: string;
  saveData?: boolean;
  addEventListener?: (type: string, listener: () => void) => void;
  removeEventListener?: (type: string, listener: () => void) => void;
  addListener?: (listener: () => void) => void;
  removeListener?: (listener: () => void) => void;
}

interface PerformanceNavigator extends Navigator {
  deviceMemory?: number;
  connection?: NavigatorConnection;
}

export interface PerformanceProfile {
  isLowPower: boolean;
  shouldReduceMotion: boolean;
  webglSupported: boolean;
}

const checkWebglSupport = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return false;

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string | undefined;
      if (renderer && /(swiftshader|software|llvmpipe|angle)/i.test(renderer)) {
        return false;
      }
    }

    const loseContext = gl.getExtension('WEBGL_lose_context');
    loseContext?.loseContext();
    return true;
  } catch (error) {
    return false;
  }
};

const evaluateProfile = (): PerformanceProfile => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      isLowPower: false,
      shouldReduceMotion: false,
      webglSupported: true,
    };
  }

  const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
  const prefersReducedMotion = motionMedia.matches;

  const nav = navigator as PerformanceNavigator;
  const deviceMemory = nav.deviceMemory ?? 8;
  const hardwareConcurrency = typeof nav.hardwareConcurrency === 'number' ? nav.hardwareConcurrency : 8;
  const connectionType = nav.connection?.effectiveType ?? '4g';
  const savesData = Boolean(nav.connection?.saveData);
  const slowConnection = ['slow-2g', '2g', '3g'].includes(connectionType);
  const lowMemory = deviceMemory > 0 && deviceMemory <= 4;
  const lowCpu = hardwareConcurrency > 0 && hardwareConcurrency <= 4;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const webglSupported = checkWebglSupport();

  const isLowPower =
    prefersReducedMotion ||
    !webglSupported ||
    lowMemory ||
    lowCpu ||
    slowConnection ||
    savesData ||
    coarsePointer;

  return {
    isLowPower,
    shouldReduceMotion: prefersReducedMotion || isLowPower,
    webglSupported,
  };
};

export const usePerformanceMode = () => {
  const [profile, setProfile] = useState<PerformanceProfile>(() => ({
    isLowPower: false,
    shouldReduceMotion: false,
    webglSupported: true,
  }));

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const update = () => {
      setProfile(evaluateProfile());
    };

    update();

    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as PerformanceNavigator).connection;

    motionMedia.addEventListener?.('change', update);
    connection?.addEventListener?.('change', update);
    connection?.addListener?.(update);

    window.addEventListener('focus', update);
    window.addEventListener('resize', update);

    return () => {
      motionMedia.removeEventListener?.('change', update);
      connection?.removeEventListener?.('change', update);
      connection?.removeListener?.(update);
      window.removeEventListener('focus', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return profile;
};
