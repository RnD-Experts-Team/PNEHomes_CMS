import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Privacy Policy', href: '#' },
];

interface PrivacyPolicy {
    content: string;
}

interface Props {
    privacyPolicy?: PrivacyPolicy;
}

interface FormData {
    content: string;
}

export default function PrivacyPolicyPage({ privacyPolicy }: Props) {
    const { data, setData, put, processing, errors } = useForm<FormData>({
        content: privacyPolicy?.content || '',
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
                            <CardTitle>Policy Content</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="content">Content *</Label>
                                <Textarea
                                    id="content"
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    placeholder="Enter privacy policy content"
                                    rows={25}
                                    className="font-mono text-sm"
                                />
                                {errors.content && (
                                    <p className="text-sm text-destructive">{errors.content}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    You can use HTML formatting in the content.
                                </p>
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
