import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { IdPickerButton } from '@/components/drive/IdPickerButton';

interface Service {
  id: number;
  title?: string;
  slug?: string;
  sub_title?: string;
  description?: string;
  cover_image_id?: string;
  order?: number;
  is_active?: boolean;
  contentItems?: Array<{
    id: number;
    image_id: string;
    sub_title: string;
    description: string;
  }>;
  // In case your API sends snake_case instead:
  content_items?: Array<{
    id?: number;
    image_id: string;
    sub_title: string;
    description: string;
  }>;
  contact?: {
    title?: string;
    message?: string;
  };
}

interface Props {
  service: Service;
}

interface ContentItem {
  image_id: string;
  sub_title: string;
  description: string;
}

interface FormData {
  title: string;
  slug: string;
  sub_title: string;
  description: string;
  cover_image_id: string;
  order: number;
  is_active: boolean;
  content_items: ContentItem[];
  contact: {
    title: string;
    message: string;
  };
}

export default function ServiceEdit({ service }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Services', href: '/admin/services' },
    { title: 'Edit', href: '#' },
  ];

  // Normalize possible data shapes and ensure an array
  const initialContentItems: ContentItem[] =
    service.contentItems?.map(({ image_id, sub_title, description }) => ({
      image_id,
      sub_title,
      description,
    })) ??
    service.content_items?.map(({ image_id, sub_title, description }) => ({
      image_id,
      sub_title,
      description,
    })) ??
    [];

  const { data, setData, put, processing, errors } = useForm<FormData>({
    title: service.title ?? '',
    slug: service.slug ?? '',
    sub_title: service.sub_title ?? '',
    description: service.description ?? '',
    cover_image_id: service.cover_image_id ?? '',
    order: service.order ?? 0,
    is_active: service.is_active ?? false,
    content_items: initialContentItems,
    contact: {
      title: service.contact?.title ?? 'CONTACT',
      message: service.contact?.message ?? '',
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/admin/services/${service.id}`);
  };

  const addContentItem = () => {
    setData('content_items', [
      ...(data.content_items ?? []),
      { image_id: '', sub_title: '', description: '' },
    ]);
  };

  const removeContentItem = (index: number) => {
    const newItems = (data.content_items ?? []).filter((_, i) => i !== index);
    setData('content_items', newItems);
  };

  const updateContentItem = (
    index: number,
    field: keyof ContentItem,
    value: string
  ) => {
    const newItems = [...(data.content_items ?? [])];
    // Ensure the item exists (in case of unexpected index)
    if (!newItems[index]) return;
    newItems[index] = { ...newItems[index], [field]: value };
    setData('content_items', newItems);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Service - ${service.title ?? ''}`} />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Edit Service</h1>
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
                  placeholder="Enter service title"
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={data.slug}
                  onChange={(e) => setData('slug', e.target.value)}
                  placeholder="auto-generated-from-title"
                />
                {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sub_title">Subtitle</Label>
                <Input
                  id="sub_title"
                  value={data.sub_title}
                  onChange={(e) => setData('sub_title', e.target.value)}
                  placeholder="Enter subtitle"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  placeholder="Enter description"
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
                      setData('order', Number.isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value))
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

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Content Items *</CardTitle>
                <Button type="button" onClick={addContentItem} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {(data.content_items?.length ?? 0) === 0 ? (
                <p className="text-sm text-muted-foreground">No content items yet.</p>
              ) : (
                data.content_items.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Item {index + 1}</h4>
                        {data.content_items.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeContentItem(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Image ID (Google Drive) *</Label>
                        <div className="flex gap-2">
                          <Input
                            value={item.image_id}
                            onChange={(e) => updateContentItem(index, 'image_id', e.target.value)}
                            placeholder="Enter Google Drive file ID"
                          />
                          <IdPickerButton
                            onPick={(id) => updateContentItem(index, 'image_id', id)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Subtitle *</Label>
                        <Input
                          value={item.sub_title}
                          onChange={(e) => updateContentItem(index, 'sub_title', e.target.value)}
                          placeholder="Enter subtitle"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Description *</Label>
                        <Textarea
                          value={item.description}
                          onChange={(e) => updateContentItem(index, 'description', e.target.value)}
                          placeholder="Enter description"
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information *</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact_title">Title *</Label>
                <Input
                  id="contact_title"
                  value={data.contact.title}
                  onChange={(e) =>
                    setData('contact', { ...data.contact, title: e.target.value })
                  }
                  placeholder="e.g., CONTACT"
                />
                {errors['contact.title'] && (
                  <p className="text-sm text-destructive">{errors['contact.title']}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_message">Message *</Label>
                <Textarea
                  id="contact_message"
                  value={data.contact.message}
                  onChange={(e) =>
                    setData('contact', { ...data.contact, message: e.target.value })
                  }
                  placeholder="Enter contact message"
                  rows={4}
                />
                {errors['contact.message'] && (
                  <p className="text-sm text-destructive">{errors['contact.message']}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? 'Updating...' : 'Update Service'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
