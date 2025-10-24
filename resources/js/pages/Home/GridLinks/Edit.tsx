import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GridLink {
    id: number;
    title: string;
    cover_image_id: string;
    order: number;
}

interface Props {
    link: GridLink;
}

interface FormData {
    title: string;
    cover_image_id: string;
    order: number;
}

export default function GridLinkEdit({ link }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
            { title: 'Home Page', href: '/admin/home' },
        { title: 'Grid Links', href: '/admin/home-grid-links' },
        { title: 'Edit', href: '#' },
    ];

    const { data, setData, put, processing, errors } = useForm<FormData>({
        title: link.title || '',
        cover_image_id: link.cover_image_id || '',
        order: link.order || 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/home-grid-links/${link.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Grid Link - ${link.title}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold">Edit Grid Link</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Link Information</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} placeholder="Enter title" />
                                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cover_image_id">Cover Image ID (Google Drive) *</Label>
                                <Input id="cover_image_id" value={data.cover_image_id} onChange={(e) => setData('cover_image_id', e.target.value)} placeholder="Enter Google Drive file ID" />
                                {errors.cover_image_id && <p className="text-sm text-destructive">{errors.cover_image_id}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="order">Order</Label>
                                <Input id="order" type="number" value={data.order} onChange={(e) => setData('order', parseInt(e.target.value) || 0)} />
                            </div>
                        </CardContent>
                    </Card>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => window.history.back()}>Cancel</Button>
                        <Button type="submit" disabled={processing}>{processing ? 'Updating...' : 'Update Link'}</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
