import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [

    {
        title: 'Building Options',
        href: '/admin/building-options',
    },
    {
        title: 'Articles',
        href: '/admin/building-articles',
    },
    {
        title: 'Create',
        href: '#',
    },
];

interface FormData {
    title: string;
    slug: string;
    description: string;
    image_id: string;
    content: string;
    order: number;
    is_active: boolean;
}

export default function BuildingArticleCreate() {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        title: '',
        slug: '',
        description: '',
        image_id: '',
        content: '',
        order: 0,
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/building-articles');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Building Article" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Create Building Article</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Article Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Enter article title"
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

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Enter article description"
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image_id">Image ID (Google Drive) *</Label>
                                <Input
                                    id="image_id"
                                    value={data.image_id}
                                    onChange={(e) => setData('image_id', e.target.value)}
                                    placeholder="Enter Google Drive file ID"
                                />
                                {errors.image_id && (
                                    <p className="text-sm text-destructive">{errors.image_id}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">Content *</Label>
                                <Textarea
                                    id="content"
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    placeholder="Enter article content"
                                    rows={12}
                                />
                                {errors.content && (
                                    <p className="text-sm text-destructive">{errors.content}</p>
                                )}
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

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Article'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
