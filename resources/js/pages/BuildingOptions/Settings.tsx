import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [

    {
        title: 'Building Options',
        href: '/admin/building-options',
    },
    {
        title: 'Settings',
        href: '#',
    },
];

interface Settings {
    cover_image_id: string;
    articles_cover_image_id: string;
    slogan: string;
    title: string;
}

interface Props {
    settings?: Settings;
}

interface FormData {
    cover_image_id: string;
    articles_cover_image_id: string;
    slogan: string;
    title: string;
}

export default function BuildingOptionsSettings({ settings }: Props) {
    const { data, setData, put, processing, errors } = useForm<FormData>({
        cover_image_id: settings?.cover_image_id || '',
        articles_cover_image_id: settings?.articles_cover_image_id || '',
        slogan: settings?.slogan || '',
        title: settings?.title || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/admin/building-options-settings');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Building Options Settings" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Building Options Settings</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="cover_image_id">
                                    Cover Image ID (Google Drive) *
                                </Label>
                                <Input
                                    id="cover_image_id"
                                    value={data.cover_image_id}
                                    onChange={(e) => setData('cover_image_id', e.target.value)}
                                    placeholder="Enter Google Drive file ID"
                                />
                                {errors.cover_image_id && (
                                    <p className="text-sm text-destructive">
                                        {errors.cover_image_id}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="articles_cover_image_id">
                                    Articles Cover Image ID (Google Drive) *
                                </Label>
                                <Input
                                    id="articles_cover_image_id"
                                    value={data.articles_cover_image_id}
                                    onChange={(e) =>
                                        setData('articles_cover_image_id', e.target.value)
                                    }
                                    placeholder="Enter Google Drive file ID"
                                />
                                {errors.articles_cover_image_id && (
                                    <p className="text-sm text-destructive">
                                        {errors.articles_cover_image_id}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slogan">Slogan *</Label>
                                <Input
                                    id="slogan"
                                    value={data.slogan}
                                    onChange={(e) => setData('slogan', e.target.value)}
                                    placeholder="Enter slogan"
                                />
                                {errors.slogan && (
                                    <p className="text-sm text-destructive">{errors.slogan}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Enter title"
                                />
                                {errors.title && (
                                    <p className="text-sm text-destructive">{errors.title}</p>
                                )}
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
                            {processing ? 'Updating...' : 'Update Settings'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
