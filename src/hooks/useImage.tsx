import { useEffect, useState } from 'react';

export function useImage(
  url: string
): { isLoaded: boolean; hasError: boolean; isLoading: boolean } {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const onLoad = () => {
    setIsLoaded(true);
    setIsLoading(false);
  };

  const onError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  useEffect(() => {
    const image = new Image();
    image.addEventListener('load', onLoad);
    image.addEventListener('error', onError);
    image.setAttribute('src', url);
    return () => {
      image.removeEventListener('load', onLoad);
      image.removeEventListener('error', onError);
      setIsLoaded(false);
      setHasError(false);
      setIsLoading(true);
    };
  }, [url]);

  return { isLoaded, hasError, isLoading };
}
