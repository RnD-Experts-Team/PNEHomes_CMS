import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, X } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface GalleryImage {
    id: number;
    virtual_image_id: string;
    real_image_id: string;
}

interface GallerySubAlbum {
    id: number;
    slug: string;
    title: string;
    cover_virtual_image_id: string;
    cover_real_image_id: string;
    images: GalleryImage[];
}

interface Album {
    id: number;
    title: string;
    slug: string;
    cover_virtual_image_id: string;
    cover_real_image_id: string;
    has_sub_albums: boolean;
    order: number;
    is_active: boolean;
    subAlbums: GallerySubAlbum[];
    images: GalleryImage[];
}

interface Props {
    album: Album;
}

interface Image {
    virtual_image_id: string;
    real_image_id: string;
}

interface SubAlbum {
    slug: string;
    title: string;
    cover_virtual_image_id: string;
    cover_real_image_id: string;
    images: Image[];
}

interface FormData {
    title: string;
    slug: string;
    cover_virtual_image_id: string;
    cover_real_image_id: string;
    has_sub_albums: boolean;
    order: number;
    is_active: boolean;
    sub_albums: SubAlbum[];
    images: Image[];
}

export default function GalleryEdit({ album }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [

        {
            title: 'Gallery Albums',
            href: '/admin/gallery-albums',
        },
        {
            title: 'Edit',
            href: '#',
        },
    ];

    const { data, setData, put, processing, errors } = useForm<FormData>({
        title: album.title || '',
        slug: album.slug || '',
        cover_virtual_image_id: album.cover_virtual_image_id || '',
        cover_real_image_id: album.cover_real_image_id || '',
        has_sub_albums: album.has_sub_albums,
        order: album.order || 0,
        is_active: album.is_active,
        sub_albums:
            album.subAlbums?.map((sub) => ({
                slug: sub.slug,
                title: sub.title,
                cover_virtual_image_id: sub.cover_virtual_image_id,
                cover_real_image_id: sub.cover_real_image_id,
                images: sub.images.map((img) => ({
                    virtual_image_id: img.virtual_image_id,
                    real_image_id: img.real_image_id,
                })),
            })) || [],
        images:
            album.images?.map((img) => ({
                virtual_image_id: img.virtual_image_id,
                real_image_id: img.real_image_id,
            })) || [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/gallery-albums/${album.id}`);
    };

    // Sub Albums functions
    const addSubAlbum = () => {
        setData('sub_albums', [
            ...data.sub_albums,
            {
                slug: '',
                title: '',
                cover_virtual_image_id: '',
                cover_real_image_id: '',
                images: [],
            },
        ]);
    };

    const updateSubAlbum = (
        index: number,
        field: keyof SubAlbum,
        value: string | Image[]
    ) => {
        const newSubAlbums = [...data.sub_albums];
        newSubAlbums[index][field] = value as any;
        setData('sub_albums', newSubAlbums);
    };

    const removeSubAlbum = (index: number) => {
        setData('sub_albums', data.sub_albums.filter((_, i) => i !== index));
    };

    const addSubAlbumImage = (subAlbumIndex: number) => {
        const newSubAlbums = [...data.sub_albums];
        newSubAlbums[subAlbumIndex].images.push({
            virtual_image_id: '',
            real_image_id: '',
        });
        setData('sub_albums', newSubAlbums);
    };

    const updateSubAlbumImage = (
        subAlbumIndex: number,
        imageIndex: number,
        field: keyof Image,
        value: string
    ) => {
        const newSubAlbums = [...data.sub_albums];
        newSubAlbums[subAlbumIndex].images[imageIndex][field] = value;
        setData('sub_albums', newSubAlbums);
    };

    const removeSubAlbumImage = (subAlbumIndex: number, imageIndex: number) => {
        const newSubAlbums = [...data.sub_albums];
        newSubAlbums[subAlbumIndex].images = newSubAlbums[
            subAlbumIndex
        ].images.filter((_, i) => i !== imageIndex);
        setData('sub_albums', newSubAlbums);
    };

    // Direct Images functions
    const addImage = () => {
        setData('images', [
            ...data.images,
            { virtual_image_id: '', real_image_id: '' },
        ]);
    };

    const updateImage = (index: number, field: keyof Image, value: string) => {
        const newImages = [...data.images];
        newImages[index][field] = value;
        setData('images', newImages);
    };

    const removeImage = (index: number) => {
        setData('images', data.images.filter((_, i) => i !== index));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Gallery Album - ${album.title}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Edit Gallery Album</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Enter album title"
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-destructive">{errors.title}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input
                                        id="slug"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        placeholder="auto-generated-from-title"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cover_virtual_image_id">
                                        Cover Virtual Image ID *
                                    </Label>
                                    <Input
                                        id="cover_virtual_image_id"
                                        value={data.cover_virtual_image_id}
                                        onChange={(e) =>
                                            setData('cover_virtual_image_id', e.target.value)
                                        }
                                        placeholder="Enter Google Drive file ID"
                                    />
                                    {errors.cover_virtual_image_id && (
                                        <p className="text-sm text-destructive">
                                            {errors.cover_virtual_image_id}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cover_real_image_id">
                                        Cover Real Image ID *
                                    </Label>
                                    <Input
                                        id="cover_real_image_id"
                                        value={data.cover_real_image_id}
                                        onChange={(e) =>
                                            setData('cover_real_image_id', e.target.value)
                                        }
                                        placeholder="Enter Google Drive file ID"
                                    />
                                    {errors.cover_real_image_id && (
                                        <p className="text-sm text-destructive">
                                            {errors.cover_real_image_id}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Album Type *</Label>
                                <RadioGroup
                                    value={data.has_sub_albums ? 'sub_albums' : 'direct'}
                                    onValueChange={(value) =>
                                        setData('has_sub_albums', value === 'sub_albums')
                                    }
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="direct" id="direct" />
                                        <Label htmlFor="direct">Direct Images</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="sub_albums" id="sub_albums" />
                                        <Label htmlFor="sub_albums">With Sub Albums</Label>
                                    </div>
                                </RadioGroup>
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
                                        onCheckedChange={(checked) =>
                                            setData('is_active', checked)
                                        }
                                    />
                                    <Label htmlFor="is_active">Active</Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {data.has_sub_albums ? (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Sub Albums *</CardTitle>
                                    <Button type="button" onClick={addSubAlbum} size="sm">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Sub Album
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {data.sub_albums.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-8">
                                        No sub albums added yet.
                                    </p>
                                ) : (
                                    data.sub_albums.map((subAlbum, subIndex) => (
                                        <Card key={subIndex}>
                                            <CardContent className="pt-6 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-semibold">
                                                        Sub Album {subIndex + 1}
                                                    </h4>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => removeSubAlbum(subIndex)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Title *</Label>
                                                        <Input
                                                            value={subAlbum.title}
                                                            onChange={(e) =>
                                                                updateSubAlbum(
                                                                    subIndex,
                                                                    'title',
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="Enter sub album title"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Slug</Label>
                                                        <Input
                                                            value={subAlbum.slug}
                                                            onChange={(e) =>
                                                                updateSubAlbum(
                                                                    subIndex,
                                                                    'slug',
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="auto-generated"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Cover Virtual Image ID *</Label>
                                                        <Input
                                                            value={subAlbum.cover_virtual_image_id}
                                                            onChange={(e) =>
                                                                updateSubAlbum(
                                                                    subIndex,
                                                                    'cover_virtual_image_id',
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="Google Drive ID"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Cover Real Image ID *</Label>
                                                        <Input
                                                            value={subAlbum.cover_real_image_id}
                                                            onChange={(e) =>
                                                                updateSubAlbum(
                                                                    subIndex,
                                                                    'cover_real_image_id',
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="Google Drive ID"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <Label>Images</Label>
                                                        <Button
                                                            type="button"
                                                            onClick={() =>
                                                                addSubAlbumImage(subIndex)
                                                            }
                                                            size="sm"
                                                            variant="outline"
                                                        >
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            Add Image
                                                        </Button>
                                                    </div>

                                                    {subAlbum.images.length === 0 ? (
                                                        <p className="text-sm text-muted-foreground text-center py-4">
                                                            No images added
                                                        </p>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            {subAlbum.images.map(
                                                                (image, imgIndex) => (
                                                                    <Card key={imgIndex}>
                                                                        <CardContent className="pt-4 space-y-2">
                                                                            <div className="flex items-center justify-between">
                                                                                <span className="text-sm font-medium">
                                                                                    Image{' '}
                                                                                    {imgIndex + 1}
                                                                                </span>
                                                                                <Button
                                                                                    type="button"
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    onClick={() =>
                                                                                        removeSubAlbumImage(
                                                                                            subIndex,
                                                                                            imgIndex
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <X className="h-4 w-4" />
                                                                                </Button>
                                                                            </div>
                                                                            <div className="grid grid-cols-2 gap-2">
                                                                                <Input
                                                                                    value={
                                                                                        image.virtual_image_id
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        updateSubAlbumImage(
                                                                                            subIndex,
                                                                                            imgIndex,
                                                                                            'virtual_image_id',
                                                                                            e.target
                                                                                                .value
                                                                                        )
                                                                                    }
                                                                                    placeholder="Virtual Image ID"
                                                                                />
                                                                                <Input
                                                                                    value={
                                                                                        image.real_image_id
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        updateSubAlbumImage(
                                                                                            subIndex,
                                                                                            imgIndex,
                                                                                            'real_image_id',
                                                                                            e.target
                                                                                                .value
                                                                                        )
                                                                                    }
                                                                                    placeholder="Real Image ID"
                                                                                />
                                                                            </div>
                                                                        </CardContent>
                                                                    </Card>
                                                                )
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Images *</CardTitle>
                                    <Button type="button" onClick={addImage} size="sm">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Image
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {data.images.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-8">
                                        No images added yet.
                                    </p>
                                ) : (
                                    data.images.map((image, index) => (
                                        <Card key={index}>
                                            <CardContent className="pt-4 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium">
                                                        Image {index + 1}
                                                    </span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeImage(index)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Virtual Image ID *</Label>
                                                        <Input
                                                            value={image.virtual_image_id}
                                                            onChange={(e) =>
                                                                updateImage(
                                                                    index,
                                                                    'virtual_image_id',
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="Google Drive ID"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Real Image ID *</Label>
                                                        <Input
                                                            value={image.real_image_id}
                                                            onChange={(e) =>
                                                                updateImage(
                                                                    index,
                                                                    'real_image_id',
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="Google Drive ID"
                                                        />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    )}

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Album'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
