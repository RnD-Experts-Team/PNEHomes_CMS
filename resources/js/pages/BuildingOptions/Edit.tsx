import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IdPickerButton } from '@/components/drive/IdPickerButton';

interface BuildingOption {
  id: number;
  title: string;
  description?: string;
  section_image_id: string;
  order: number;
  is_active: boolean;
}

interface Props {
  option: BuildingOption;
}

interface FormData {
  title: string;
  description: string;
  section_image_id: string;
  order: number;
  is_active: boolean;
}

export default function BuildingOptionEdit({ option }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Building Options', href: '/admin/building-options' },
    { title: 'Edit', href: '#' },
  ];

  const { data, setData, put, processing, errors } = useForm<FormData>({
    title: option.title || '',
    description: option.description || '',
    section_image_id: option.section_image_id || '',
    order: option.order || 0,
    is_active: option.is_active,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/admin/building-options/${option.id}`);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Building Option - ${option.title}`} />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Edit Building Option</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Option Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={data.title}
                  onChange={(e) => setData('title', e.target.value)}
                  placeholder="Enter option title"
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  placeholder="Enter option description"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="section_image_id">Section Image ID (Google Drive) *</Label>
                <div className="flex gap-2">
                  <Input
                    id="section_image_id"
                    value={data.section_image_id}
                    onChange={(e) => setData('section_image_id', e.target.value)}
                    placeholder="Enter Google Drive file ID"
                  />
                  <IdPickerButton onPick={(id) => setData('section_image_id', id)} />
                </div>
                {errors.section_image_id && (
                  <p className="text-sm text-destructive">{errors.section_image_id}</p>
                )}
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

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? 'Updating...' : 'Update Option'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
