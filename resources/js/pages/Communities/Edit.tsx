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

interface CommunityGallery {
  id: number;
  image_id: string;
}

interface Community {
  id: number;
  title: string;
  slug: string;
  city: string;
  address: string;
  latitude?: number;
  longitude?: number;
  card_image_id: string;
  video_id?: string;
  community_features?: string;
  starting_price: string;
  order: number;
  is_active: boolean;
  gallery: CommunityGallery[];
}

interface Props {
  community: Community;
}

interface FormData {
  title: string;
  city: string;
  address: string;
  latitude: string;
  longitude: string;
  card_image_id: string;
  video_id: string;
  community_features: string;
  starting_price: string;
  order: number;
  is_active: boolean;
  gallery: string[];
}

export default function CommunityEdit({ community }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Communities', href: '/admin/communities' },
    { title: 'Edit', href: '#' },
  ];

  const { data, setData, put, processing, errors } = useForm<FormData>({
    title: community.title || '',
    city: community.city || '',
    address: community.address || '',
    latitude: community.latitude?.toString() || '',
    longitude: community.longitude?.toString() || '',
    card_image_id: community.card_image_id || '',
    video_id: community.video_id || '',
    community_features: community.community_features || '',
    starting_price: community.starting_price || '',
    order: community.order || 0,
    is_active: community.is_active,
    gallery: community.gallery?.map((g) => g.image_id) || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/admin/communities/${community.id}`);
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
      <Head title={`Edit Community - ${community.title}`} />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Edit Community</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="Enter community title"
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Current slug: <code>{community.slug}</code>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={data.city}
                    onChange={(e) => setData('city', e.target.value)}
                    placeholder="Enter city name"
                  />
                  {errors.city && (
                    <p className="text-sm text-destructive">{errors.city}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={data.address}
                  onChange={(e) => setData('address', e.target.value)}
                  placeholder="Enter full address"
                  rows={3}
                />
                {errors.address && (
                  <p className="text-sm text-destructive">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={data.latitude}
                    onChange={(e) => setData('latitude', e.target.value)}
                    placeholder="39.8814"
                  />
                  {errors.latitude && (
                    <p className="text-sm text-destructive">{errors.latitude}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={data.longitude}
                    onChange={(e) => setData('longitude', e.target.value)}
                    placeholder="-83.0930"
                  />
                  {errors.longitude && (
                    <p className="text-sm text-destructive">{errors.longitude}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="starting_price">Starting Price *</Label>
                <Input
                  id="starting_price"
                  value={data.starting_price}
                  onChange={(e) => setData('starting_price', e.target.value)}
                  placeholder="e.g., $500,000"
                />
                {errors.starting_price && (
                  <p className="text-sm text-destructive">{errors.starting_price}</p>
                )}
              </div>

              {/* Card Image ID + Single Picker */}
              <div className="space-y-2">
                <Label htmlFor="card_image_id">Card Image ID (Google Drive) *</Label>
                <div className="flex gap-2">
                  <Input
                    id="card_image_id"
                    value={data.card_image_id}
                    onChange={(e) => setData('card_image_id', e.target.value)}
                    placeholder="Enter Google Drive file ID"
                  />
                  <IdPickerButton onPick={(id) => setData('card_image_id', id)} />
                </div>
                {errors.card_image_id && (
                  <p className="text-sm text-destructive">{errors.card_image_id}</p>
                )}
              </div>

              {/* Video ID + Single Picker */}
              <div className="space-y-2">
                <Label htmlFor="video_id">Video ID (Google Drive)</Label>
                <div className="flex gap-2">
                  <Input
                    id="video_id"
                    value={data.video_id}
                    onChange={(e) => setData('video_id', e.target.value)}
                    placeholder="Enter Google Drive video file ID"
                  />
                  <IdPickerButton onPick={(id) => setData('video_id', id)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="community_features">Community Features</Label>
                <Textarea
                  id="community_features"
                  value={data.community_features}
                  onChange={(e) => setData('community_features', e.target.value)}
                  placeholder="Enter community features"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="order">Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={data.order}
                    onChange={(e) =>
                      setData('order', parseInt(e.target.value) || 0)
                    }
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={data.is_active}
                    onCheckedChange={(checked) => setData('is_active', checked)}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gallery Images */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Gallery Images</CardTitle>
                <div className="flex gap-2">
                  {/* NEW: Multi-select button that auto-appends all IDs */}
                  <IdPickerButton
                    multiple
                    label="Pick from Drive (multi)"
                    mimeTypes={['image/jpeg', 'image/png', 'image/webp']}
                    onPickMany={(ids) => setData('gallery', [...data.gallery, ...ids])}
                  />
                  <Button type="button" onClick={addGalleryImage} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Image
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.gallery.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No images added yet. Use “Pick from Drive (multi)” to add many at once, or click “Add Image”.
                </p>
              ) : (
                data.gallery.map((imageId, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={imageId}
                      onChange={(e) => updateGalleryImage(index, e.target.value)}
                      placeholder="Enter Google Drive file ID"
                    />
                    {/* Keep per-row single picker */}
                    <IdPickerButton
                      label="Pick"
                      onPick={(id) => updateGalleryImage(index, id)}
                      mimeTypes={['image/jpeg', 'image/png', 'image/webp']}
                    />
                    {/* Optional per-row multi insert */}
                    <IdPickerButton
                      multiple
                      label="Multi"
                      mimeTypes={['image/jpeg', 'image/png', 'image/webp']}
                      onPickMany={(ids) => {
                        if (!ids.length) return;
                        const newGallery = [...data.gallery];
                        // Replace current slot with first, insert the rest after
                        newGallery.splice(index, 1, ids[0]);
                        if (ids.length > 1) newGallery.splice(index + 1, 0, ...ids.slice(1));
                        setData('gallery', newGallery);
                      }}
                    />
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
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? 'Updating...' : 'Update Community'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
