import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IdPickerButton } from '@/components/drive/IdPickerButton';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Gallery', href: '/admin/gallery-albums' },
    { title: 'Settings', href: '#' },
];

interface Settings {
    title: string;
    cover_image_id: string;
    contact_title: string;
    contact_message: string;
}

interface Props {
    settings: Settings;
}

interface FormData {
    title: string;
    cover_image_id: string;
    contact_title: string;
    contact_message: string;
}

export default function GallerySettings({ settings }: Props) {
    const { data, setData, put, processing, errors } = useForm<FormData>({
        title: settings?.title || 'Gallery',
        cover_image_id: settings?.cover_image_id || '',
        contact_title: settings?.contact_title || 'Contact Us',
        contact_message: settings?.contact_message || "I'm contacting you to ask about images of the {title}",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/admin/gallery-settings');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gallery Settings" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Gallery Settings</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Page Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Page Title *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Gallery"
                                />
                                {errors.title && (
                                    <p className="text-sm text-destructive">{errors.title}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cover_image_id">Cover Image ID (Google Drive) *</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="cover_image_id"
                                        value={data.cover_image_id}
                                        onChange={(e) => setData('cover_image_id', e.target.value)}
                                        placeholder="Enter Google Drive file ID"
                                    />
                                    <IdPickerButton onPick={(id) => setData('cover_image_id', id)} />
                                </div>
                                {errors.cover_image_id && (
                                    <p className="text-sm text-destructive">{errors.cover_image_id}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="contact_title">Contact Title *</Label>
                                <Input
                                    id="contact_title"
                                    value={data.contact_title}
                                    onChange={(e) => setData('contact_title', e.target.value)}
                                    placeholder="Contact Us"
                                />
                                {errors.contact_title && (
                                    <p className="text-sm text-destructive">{errors.contact_title}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contact_message">Contact Message *</Label>
                                <Textarea
                                    id="contact_message"
                                    value={data.contact_message}
                                    onChange={(e) => setData('contact_message', e.target.value)}
                                    placeholder="I'm contacting you to ask about images of the {title}"
                                    rows={4}
                                />
                                {errors.contact_message && (
                                    <p className="text-sm text-destructive">{errors.contact_message}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Use <code>{'{title}'}</code> as a placeholder for the album/sub-album title
                                </p>
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
