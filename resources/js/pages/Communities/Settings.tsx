// resources/js/Pages/Communities/Settings.tsx
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IdPickerButton } from '@/components/drive/IdPickerButton';
import { Textarea } from '@/components/ui/textarea'; // ensure you have this, or replace with <textarea>

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Communities', href: '/admin/communities' },
    { title: 'Settings', href: '#' },
];

interface Settings {
    title: string;
    cover_image_id: string;
    zillow_link: string;
}

interface Contact {
    title: string;
    message: string;
}

interface Props {
    settings: Settings;
    contact: Contact;
}

interface FormData {
    // settings
    title: string;
    cover_image_id: string;
    zillow_link: string;
    // contact
    contact: {
        title: string;
        message: string;
    };
}

export default function CommunitiesSettings({ settings, contact }: Props) {
    const { data, setData, put, processing, errors } = useForm<FormData>({
        title: settings?.title ?? 'Communities',
        cover_image_id: settings?.cover_image_id ?? '',
        zillow_link: settings?.zillow_link ?? '',
        contact: {
            title: contact?.title ?? '',
            message: contact?.message ?? '',
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/admin/communities-settings');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Communities Settings" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Communities Settings</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Page Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Page Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Title */}
                            <div className="space-y-2">
                                <Label htmlFor="title">Page Title *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Communities"
                                    required
                                />
                                {errors.title && (
                                    <p className="text-sm text-destructive">{errors.title}</p>
                                )}
                            </div>

                            {/* Cover Image */}
                            <div className="space-y-2">
                                <Label htmlFor="cover_image_id">Cover Image ID (Google Drive)</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="cover_image_id"
                                        value={data.cover_image_id}
                                        onChange={(e) => setData('cover_image_id', e.target.value)}
                                        placeholder="Enter Google Drive file ID"
                                    />
                                    <IdPickerButton
                                        onPick={(id) => setData('cover_image_id', id)}
                                    />
                                </div>
                                {errors.cover_image_id && (
                                    <p className="text-sm text-destructive">
                                        {errors.cover_image_id}
                                    </p>
                                )}
                            </div>

                            {/* Zillow Link */}
                            <div className="space-y-2">
                                <Label htmlFor="zillow_link">Zillow Link</Label>
                                <Input
                                    id="zillow_link"
                                    type="url"
                                    value={data.zillow_link}
                                    onChange={(e) => setData('zillow_link', e.target.value)}
                                    placeholder="https://www.zillow.com/..."
                                />
                                {errors.zillow_link && (
                                    <p className="text-sm text-destructive">{errors.zillow_link}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Section</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="contact_title">Contact Title *</Label>
                                <Input
                                    id="contact_title"
                                    value={data.contact.title}
                                    onChange={(e) =>
                                        setData('contact', {
                                            ...data.contact,
                                            title: e.target.value,
                                        })
                                    }
                                    placeholder="e.g. Get in touch"
                                    required
                                />
                                {errors['contact.title'] && (
                                    <p className="text-sm text-destructive">
                                        {errors['contact.title']}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contact_message">Contact Message *</Label>
                                {/* use your own Textarea or default <textarea> */}
                                <Textarea
                                    id="contact_message"
                                    value={data.contact.message}
                                    onChange={(e) =>
                                        setData('contact', {
                                            ...data.contact,
                                            message: e.target.value,
                                        })
                                    }
                                    placeholder="Brief message shown on the contact section…"
                                    rows={5}
                                    required
                                />
                                {errors['contact.message'] && (
                                    <p className="text-sm text-destructive">
                                        {errors['contact.message']}
                                    </p>
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
