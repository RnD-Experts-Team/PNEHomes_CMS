import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IdPickerButton } from '@/components/drive/IdPickerButton';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Communities', href: '/admin/communities' },
    { title: 'Floor Plans', href: '/admin/communities-floorplans' },
    { title: 'Create', href: '#' },
];

interface Community {
    id: number;
    title: string;
}

interface Props {
    communities: Community[];
}

interface FormData {
    community_id: number | string;
    title: string;
    cover_image_id: string;
    status: string;
    price: string;
    beds: string;
    baths: string;
    garages: string;
    sqft: string;
    order: number;
    is_active: boolean;
}

export default function FloorplanCreate({ communities }: Props) {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        community_id: '',
        title: '',
        cover_image_id: '',
        status: 'available',
        price: '',
        beds: '',
        baths: '',
        garages: '',
        sqft: '',
        order: 0,
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/communities-floorplans');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Floor Plan" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Create Floor Plan</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Community Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="community_id">Community *</Label>
                                <Select
                                    value={data.community_id.toString()}
                                    onValueChange={(value) =>
                                        setData('community_id', parseInt(value))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a community" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {communities.map((community) => (
                                            <SelectItem
                                                key={community.id}
                                                value={community.id.toString()}
                                            >
                                                {community.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.community_id && (
                                    <p className="text-sm text-destructive">
                                        {errors.community_id}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Enter floor plan title"
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-destructive">{errors.title}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Slug will be auto-generated from title
                                    </p>
                                </div>
{/*
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) => setData('status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="available">Available</SelectItem>
                                            <SelectItem value="sold">Sold</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div> */}
                            </div>

                            {/* Cover Image */}
                            <div className="space-y-2">
                                <Label htmlFor="cover_image_id">Cover Image ID (Google Drive) *</Label>
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

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price</Label>
                                    <Input
                                        id="price"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        placeholder="$XXX,XXX"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sqft">Square Feet</Label>
                                    <Input
                                        id="sqft"
                                        value={data.sqft}
                                        onChange={(e) => setData('sqft', e.target.value)}
                                        placeholder="e.g., 2,500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="beds">Beds</Label>
                                    <Input
                                        id="beds"
                                        value={data.beds}
                                        onChange={(e) => setData('beds', e.target.value)}
                                        placeholder="e.g., 3"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="baths">Baths</Label>
                                    <Input
                                        id="baths"
                                        value={data.baths}
                                        onChange={(e) => setData('baths', e.target.value)}
                                        placeholder="e.g., 2.5"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="garages">Garages</Label>
                                    <Input
                                        id="garages"
                                        value={data.garages}
                                        onChange={(e) => setData('garages', e.target.value)}
                                        placeholder="e.g., 2"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="order">Order</Label>
                                    <Input
                                        id="order"
                                        type="number"
                                        value={data.order}
                                        onChange={(e) =>
                                            setData('order', parseInt(e.target.value) || 0)
                                        }
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked)}
                                    />
                                    <Label htmlFor="is_active">Active</Label>
                                </div>
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
                            {processing ? 'Creating...' : 'Create Floor Plan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
