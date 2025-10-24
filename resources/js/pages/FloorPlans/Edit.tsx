import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FloorPlan {
    id: number;
    slug: string;
    title: string;
    description?: string;
    image_id: string;
    bedroom: number;
    bathroom: number;
    floor: number;
    area: number;
    order: number;
    is_active: boolean;
}

interface Props {
    floorPlan: FloorPlan;
}

interface FormData {
    title: string;
    slug: string;
    description: string;
    image_id: string;
    bedroom: number;
    bathroom: number;
    floor: number;
    area: number;
    order: number;
    is_active: boolean;
}

export default function FloorPlanEdit({ floorPlan }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Floor Plans', href: '/admin/floor-plans' },
        { title: 'Edit', href: '#' },
    ];

    const { data, setData, put, processing, errors } = useForm<FormData>({
        title: floorPlan.title || '',
        slug: floorPlan.slug || '',
        description: floorPlan.description || '',
        image_id: floorPlan.image_id || '',
        bedroom: floorPlan.bedroom || 0,
        bathroom: floorPlan.bathroom || 0,
        floor: floorPlan.floor || 0,
        area: floorPlan.area || 0,
        order: floorPlan.order || 0,
        is_active: floorPlan.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/floor-plans/${floorPlan.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Floor Plan - ${floorPlan.title}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold">Edit Floor Plan</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Floor Plan Information</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} placeholder="Enter floor plan title" />
                                    {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} placeholder="auto-generated-from-title" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} placeholder="Enter description" rows={3} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image_id">Image ID (Google Drive) *</Label>
                                <Input id="image_id" value={data.image_id} onChange={(e) => setData('image_id', e.target.value)} placeholder="Enter Google Drive file ID" />
                                {errors.image_id && <p className="text-sm text-destructive">{errors.image_id}</p>}
                            </div>

                            <div className="grid grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="bedroom">Bedrooms *</Label>
                                    <Input id="bedroom" type="number" min="0" value={data.bedroom} onChange={(e) => setData('bedroom', parseInt(e.target.value) || 0)} />
                                    {errors.bedroom && <p className="text-sm text-destructive">{errors.bedroom}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bathroom">Bathrooms *</Label>
                                    <Input id="bathroom" type="number" min="0" value={data.bathroom} onChange={(e) => setData('bathroom', parseInt(e.target.value) || 0)} />
                                    {errors.bathroom && <p className="text-sm text-destructive">{errors.bathroom}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="floor">Floor *</Label>
                                    <Input id="floor" type="number" min="0" value={data.floor} onChange={(e) => setData('floor', parseInt(e.target.value) || 0)} />
                                    {errors.floor && <p className="text-sm text-destructive">{errors.floor}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="area">Area (sqft) *</Label>
                                    <Input id="area" type="number" min="0" value={data.area} onChange={(e) => setData('area', parseInt(e.target.value) || 0)} />
                                    {errors.area && <p className="text-sm text-destructive">{errors.area}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="order">Order</Label>
                                    <Input id="order" type="number" value={data.order} onChange={(e) => setData('order', parseInt(e.target.value) || 0)} />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch id="is_active" checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked)} />
                                    <Label htmlFor="is_active">Active</Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => window.history.back()}>Cancel</Button>
                        <Button type="submit" disabled={processing}>{processing ? 'Updating...' : 'Update Floor Plan'}</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
