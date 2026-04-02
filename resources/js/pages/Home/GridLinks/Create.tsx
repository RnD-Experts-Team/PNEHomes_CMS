import { IdPickerButton } from '@/components/drive/IdPickerButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home Page', href: '/admin/home' },
    { title: 'Grid Links', href: '/admin/home-grid-links' },
    { title: 'Create', href: '#' },
];

interface FormData {
    title: string;
    cover_image_id: string;
    cover_image_type: string;
    order: number;
}

export default function GridLinkCreate() {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        title: '',
        cover_image_id: '',
        cover_image_type: 'image',
        order: 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/home-grid-links');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Grid Link" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold">Create Grid Link</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Link Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    placeholder="Enter title"
                                />
                                {errors.title && (
                                    <p className="text-sm text-destructive">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cover_image_id">
                                    Cover Image ID (Google Drive) *
                                </Label>

                                <div className="flex gap-2">
                                    <Input
                                        id="cover_image_id"
                                        value={data.cover_image_id}
                                        onChange={(e) =>
                                            setData(
                                                'cover_image_id',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Enter Google Drive file ID"
                                    />

                                    <Select
                                        value={data.cover_image_type}
                                        onValueChange={(value) =>
                                            setData('cover_image_type', value)
                                        }
                                    >
                                        <SelectTrigger className="w-[140px]">
                                            <SelectValue placeholder="Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="image">
                                                Image
                                            </SelectItem>
                                            <SelectItem value="video">
                                                Video
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <IdPickerButton
                                        onPick={(id) =>
                                            setData('cover_image_id', id)
                                        }
                                    />
                                </div>

                                {errors.cover_image_id && (
                                    <p className="text-sm text-destructive">
                                        {errors.cover_image_id}
                                    </p>
                                )}

                                {errors.cover_image_type && (
                                    <p className="text-sm text-destructive">
                                        {errors.cover_image_type}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="order">Order</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    value={data.order}
                                    onChange={(e) =>
                                        setData(
                                            'order',
                                            parseInt(e.target.value) || 0,
                                        )
                                    }
                                />
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
                            {processing ? 'Creating...' : 'Create Link'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
