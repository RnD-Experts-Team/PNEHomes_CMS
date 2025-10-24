import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FooterLink {
    id: number;
    title: string;
    slug: string;
    order: number;
}

interface Props {
    link: FooterLink;
}

interface FormData {
    title: string;
    slug: string;
    order: number;
}

export default function FooterLinkEdit({ link }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
            { title: 'Layout & Settings', href: '/admin/layout' },
        { title: 'Footer Links', href: '/admin/footer-links' },
        { title: 'Edit', href: '#' },
    ];

    const { data, setData, put, processing, errors } = useForm<FormData>({
        title: link.title || '',
        slug: link.slug || '',
        order: link.order || 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/footer-links/${link.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Footer Link - ${link.title}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold">Edit Footer Link</h1>
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
                        <Button type="submit" disabled={processing}>{processing ? 'Updating...' : 'Update Link'}</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
