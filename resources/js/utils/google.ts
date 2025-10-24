export async function loadGis(): Promise<void> {
  if ((window as any).google?.accounts?.oauth2) return;
  await new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true; s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load GIS'));
    document.head.appendChild(s);
  });
}

export async function loadGapiPicker(): Promise<void> {
  if ((window as any).gapi?.picker) return;
  await new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://apis.google.com/js/api.js';
    s.async = true; s.defer = true;
    s.onload = () => {
      (window as any).gapi.load('picker', () => resolve());
    };
    s.onerror = () => reject(new Error('Failed to load GAPI'));
    document.head.appendChild(s);
  });
}
