import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IdPickerButton } from '@/components/drive/IdPickerButton';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Events', href: '/admin/events' },
  { title: 'Settings', href: '#' },
];

interface Settings {
  cover_image_id: string;
  slogan: string;
  contact_title?: string;
  contact_message?: string;
}

interface Props {
  settings?: Settings;
}

interface FormData {
  cover_image_id: string;
  slogan: string;
  contact_title: string;
  contact_message: string;
}

export default function EventSettings({ settings }: Props) {
  const { data, setData, put, processing, errors } = useForm<FormData>({
    cover_image_id: settings?.cover_image_id || '',
    slogan: settings?.slogan || '',
    contact_title: settings?.contact_title || '',
    contact_message: settings?.contact_message || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put('/admin/event-settings');
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Event Settings" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Event Settings</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cover_image_id">Cover Image ID (Google Drive) *</Label>
                <div className="flex gap-2">
                  <Input
                    id="cover_image_id"
                    value={data.cover_image_id}
                    onChange={(e) => setData('cover_image_id', e.target.value)}
                    placeholder="Enter Google Drive file ID"
                  />
                  <IdPickerButton onPick={(id) => setData('cover_image_id', id)} />
                </div>
                {errors.cover_image_id && (
                  <p className="text-sm text-destructive">{errors.cover_image_id}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slogan">Slogan *</Label>
                <Input
                  id="slogan"
                  value={data.slogan}
                  onChange={(e) => setData('slogan', e.target.value)}
                  placeholder="Enter slogan"
                />
                {errors.slogan && (
                  <p className="text-sm text-destructive">{errors.slogan}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact_title">Contact Title</Label>
                <Input
                  id="contact_title"
                  value={data.contact_title}
                  onChange={(e) => setData('contact_title', e.target.value)}
                  placeholder="e.g., CONTACT"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_message">Contact Message</Label>
                <Textarea
                  id="contact_message"
                  value={data.contact_message}
                  onChange={(e) => setData('contact_message', e.target.value)}
                  placeholder="Enter contact message"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? 'Updating...' : 'Update Settings'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
