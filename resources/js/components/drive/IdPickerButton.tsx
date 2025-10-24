import React from 'react';
import { usePage } from '@inertiajs/react';
import { pickDriveFile } from '@/features/drive/picker';

type Props = { onPick: (id: string) => void; label?: string };
type PageProps = { google: { apiKey: string; clientId: string } };

export const IdPickerButton: React.FC<Props> = ({ onPick, label = 'Pick' }) => {
  const { google } = usePage<PageProps>().props;

  const onClick = async () => {
    try {
      const file = await pickDriveFile({ apiKey: google.apiKey, clientId: google.clientId });
      if (file?.id) onPick(file.id);
    } catch (e) {
      console.error(e);
      alert('Google Drive Picker failed to open. Check API key/client ID and OAuth consent screen.');
    }
  };

  return (
    <button type="button" onClick={onClick} className="inline-flex items-center rounded border px-2 py-1 text-sm">
      {label}
    </button>
  );
};
