import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface HeroSection {
    id: number;
    icon: 'date' | 'pen' | 'home';
    title: string;
    description?: string;
    order: number;
}

interface Props {
    section: HeroSection;
}

interface FormData {
    icon: 'date' | 'pen' | 'home';
    title: string;
    description: string;
    order: number;
}

export default function HeroSectionEdit({ section }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
            { title: 'Home Page', href: '/admin/home' },
        { title: 'Hero Sections', href: '/admin/home-hero-sections' },
        { title: 'Edit', href: '#' },
    ];

    const { data, setData, put, processing, errors } = useForm<FormData>({
        icon: section.icon,
        title: section.title || '',
        description: section.description || '',
        order: section.order || 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/home-hero-sections/${section.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Hero Section - ${section.title}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold">Edit Hero Section</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Section Information</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="icon">Icon *</Label>
                                <Select value={data.icon} onValueChange={(value) => setData('icon', value as any)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="date">Date</SelectItem>
                                        <SelectItem value="pen">Pen</SelectItem>
                                        <SelectItem value="home">Home</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.icon && <p className="text-sm text-destructive">{errors.icon}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} placeholder="Enter title" />
                                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} placeholder="Enter description" rows={3} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="order">Order</Label>
                                <Input id="order" type="number" value={data.order} onChange={(e) => setData('order', parseInt(e.target.value) || 0)} />
                            </div>
                        </CardContent>
                    </Card>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => window.history.back()}>Cancel</Button>
                        <Button type="submit" disabled={processing}>{processing ? 'Updating...' : 'Update Section'}</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
