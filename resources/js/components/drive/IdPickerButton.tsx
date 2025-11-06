// components/drive/IdPickerButton.tsx
import React from 'react';
import { usePage } from '@inertiajs/react';
import { pickDriveFile, pickDriveFiles, type PickResult } from '@/features/drive/picker';

type Props = {
  label?: string;
  multiple?: boolean;
  mimeTypes?: string[];
  onPick?: (id: string) => void;
  onPickMany?: (ids: string[]) => void; // returns IDs only for convenience
};

type PageProps = { google: { apiKey: string; clientId: string } };

export const IdPickerButton: React.FC<Props> = ({
  onPick,
  onPickMany,
  label = 'Pick',
  multiple = false,
  mimeTypes,
}) => {
  const { google } = usePage<PageProps>().props;

  const onClick = async () => {
    try {
      if (multiple) {
        const files: PickResult[] = await pickDriveFiles(
          { apiKey: google.apiKey, clientId: google.clientId },
          { multiple: true, mimeTypes, title: 'Select images' }
        );
        if (files.length && onPickMany) onPickMany(files.map((f) => f.id));
      } else {
        const file = await pickDriveFile(
          { apiKey: google.apiKey, clientId: google.clientId },
          { mimeTypes, title: 'Select file' }
        );
        if (file?.id && onPick) onPick(file.id);
      }
    } catch (e) {
      console.error(e);
      alert('Google Drive Picker failed to open. Check API key/client ID and OAuth consent screen.');
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center rounded border px-2 py-1 text-sm"
    >
      {label}
    </button>
  );
};
