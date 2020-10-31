import { useEffect, useState } from 'react';

export function useImage(url: string): { isLoaded: boolean } {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const onLoad = () => {
    setIsLoaded(true);
  };

  useEffect(() => {
    setIsLoaded(false);
    const image = new Image();
    image.addEventListener('load', onLoad);
    image.setAttribute('src', url);
    return () => {
      image.removeEventListener('load', onLoad);
    };
  }, [url]);

  return { isLoaded };
}
