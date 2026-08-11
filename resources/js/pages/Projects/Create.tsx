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
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Projects', href: '/admin/project-lots' },
    { title: 'Create Lot', href: '#' },
];

interface ImageData {
    virtual_image_id: string;
    virtual_image_type: string;

    real_image_id: string;
    real_image_type: string;
}

interface RoomData {
    title: string;
    cover_image_id: string;
    cover_image_type: string;
    images: ImageData[];
}

interface FormData {
    title: string;
    cover_image_id: string;
    cover_image_type: string;
    has_rooms: boolean;
    order: number;
    is_active: boolean;
    rooms: RoomData[];
    images: ImageData[];
}

type MultiTarget = 'virtual' | 'real';

export default function ProjectLotCreate() {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        title: '',
        cover_image_id: '',
        cover_image_type: 'image',
        has_rooms: false,
        order: 0,
        is_active: true,
        rooms: [],
        images: [],
    });

    // Multi pick target for direct lot images
    const [directMultiTarget, setDirectMultiTarget] =
        useState<MultiTarget>('real');

    // Multi pick target per room (parallel array)
    const [roomMultiTargets, setRoomMultiTargets] = useState<MultiTarget[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/project-lots');
    };

    // ---- Room management
    const addRoom = () => {
        setData('rooms', [
            ...data.rooms,
            {
                title: '',
                cover_image_id: '',
                cover_image_type: 'image',
                images: [],
            },
        ]);
        setRoomMultiTargets((t) => [...t, 'real']);
    };

    const updateRoom = (
        index: number,
        field: keyof RoomData,
        value: any,
    ) => {
        const newRooms = [...data.rooms];
        newRooms[index] = { ...newRooms[index], [field]: value };
        setData('rooms', newRooms);
    };

    const removeRoom = (index: number) => {
        setData(
            'rooms',
            data.rooms.filter((_, i) => i !== index),
        );
        setRoomMultiTargets((t) => t.filter((_, i) => i !== index));
    };

    // ---- Room image management
    const addRoomImage = (roomIndex: number) => {
        const newRooms = [...data.rooms];
        newRooms[roomIndex].images.push({
            virtual_image_id: '',
            virtual_image_type: 'image',
            real_image_id: '',
            real_image_type: 'image',
        });
        setData('rooms', newRooms);
    };

    const appendManyRoomImages = (roomIndex: number, ids: string[]) => {
        if (!ids.length) return;
        const target = roomMultiTargets[roomIndex] ?? 'real';

        const newRooms = [...data.rooms];
        const toAppend: ImageData[] = ids.map((id) => ({
            virtual_image_id: target === 'virtual' ? id : '',
            virtual_image_type: 'image',

            real_image_id: target === 'real' ? id : '',
            real_image_type: 'image',
        }));
        newRooms[roomIndex].images = [
            ...newRooms[roomIndex].images,
            ...toAppend,
        ];
        setData('rooms', newRooms);
    };

    const updateRoomImage = (
        roomIndex: number,
        imgIndex: number,
        field: keyof ImageData,
        value: string,
    ) => {
        const newRooms = [...data.rooms];
        newRooms[roomIndex].images[imgIndex][field] = value;
        setData('rooms', newRooms);
    };

    const removeRoomImage = (roomIndex: number, imgIndex: number) => {
        const newRooms = [...data.rooms];
        newRooms[roomIndex].images = newRooms[roomIndex].images.filter(
            (_, i) => i !== imgIndex,
        );
        setData('rooms', newRooms);
    };

    // ---- Direct image management
    const addImage = () => {
        setData('images', [
            ...data.images,
            {
                virtual_image_id: '',
                virtual_image_type: 'image',
                real_image_id: '',
                real_image_type: 'image',
            },
        ]);
    };

    const appendManyImages = (ids: string[]) => {
        if (!ids.length) return;

        const toAppend: ImageData[] = ids.map((id) => ({
            virtual_image_id: directMultiTarget === 'virtual' ? id : '',
            virtual_image_type: 'image',
            real_image_id: directMultiTarget === 'real' ? id : '',
            real_image_type: 'image',
        }));
        setData('images', [...data.images, ...toAppend]);
    };

    const updateImage = (
        index: number,
        field: keyof ImageData,
        value: string,
    ) => {
        const newImages = [...data.images];
        newImages[index][field] = value;
        setData('images', newImages);
    };

    const removeImage = (index: number) => {
        setData(
            'images',
            data.images.filter((_, i) => i !== index),
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Project Lot" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Create Project Lot</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
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
                                    placeholder="Enter lot title, e.g. Lot 64"
                                />
                                {errors.title && (
                                    <p className="text-sm text-destructive">
                                        {errors.title}
                                    </p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Slug will be auto-generated from title
                                </p>
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
                            </div>

                            <div className="grid grid-cols-2 gap-4">
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

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="has_rooms"
                                    checked={data.has_rooms}
                                    onCheckedChange={(checked) => {
                                        setData('has_rooms', checked);
                                        if (checked) {
                                            setData('images', []);
                                            setRoomMultiTargets(
                                                data.rooms.map(
                                                    () => 'real',
                                                ),
                                            );
                                        } else {
                                            setData('rooms', []);
                                            setRoomMultiTargets([]);
                                        }
                                    }}
                                />
                                <Label htmlFor="has_rooms">
                                    Has Rooms
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Rooms Section */}
                    {data.has_rooms && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Rooms</CardTitle>
                                    <Button
                                        type="button"
                                        onClick={addRoom}
                                        size="sm"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Room
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                {data.rooms.length === 0 ? (
                                    <p className="py-8 text-center text-sm text-muted-foreground">
                                        No rooms added yet. Click "Add
                                        Room" to get started. Put "Exterior"
                                        first so it becomes the hero photo.
                                    </p>
                                ) : (
                                    data.rooms.map(
                                        (room, roomIndex) => (
                                            <Card key={roomIndex}>
                                                <CardHeader>
                                                    <div className="flex items-center justify-between">
                                                        <CardTitle className="text-base">
                                                            Room{' '}
                                                            {roomIndex + 1}
                                                        </CardTitle>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                removeRoom(
                                                                    roomIndex,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </CardHeader>

                                                <CardContent className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label>Title *</Label>
                                                        <Input
                                                            value={
                                                                room.title
                                                            }
                                                            onChange={(e) =>
                                                                updateRoom(
                                                                    roomIndex,
                                                                    'title',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="e.g. Exterior, Kitchen, Bathroom"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>
                                                            Cover Image ID *
                                                        </Label>
                                                        <div className="flex gap-2">
                                                            <Input
                                                                value={
                                                                    room.cover_image_id
                                                                }
                                                                onChange={(e) =>
                                                                    updateRoom(
                                                                        roomIndex,
                                                                        'cover_image_id',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                placeholder="Google Drive file ID"
                                                            />

                                                            <Select
                                                                value={
                                                                    room.cover_image_type
                                                                }
                                                                onValueChange={(
                                                                    value,
                                                                ) =>
                                                                    updateRoom(
                                                                        roomIndex,
                                                                        'cover_image_type',
                                                                        value,
                                                                    )
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
                                                                    updateRoom(
                                                                        roomIndex,
                                                                        'cover_image_id',
                                                                        id,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Room Images */}
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <Label>
                                                                Images
                                                            </Label>

                                                            <div className="flex items-center gap-2">
                                                                {/* shadcn multi target (per room) */}
                                                                <div className="w-[160px]">
                                                                    <Select
                                                                        value={
                                                                            roomMultiTargets[
                                                                                roomIndex
                                                                            ] ??
                                                                            'real'
                                                                        }
                                                                        onValueChange={(
                                                                            v,
                                                                        ) => {
                                                                            const next =
                                                                                [
                                                                                    ...roomMultiTargets,
                                                                                ];
                                                                            next[
                                                                                roomIndex
                                                                            ] =
                                                                                v as MultiTarget;
                                                                            setRoomMultiTargets(
                                                                                next,
                                                                            );
                                                                        }}
                                                                    >
                                                                        <SelectTrigger className="h-8 text-xs">
                                                                            <SelectValue placeholder="Multi target" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="real">
                                                                                Multi
                                                                                →
                                                                                Real
                                                                                IDs
                                                                            </SelectItem>
                                                                            <SelectItem value="virtual">
                                                                                Multi
                                                                                →
                                                                                Virtual
                                                                                IDs
                                                                            </SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>

                                                                <IdPickerButton
                                                                    multiple
                                                                    label="Pick Images (multi)"
                                                                    mimeTypes={[
                                                                        'image/jpeg',
                                                                        'image/png',
                                                                        'image/webp',
                                                                    ]}
                                                                    onPickMany={(
                                                                        ids,
                                                                    ) =>
                                                                        appendManyRoomImages(
                                                                            roomIndex,
                                                                            ids,
                                                                        )
                                                                    }
                                                                />

                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        addRoomImage(
                                                                            roomIndex,
                                                                        )
                                                                    }
                                                                >
                                                                    <Plus className="mr-2 h-3 w-3" />
                                                                    Add Image
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        {room.images
                                                            .length === 0 ? (
                                                            <p className="py-4 text-center text-xs text-muted-foreground">
                                                                No images added
                                                            </p>
                                                        ) : (
                                                            <div className="space-y-3">
                                                                {room.images.map(
                                                                    (
                                                                        img,
                                                                        imgIndex,
                                                                    ) => (
                                                                        <Card
                                                                            key={
                                                                                imgIndex
                                                                            }
                                                                        >
                                                                            <CardContent className="space-y-2 pt-4">
                                                                                <div className="mb-2 flex items-center justify-between">
                                                                                    <span className="text-xs font-medium">
                                                                                        Image{' '}
                                                                                        {imgIndex +
                                                                                            1}
                                                                                    </span>
                                                                                    <Button
                                                                                        type="button"
                                                                                        variant="ghost"
                                                                                        size="sm"
                                                                                        onClick={() =>
                                                                                            removeRoomImage(
                                                                                                roomIndex,
                                                                                                imgIndex,
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <X className="h-3 w-3" />
                                                                                    </Button>
                                                                                </div>

                                                                                <div className="space-y-2">
                                                                                    <Label className="text-xs">
                                                                                        Virtual
                                                                                        Image
                                                                                        ID
                                                                                    </Label>
                                                                                    <div className="flex gap-2">
                                                                                        <Input
                                                                                            value={
                                                                                                img.virtual_image_id
                                                                                            }
                                                                                            onChange={(
                                                                                                e,
                                                                                            ) =>
                                                                                                updateRoomImage(
                                                                                                    roomIndex,
                                                                                                    imgIndex,
                                                                                                    'virtual_image_id',
                                                                                                    e
                                                                                                        .target
                                                                                                        .value,
                                                                                                )
                                                                                            }
                                                                                            placeholder="Optional"
                                                                                        />

                                                                                        <Select
                                                                                            value={
                                                                                                img.virtual_image_type
                                                                                            }
                                                                                            onValueChange={(
                                                                                                value,
                                                                                            ) =>
                                                                                                updateRoomImage(
                                                                                                    roomIndex,
                                                                                                    imgIndex,
                                                                                                    'virtual_image_type',
                                                                                                    value,
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            <SelectTrigger className="w-[120px]">
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
                                                                                            label="Pick"
                                                                                            onPick={(
                                                                                                id,
                                                                                            ) =>
                                                                                                updateRoomImage(
                                                                                                    roomIndex,
                                                                                                    imgIndex,
                                                                                                    'virtual_image_id',
                                                                                                    id,
                                                                                                )
                                                                                            }
                                                                                        />
                                                                                    </div>
                                                                                </div>

                                                                                <div className="space-y-2">
                                                                                    <Label className="text-xs">
                                                                                        Real
                                                                                        Image
                                                                                        ID
                                                                                    </Label>
                                                                                    <div className="flex gap-2">
                                                                                        <Input
                                                                                            value={
                                                                                                img.real_image_id
                                                                                            }
                                                                                            onChange={(
                                                                                                e,
                                                                                            ) =>
                                                                                                updateRoomImage(
                                                                                                    roomIndex,
                                                                                                    imgIndex,
                                                                                                    'real_image_id',
                                                                                                    e
                                                                                                        .target
                                                                                                        .value,
                                                                                                )
                                                                                            }
                                                                                            placeholder="Optional"
                                                                                        />

                                                                                        <Select
                                                                                            value={
                                                                                                img.real_image_type
                                                                                            }
                                                                                            onValueChange={(
                                                                                                value,
                                                                                            ) =>
                                                                                                updateRoomImage(
                                                                                                    roomIndex,
                                                                                                    imgIndex,
                                                                                                    'real_image_type',
                                                                                                    value,
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            <SelectTrigger className="w-[120px]">
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
                                                                                            label="Pick"
                                                                                            mimeTypes={[
                                                                                                'image/jpeg',
                                                                                                'image/png',
                                                                                                'image/webp',
                                                                                            ]}
                                                                                            onPick={(
                                                                                                id,
                                                                                            ) =>
                                                                                                updateRoomImage(
                                                                                                    roomIndex,
                                                                                                    imgIndex,
                                                                                                    'real_image_id',
                                                                                                    id,
                                                                                                )
                                                                                            }
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </CardContent>
                                                                        </Card>
                                                                    ),
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ),
                                    )
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Direct Images Section */}
                    {!data.has_rooms && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Images</CardTitle>

                                    <div className="flex items-center gap-2">
                                        {/* shadcn multi target */}
                                        <div className="w-[160px]">
                                            <Select
                                                value={directMultiTarget}
                                                onValueChange={(v) =>
                                                    setDirectMultiTarget(
                                                        v as MultiTarget,
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="h-8 text-xs">
                                                    <SelectValue placeholder="Multi target" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="real">
                                                        Multi → Real IDs
                                                    </SelectItem>
                                                    <SelectItem value="virtual">
                                                        Multi → Virtual IDs
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <IdPickerButton
                                            multiple
                                            label="Pick Images (multi)"
                                            mimeTypes={[
                                                'image/jpeg',
                                                'image/png',
                                                'image/webp',
                                            ]}
                                            onPickMany={appendManyImages}
                                        />

                                        <Button
                                            type="button"
                                            onClick={addImage}
                                            size="sm"
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Image
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {data.images.length === 0 ? (
                                    <p className="py-8 text-center text-sm text-muted-foreground">
                                        No images added yet. Use “Pick Images
                                        (multi)” to add many at once, or click
                                        “Add Image”.
                                    </p>
                                ) : (
                                    data.images.map((img, index) => (
                                        <Card key={index}>
                                            <CardContent className="space-y-2 pt-4">
                                                <div className="mb-2 flex items-center justify-between">
                                                    <span className="text-sm font-medium">
                                                        Image {index + 1}
                                                    </span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            removeImage(index)
                                                        }
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>
                                                        Virtual Image ID
                                                    </Label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            value={
                                                                img.virtual_image_id
                                                            }
                                                            onChange={(e) =>
                                                                updateImage(
                                                                    index,
                                                                    'virtual_image_id',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="Optional"
                                                        />

                                                        <Select
                                                            value={
                                                                img.virtual_image_type
                                                            }
                                                            onValueChange={(
                                                                value,
                                                            ) =>
                                                                updateImage(
                                                                    index,
                                                                    'virtual_image_type',
                                                                    value,
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger className="w-[120px]">
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
                                                            label="Pick"
                                                            onPick={(id) =>
                                                                updateImage(
                                                                    index,
                                                                    'virtual_image_id',
                                                                    id,
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Real Image ID</Label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            value={
                                                                img.real_image_id
                                                            }
                                                            onChange={(e) =>
                                                                updateImage(
                                                                    index,
                                                                    'real_image_id',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="Optional"
                                                        />

                                                        <Select
                                                            value={
                                                                img.real_image_type
                                                            }
                                                            onValueChange={(
                                                                value,
                                                            ) =>
                                                                updateImage(
                                                                    index,
                                                                    'real_image_type',
                                                                    value,
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger className="w-[120px]">
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
                                                            label="Pick"
                                                            mimeTypes={[
                                                                'image/jpeg',
                                                                'image/png',
                                                                'image/webp',
                                                            ]}
                                                            onPick={(id) =>
                                                                updateImage(
                                                                    index,
                                                                    'real_image_id',
                                                                    id,
                                                                )
                                                            }
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
                            {processing ? 'Creating...' : 'Create Lot'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
