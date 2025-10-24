import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Layout & Settings', href: '/admin/layout' },
    { title: 'Social Links', href: '/admin/social-links' },
    { title: 'Create', href: '#' },
];

interface FormData {
    platform: '' | 'facebook' | 'instagram' | 'youtube' | 'twitter' | 'linkedin';
    url: string;
    order: number;
}

export default function SocialLinkCreate() {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        platform: '',
        url: '',
        order: 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/social-links');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Social Link" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold">Create Social Link</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Link Information</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="platform">Platform *</Label>
                                <Select value={data.platform} onValueChange={(value) => setData('platform', value as any)}>
                                    <SelectTrigger><SelectValue placeholder="Select platform" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="facebook">Facebook</SelectItem>
                                        <SelectItem value="instagram">Instagram</SelectItem>
                                        <SelectItem value="youtube">YouTube</SelectItem>
                                        <SelectItem value="twitter">Twitter</SelectItem>
                                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.platform && <p className="text-sm text-destructive">{errors.platform}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="url">URL *</Label>
                                <Input id="url" type="url" value={data.url} onChange={(e) => setData('url', e.target.value)} placeholder="https://..." />
                                {errors.url && <p className="text-sm text-destructive">{errors.url}</p>}
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
