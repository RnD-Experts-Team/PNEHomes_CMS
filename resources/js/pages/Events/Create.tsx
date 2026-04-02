import { IdPickerButton } from '@/components/drive/IdPickerButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Plus, X } from 'lucide-react';
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Events', href: '/admin/events' },
    { title: 'Create', href: '#' },
];

interface GalleryItem {
    image_id: string;
    image_type: string;
}
interface FormData {
    title: string;
    description: string;
    cover_image_id: string;
    cover_image_type: string;
    order: number;
    is_active: boolean;
    gallery: GalleryItem[];
}

export default function EventCreate() {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        title: '',
        description: '',
        cover_image_id: '',
        cover_image_type: 'image',
        order: 0,
        is_active: true,
        gallery: [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/events');
    };

    const addGalleryImage = () => {
        setData('gallery', [
            ...data.gallery,
            {
                image_id: '',
                image_type: 'image',
            },
        ]);
    };

    const appendManyGalleryImages = (ids: string[]) => {
        if (!ids.length) return;

        setData('gallery', [
            ...data.gallery,
            ...ids.map((id) => ({
                image_id: id,
                image_type: 'image',
            })),
        ]);
    };

    const updateGalleryImage = (
        index: number,
        field: keyof GalleryItem,
        value: string,
    ) => {
        const newGallery = [...data.gallery];
        newGallery[index] = {
            ...newGallery[index],
            [field]: value,
        };
        setData('gallery', newGallery);
    };

    const removeGalleryImage = (index: number) => {
        setData(
            'gallery',
            data.gallery.filter((_, i) => i !== index),
        );
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
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    placeholder="Enter event title"
                                />
                                {errors.title && (
                                    <p className="text-sm text-destructive">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">
                                    Description *
                                </Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="Enter event description"
                                    rows={4}
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            {/* Cover Image ID + Picker (kept commented as in your original) */}
                            {/* <div className="space-y-2">
  <Label htmlFor="cover_image_id">Cover Image ID (Google Drive)</Label>
  <div className="flex gap-2">
    <Input
      id="cover_image_id"
      value={data.cover_image_id}
      onChange={(e) => setData('cover_image_id', e.target.value)}
      placeholder="Enter Google Drive file ID"
    />
    <Select
      value={data.cover_image_type}
      onValueChange={(value) => setData('cover_image_type', value)}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="image">Image</SelectItem>
        <SelectItem value="video">Video</SelectItem>
      </SelectContent>
    </Select>
    <IdPickerButton onPick={(id) => setData('cover_image_id', id)} />
  </div>
</div> */}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="order">Order</Label>
                                    <Input
                                        id="order"
                                        type="number"
                                        value={data.order}
                                        onChange={(e) =>
                                            setData(
                                                'order',
                                                parseInt(e.target.value) || 0,
                                            )
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="is_active">Active</Label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            id="is_active"
                                            type="checkbox"
                                            checked={data.is_active}
                                            onChange={(e) =>
                                                setData(
                                                    'is_active',
                                                    e.target.checked,
                                                )
                                            }
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
                                <div className="flex gap-2">
                                    {/* NEW: multi-pick to append many IDs at once */}
                                    <IdPickerButton
                                        multiple
                                        label="Pick Images (multi)"
                                        mimeTypes={[
                                            'image/jpeg',
                                            'image/png',
                                            'image/webp',
                                        ]}
                                        onPickMany={appendManyGalleryImages}
                                    />
                                    <Button
                                        type="button"
                                        onClick={addGalleryImage}
                                        size="sm"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Image
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {data.gallery.length === 0 ? (
                                <p className="py-8 text-center text-sm text-muted-foreground">
                                    No images added yet. Use “Pick Images
                                    (multi)” to add many at once, or click “Add
                                    Image”.
                                </p>
                            ) : (
                                data.gallery.map((item, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={item.image_id}
                                            onChange={(e) =>
                                                updateGalleryImage(
                                                    index,
                                                    'image_id',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Enter Google Drive file ID"
                                        />

                                        <Select
                                            value={item.image_type}
                                            onValueChange={(value) =>
                                                updateGalleryImage(
                                                    index,
                                                    'image_type',
                                                    value,
                                                )
                                            }
                                        >
                                            <SelectTrigger className="w-[140px]">
                                                <SelectValue placeholder="Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="image">
                                                    Image
                                                </SelectItem>
                                                <SelectItem value="video">
                                                    Video
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <IdPickerButton
                                            onPick={(id) =>
                                                updateGalleryImage(
                                                    index,
                                                    'image_id',
                                                    id,
                                                )
                                            }
                                        />

                                        <IdPickerButton
                                            multiple
                                            label="Multi"
                                            mimeTypes={[
                                                'image/jpeg',
                                                'image/png',
                                                'image/webp',
                                            ]}
                                            onPickMany={(ids) => {
                                                if (!ids.length) return;

                                                const first = ids[0];
                                                const rest = ids.slice(1);

                                                const newGallery = [
                                                    ...data.gallery,
                                                ];
                                                newGallery[index] = {
                                                    ...newGallery[index],
                                                    image_id: first,
                                                };

                                                if (rest.length) {
                                                    newGallery.splice(
                                                        index + 1,
                                                        0,
                                                        ...rest.map((id) => ({
                                                            image_id: id,
                                                            image_type: 'image',
                                                        })),
                                                    );
                                                }

                                                setData('gallery', newGallery);
                                            }}
                                        />

                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() =>
                                                removeGalleryImage(index)
                                            }
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
                            {processing ? 'Creating...' : 'Create Event'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
