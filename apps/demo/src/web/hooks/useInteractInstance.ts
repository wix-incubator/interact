import { useEffect } from 'react';
import { Interact, type InteractConfig } from '@wix/interact/web';

export const useInteractInstance = (
  config: InteractConfig,
  keyOrOptions?: number | { useCutsomElement?: boolean },
  options?: { useCutsomElement?: boolean },
) => {
  // Support both (config, options) and (config, key, options) signatures
  const key = typeof keyOrOptions === 'number' ? keyOrOptions : undefined;
  const opts = typeof keyOrOptions === 'object' ? keyOrOptions : options;

  useEffect(() => {
    const instance = Interact.create(config, opts);

    return () => {
      instance.destroy();
    };
  }, [config, opts, key]);
};
