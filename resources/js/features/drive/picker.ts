import { loadGapiPicker, loadGis } from '@/utils/google';

const MIME_FILTER = 'image/*,video/*';

type PickResult = { id: string; mimeType?: string; name?: string };

export async function pickDriveFile(
  keys: { apiKey: string; clientId: string }
): Promise<PickResult | null> {
  await Promise.all([loadGis(), loadGapiPicker()]);

  const google = (window as any).google;

  const accessToken: string = await new Promise((resolve, reject) => {
    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: keys.clientId,
      scope: 'https://www.googleapis.com/auth/drive.readonly',
      callback: (resp: any) =>
        resp?.access_token ? resolve(resp.access_token) : reject(new Error('No access token')),
    });
    tokenClient.requestAccessToken({ prompt: '' }); // silent if possible; will prompt if needed
  });

  return new Promise<PickResult | null>((resolve) => {
    const picker = new google.picker.PickerBuilder()
      .setOAuthToken(accessToken)
      .setDeveloperKey(keys.apiKey)
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
