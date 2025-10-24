import { loadGapiPicker, loadGis } from '@/utils/google';

const MIME_FILTER = 'image/*,video/*';

type PickResult = { id: string; mimeType?: string; name?: string };

export async function pickDriveFile(
  keys: { apiKey: string; clientId: string }
): Promise<PickResult | null> {
  await Promise.all([loadGis(), loadGapiPicker()]);

  const google = (window as any).google;
  if (!google?.accounts?.oauth2) throw new Error('GIS not available');
  if (!(window as any).gapi?.picker) throw new Error('Picker not available');

  // 1) Get a front-end access token
  const accessToken: string = await new Promise((resolve, reject) => {
    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: keys.clientId,
      scope: 'https://www.googleapis.com/auth/drive.readonly',
      callback: (resp: any) => {
        console.debug('[GIS] token callback', resp);
        if (resp?.access_token) return resolve(resp.access_token);
        reject(new Error(resp?.error || 'No access token'));
      },
      error_callback: (err: any) => {
        console.error('[GIS] token error', err);
        reject(new Error('Token error'));
      },
    });

    try {
      tokenClient.requestAccessToken({ prompt: '' }); // silent if possible
    } catch (e) {
      console.error('[GIS] requestAccessToken threw', e);
      reject(e);
    }
  });

  // 2) Open Picker
  return new Promise<PickResult | null>((resolve) => {
    try {
      const picker = new google.picker.PickerBuilder()
        .setDeveloperKey(keys.apiKey)
        .setOAuthToken(accessToken)
        .setOrigin(window.location.origin)
        .setTitle('Select or Upload (images/videos)')
        .addView(
          new google.picker.DocsView(google.picker.ViewId.DOCS)
            .setIncludeFolders(false)
            .setSelectFolderEnabled(false)
            .setMimeTypes(MIME_FILTER)
        )
        .addView(
          new google.picker.DocsUploadView()
            .setIncludeFolders(false)
            .setSelectFolderEnabled(false)
            .setMimeTypes(MIME_FILTER)
        )
        .setCallback((data: any) => {
          console.debug('[Picker] callback', data);
          if (data?.action === google.picker.Action.PICKED) {
            const d = data.docs?.[0];
            return resolve(d ? { id: d.id, mimeType: d.mimeType, name: d.name } : null);
          }
          if (data?.action === google.picker.Action.CANCEL) return resolve(null);
        })
        .build();

      picker.setVisible(true);
    } catch (e) {
      console.error('[Picker] build/open failed', e);
      resolve(null);
    }
  });
}
