import { loadGapiPicker, loadGis } from '@/utils/google';

type PickResult = { id: string; mimeType?: string; name?: string };

export async function pickDriveFile(
  keys: { apiKey: string; clientId: string }
): Promise<PickResult | null> {
  await Promise.all([loadGis(), loadGapiPicker()]);

  const google = (window as any).google;
  if (!google?.accounts?.oauth2) throw new Error('GIS not available');
  if (!(window as any).gapi?.picker) throw new Error('Picker not available');

  // 1) short-lived front-end token
  const accessToken: string = await new Promise((resolve, reject) => {
    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: keys.clientId,
      scope: 'https://www.googleapis.com/auth/drive.readonly',
      callback: (resp: any) => {
        if (resp?.access_token) return resolve(resp.access_token);
        reject(new Error('No access token'));
      },
      error_callback: (err: any) => reject(err),
    });
    tokenClient.requestAccessToken({ prompt: '' });
  });

  // 2) build Picker (no MIME restrictions)
  return new Promise<PickResult | null>((resolve) => {
    const docsView = new google.picker.DocsView(google.picker.ViewId.DOCS);
    const uploadView = new google.picker.DocsUploadView();

    const picker = new google.picker.PickerBuilder()
      .setDeveloperKey(keys.apiKey)
      .setOAuthToken(accessToken)
      .setOrigin(`${window.location.protocol}//${window.location.host}`)
      .setTitle('Select or Upload File')
      .addView(docsView)
      .addView(uploadView)
      .setCallback((data: any) => {
        if (data?.action === google.picker.Action.PICKED) {
          const d = data.docs?.[0];
          return resolve(d ? { id: d.id, mimeType: d.mimeType, name: d.name } : null);
        }
        if (data?.action === google.picker.Action.CANCEL) return resolve(null);
      })
      .build();

    picker.setVisible(true);
  });
}
