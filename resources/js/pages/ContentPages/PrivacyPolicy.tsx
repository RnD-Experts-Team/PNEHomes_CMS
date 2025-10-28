import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IdPickerButton } from '@/components/drive/IdPickerButton';
import QuillEditorPro from '@/components/QuillEditorPro';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Privacy Policy', href: '#' },
];

interface PrivacyPolicy {
    title: string;
    slogan: string;
    description: string;
    cover_image_id: string;
    contact_title: string;
    contact_message: string;
}

interface Props {
    privacyPolicy?: PrivacyPolicy;
}

interface FormData {
    title: string;
    slogan: string;
    description: string;
    cover_image_id: string;
    contact_title: string;
    contact_message: string;
}

export default function PrivacyPolicyPage({ privacyPolicy }: Props) {
    const { data, setData, put, processing, errors } = useForm<FormData>({
        title: privacyPolicy?.title || 'PRIVACY POLICY',
        slogan: privacyPolicy?.slogan || 'PNE HOMES PRIVACY POLICY',
        description: privacyPolicy?.description || '',
        cover_image_id: privacyPolicy?.cover_image_id || '',
        contact_title: privacyPolicy?.contact_title || 'Contact Us Today',
        contact_message: privacyPolicy?.contact_message || "I would like to learn more about PNE Homes' privacy policy and how my personal information is handled.",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/admin/privacy-policy');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Privacy Policy" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Privacy Policy</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Header Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="PRIVACY POLICY"
                                />
                                {errors.title && (
                                    <p className="text-sm text-destructive">{errors.title}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slogan">Slogan *</Label>
                                <Input
                                    id="slogan"
                                    value={data.slogan}
                                    onChange={(e) => setData('slogan', e.target.value)}
                                    placeholder="PNE HOMES PRIVACY POLICY"
                                />
                                {errors.slogan && (
                                    <p className="text-sm text-destructive">{errors.slogan}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <QuillEditorPro
                                    value={data.description}
                                    onChange={(html) => setData('description', html)}
                                    placeholder="Enter a brief description…"
                                    height="200px"
                                    className="w-full"
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">{errors.description}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    This editor supports rich text formatting, links, lists, and more.
                                </p>
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
                                    placeholder="Contact Us Today"
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
                                    placeholder="Enter contact message"
                                    rows={4}
                                />
                                {errors.contact_message && (
                                    <p className="text-sm text-destructive">{errors.contact_message}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-2">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Privacy Policy'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
