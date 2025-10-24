import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home Page', href: '/admin/home' },
    { title: 'Service Links', href: '/admin/home-service-links' },
    { title: 'Create', href: '#' },
];

interface FormData {
    title: string;
    slug: string;
    order: number;
}

export default function ServiceLinkCreate() {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        title: '',
        slug: '',
        order: 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/home-service-links');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Service Link" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold">Create Service Link</h1>
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
                                <Label htmlFor="slug">Slug *</Label>
                                <Input id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} placeholder="e.g., properties, communities" />
                                {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="order">Order</Label>
                                <Input id="order" type="number" value={data.order} onChange={(e) => setData('order', parseInt(e.target.value) || 0)} />
                            </div>
                        </CardContent>
                    </Card>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => window.history.back()}>Cancel</Button>
                        <Button type="submit" disabled={processing}>{processing ? 'Creating...' : 'Create Link'}</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
