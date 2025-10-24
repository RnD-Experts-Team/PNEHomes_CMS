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

const breadcrumbs: BreadcrumbItem[] = [

    {
        title: 'Communities',
        href: '/admin/communities',
    },
    {
        title: 'Create',
        href: '#',
    },
];

interface FormData {
    title: string;
    slug: string;
    city: string;
    address: string;
    card_image_id: string;
    video_id: string;
    community_features: string;
    starting_price: string;
    order: number;
    is_active: boolean;
    gallery: string[];
}

export default function CommunityCreate() {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        title: '',
        slug: '',
        city: '',
        address: '',
        card_image_id: '',
        video_id: '',
        community_features: '',
        starting_price: '',
        order: 0,
        is_active: true,
        gallery: [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/communities');
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
            <Head title="Create Community" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Create Community</h1>
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
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input
                                        id="slug"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        placeholder="auto-generated-from-title"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
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

                                <div className="space-y-2">
                                    <Label htmlFor="starting_price">Starting Price *</Label>
                                    <Input
                                        id="starting_price"
                                        value={data.starting_price}
                                        onChange={(e) =>
                                            setData('starting_price', e.target.value)
                                        }
                                        placeholder="e.g., $500,000"
                                    />
                                    {errors.starting_price && (
                                        <p className="text-sm text-destructive">
                                            {errors.starting_price}
                                        </p>
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

                            <div className="space-y-2">
                                <Label htmlFor="card_image_id">
                                    Card Image ID (Google Drive) *
                                </Label>
                                <Input
                                    id="card_image_id"
                                    value={data.card_image_id}
                                    onChange={(e) => setData('card_image_id', e.target.value)}
                                    placeholder="Enter Google Drive file ID"
                                />
                                {errors.card_image_id && (
                                    <p className="text-sm text-destructive">
                                        {errors.card_image_id}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="video_id">Video ID (Google Drive)</Label>
                                <Input
                                    id="video_id"
                                    value={data.video_id}
                                    onChange={(e) => setData('video_id', e.target.value)}
                                    placeholder="Enter Google Drive video file ID"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="community_features">Community Features</Label>
                                <Textarea
                                    id="community_features"
                                    value={data.community_features}
                                    onChange={(e) =>
                                        setData('community_features', e.target.value)
                                    }
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
                                        onCheckedChange={(checked) =>
                                            setData('is_active', checked)
                                        }
                                    />
                                    <Label htmlFor="is_active">Active</Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

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
                                            onChange={(e) =>
                                                updateGalleryImage(index, e.target.value)
                                            }
                                            placeholder="Enter Google Drive file ID"
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
                            {processing ? 'Creating...' : 'Create Community'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
