import { useEffect } from 'react';
import { Interact, type InteractConfig } from '@wix/interact/react';

export const useInteractInstance = (config: InteractConfig) => {
  useEffect(() => {
    const instance = Interact.create(config);

    return () => {
      instance.destroy();
    };
  }, [config]);
};

