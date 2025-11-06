// features/drive/picker.ts
import { loadGapiPicker, loadGis } from '@/utils/google';

export type PickResult = { id: string; mimeType?: string; name?: string };

type PickerOptions = {
  multiple?: boolean;
  mimeTypes?: string[]; // e.g. ['image/png','image/jpeg','image/webp']
  title?: string;
};

export async function pickDriveFiles(
  keys: { apiKey: string; clientId: string },
  opts: PickerOptions = {}
): Promise<PickResult[]> {
  await Promise.all([loadGis(), loadGapiPicker()]);

  const google = (window as any).google;
  if (!google?.accounts?.oauth2) throw new Error('GIS not available');
  if (!(window as any).gapi?.picker) throw new Error('Picker not available');

  const accessToken: string = await new Promise((resolve, reject) => {
    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: keys.clientId,
      scope: 'https://www.googleapis.com/auth/drive.readonly',
      callback: (resp: any) =>
        resp?.access_token ? resolve(resp.access_token) : reject(new Error('No access token')),
      error_callback: (err: any) => reject(err),
    });
    tokenClient.requestAccessToken({ prompt: '' });
  });

  return new Promise<PickResult[]>((resolve) => {
    const docsView = new google.picker.DocsView(google.picker.ViewId.DOCS);

    // Optional: limit to certain MIME types (useful for photos)
    if (opts.mimeTypes?.length) {
      docsView.setMimeTypes(opts.mimeTypes.join(','));
    }

    const builder = new google.picker.PickerBuilder()
      .setDeveloperKey(keys.apiKey)
      .setOAuthToken(accessToken)
      .setOrigin(`${window.location.protocol}//${window.location.host}`)
      .setTitle(opts.title ?? 'Select files')
      .addView(docsView);

    // Enable multi-select when requested
    if (opts.multiple) {
      builder.enableFeature(google.picker.Feature.MULTISELECT_ENABLED);
    }

    const picker = builder
      .setCallback((data: any) => {
        if (data?.action === google.picker.Action.PICKED) {
          const files: PickResult[] = (data.docs ?? []).map((d: any) => ({
            id: d.id,
            mimeType: d.mimeType,
            name: d.name,
          }));
          return resolve(files);
        }
        if (data?.action === google.picker.Action.CANCEL) return resolve([]);
      })
      .build();

    picker.setVisible(true);
  });
}

// Backwards-compatible single-file helper (so your existing single pickers still work)
export async function pickDriveFile(
  keys: { apiKey: string; clientId: string },
  opts: Omit<PickerOptions, 'multiple'> = {}
) {
  const files = await pickDriveFiles(keys, { ...opts, multiple: false });
  return files[0] ?? null;
}
