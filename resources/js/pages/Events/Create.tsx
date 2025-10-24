import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { IdPickerButton } from '@/components/drive/IdPickerButton';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Events', href: '/admin/events' },
  { title: 'Create', href: '#' },
];

interface FormData {
  title: string;
  description: string;
  cover_image_id: string;
  order: number;
  is_active: boolean;
  gallery: string[];
}

export default function EventCreate() {
  const { data, setData, post, processing, errors } = useForm<FormData>({
    title: '',
    description: '',
    cover_image_id: '',
    order: 0,
    is_active: true,
    gallery: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/events');
  };

  const addGalleryImage = () => {
    setData('gallery', [...data.gallery, '']);
  };

  const updateGalleryImage = (index: number, value: string) => {
    const newGallery = [...data.gallery];
    newGallery[index] = value;
    setData('gallery', newGallery);
  };

  const removeGalleryImage = (index: number) => {
    setData('gallery', data.gallery.filter((_, i) => i !== index));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Event" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Create Event</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={data.title}
                  onChange={(e) => setData('title', e.target.value)}
                  placeholder="Enter event title"
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  placeholder="Enter event description"
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description}</p>
                )}
              </div>

              {/* Cover Image ID + Picker */}
              <div className="space-y-2">
                <Label htmlFor="cover_image_id">Cover Image ID (Google Drive)</Label>
                <div className="flex gap-2">
                  <Input
                    id="cover_image_id"
                    value={data.cover_image_id}
                    onChange={(e) => setData('cover_image_id', e.target.value)}
                    placeholder="Enter Google Drive file ID"
                  />
                  <IdPickerButton onPick={(id) => setData('cover_image_id', id)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="order">Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={data.order}
                    onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="is_active">Active</Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="is_active"
                      type="checkbox"
                      checked={data.is_active}
                      onChange={(e) => setData('is_active', e.target.checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gallery Images */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Gallery Images</CardTitle>
                <Button type="button" onClick={addGalleryImage} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Image
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.gallery.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No images added yet. Click "Add Image" to get started.
                </p>
              ) : (
                data.gallery.map((imageId, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={imageId}
                      onChange={(e) => updateGalleryImage(index, e.target.value)}
                      placeholder="Enter Google Drive file ID"
                    />
                    <IdPickerButton onPick={(id) => updateGalleryImage(index, id)} />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeGalleryImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
