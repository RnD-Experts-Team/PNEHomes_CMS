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
    { title: 'Home Page', href: '/admin/home' },
    { title: 'Testimonials', href: '/admin/home-testimonials' },
    { title: 'Create', href: '#' },
];

interface FormData {
    description: string;
    by: string;
    order: number;
    is_active: boolean;
}

export default function TestimonialCreate() {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        description: '',
        by: '',
        order: 0,
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/home-testimonials');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Testimonial" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold">Create Testimonial</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Testimonial Information</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="description">Description *</Label>
                                <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} placeholder="Enter testimonial description" rows={6} />
                                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="by">By *</Label>
                                <Input id="by" value={data.by} onChange={(e) => setData('by', e.target.value)} placeholder="Enter person's name" />
                                {errors.by && <p className="text-sm text-destructive">{errors.by}</p>}
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
                        <Button type="submit" disabled={processing}>{processing ? 'Creating...' : 'Create Testimonial'}</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
