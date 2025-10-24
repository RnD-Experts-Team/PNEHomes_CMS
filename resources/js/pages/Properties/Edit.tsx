import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PropertyGallery {
    id: number;
    image_id: string;
}

interface PropertyWhatsSpecial {
    badges: string[];
    description: string;
}

interface PropertyFactsFeature {
    id: number;
    title: string;
    list: string[];
}

interface PropertyFloorPlan {
    id: number;
    title: string;
    image_id: string;
    description: string;
}

interface Property {
    id: number;
    title: string;
    slug: string;
    community: string;
    price: string;
    beds: string;
    baths: string;
    garages: string;
    sqft: string;
    zillow_link?: string;
    next_property_slug?: string;
    prev_property_slug?: string;
    cover_image_id?: string;
    order: number;
    is_active: boolean;
    gallery: PropertyGallery[];
    whatsSpecial?: PropertyWhatsSpecial;
    factsFeatures: PropertyFactsFeature[];
    floorPlans: PropertyFloorPlan[];
}

interface Props {
    property: Property;
}

interface FactsFeature {
    title: string;
    list: string[];
}

interface FloorPlan {
    title: string;
    image_id: string;
    description: string;
}

interface FormData {
    title: string;
    slug: string;
    community: string;
    price: string;
    beds: string;
    baths: string;
    garages: string;
    sqft: string;
    zillow_link: string;
    next_property_slug: string;
    prev_property_slug: string;
    cover_image_id: string;
    order: number;
    is_active: boolean;
    gallery: string[];
    whats_special: {
        badges: string[];
        description: string;
    };
    facts_features: FactsFeature[];
    floor_plans: FloorPlan[];
}

export default function PropertyEdit({ property }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
        {
            title: 'Properties',
            href: '/admin/properties',
        },
        {
            title: 'Edit',
            href: '#',
        },
    ];

    const { data, setData, put, processing, errors } = useForm<FormData>({
        title: property.title || '',
        slug: property.slug || '',
        community: property.community || '',
        price: property.price || '',
        beds: property.beds || '',
        baths: property.baths || '',
        garages: property.garages || '',
        sqft: property.sqft || '',
        zillow_link: property.zillow_link || '',
        next_property_slug: property.next_property_slug || '',
        prev_property_slug: property.prev_property_slug || '',
        cover_image_id: property.cover_image_id || '',
        order: property.order || 0,
        is_active: property.is_active,
        gallery: property.gallery?.map((g) => g.image_id) || [],
        whats_special: {
            badges: property.whatsSpecial?.badges || [],
            description: property.whatsSpecial?.description || '',
        },
        facts_features:
            property.factsFeatures?.map((f) => ({
                title: f.title,
                list: f.list,
            })) || [],
        floor_plans:
            property.floorPlans?.map((p) => ({
                title: p.title,
                image_id: p.image_id,
                description: p.description,
            })) || [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/properties/${property.id}`);
    };

    // Gallery functions
    const addGalleryImage = () => {
        setData('gallery', [...data.gallery, '']);
    };

    const updateGalleryImage = (index: number, value: string) => {
        const newGallery = [...data.gallery];
        newGallery[index] = value;
        setData('gallery', newGallery);
    };

    const removeGalleryImage = (index: number) => {
        setData('gallery', data.gallery.filter((_, i) => i !== index));
    };

    // Badge functions
    const addBadge = () => {
        setData('whats_special', {
            ...data.whats_special,
            badges: [...data.whats_special.badges, ''],
        });
    };

    const updateBadge = (index: number, value: string) => {
        const newBadges = [...data.whats_special.badges];
        newBadges[index] = value;
        setData('whats_special', {
            ...data.whats_special,
            badges: newBadges,
        });
    };

    const removeBadge = (index: number) => {
        setData('whats_special', {
            ...data.whats_special,
            badges: data.whats_special.badges.filter((_, i) => i !== index),
        });
    };

    // Facts & Features functions
    const addFactFeature = () => {
        setData('facts_features', [
            ...data.facts_features,
            { title: '', list: [''] },
        ]);
    };

    const updateFactFeature = (
        index: number,
        field: 'title' | 'list',
        value: string | string[]
    ) => {
        const newFacts = [...data.facts_features];
        newFacts[index][field] = value as any;
        setData('facts_features', newFacts);
    };

    const removeFactFeature = (index: number) => {
        setData('facts_features', data.facts_features.filter((_, i) => i !== index));
    };

    const addFactItem = (factIndex: number) => {
        const newFacts = [...data.facts_features];
        newFacts[factIndex].list.push('');
        setData('facts_features', newFacts);
    };

    const updateFactItem = (factIndex: number, itemIndex: number, value: string) => {
        const newFacts = [...data.facts_features];
        newFacts[factIndex].list[itemIndex] = value;
        setData('facts_features', newFacts);
    };

    const removeFactItem = (factIndex: number, itemIndex: number) => {
        const newFacts = [...data.facts_features];
        newFacts[factIndex].list = newFacts[factIndex].list.filter(
            (_, i) => i !== itemIndex
        );
        setData('facts_features', newFacts);
    };

    // Floor Plans functions
    const addFloorPlan = () => {
        setData('floor_plans', [
            ...data.floor_plans,
            { title: '', image_id: '', description: '' },
        ]);
    };

    const updateFloorPlan = (
        index: number,
        field: keyof FloorPlan,
        value: string
    ) => {
        const newPlans = [...data.floor_plans];
        newPlans[index][field] = value;
        setData('floor_plans', newPlans);
    };

    const removeFloorPlan = (index: number) => {
        setData('floor_plans', data.floor_plans.filter((_, i) => i !== index));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Property - ${property.title}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Edit Property</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="basic">Basic Info</TabsTrigger>
                            <TabsTrigger value="gallery">Gallery</TabsTrigger>
                            <TabsTrigger value="special">What's Special</TabsTrigger>
                            <TabsTrigger value="facts">Facts & Features</TabsTrigger>
                            <TabsTrigger value="floors">Floor Plans</TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic" className="space-y-4">
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
                                                placeholder="Enter property title"
                                            />
                                            {errors.title && (
                                                <p className="text-sm text-destructive">
                                                    {errors.title}
                                                </p>
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
                                            <Label htmlFor="community">Community *</Label>
                                            <Input
                                                id="community"
                                                value={data.community}
                                                onChange={(e) =>
                                                    setData('community', e.target.value)
                                                }
                                                placeholder="Enter community name"
                                            />
                                            {errors.community && (
                                                <p className="text-sm text-destructive">
                                                    {errors.community}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="price">Price *</Label>
                                            <Input
                                                id="price"
                                                value={data.price}
                                                onChange={(e) => setData('price', e.target.value)}
                                                placeholder="e.g., $500,000"
                                            />
                                            {errors.price && (
                                                <p className="text-sm text-destructive">
                                                    {errors.price}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="beds">Beds *</Label>
                                            <Input
                                                id="beds"
                                                value={data.beds}
                                                onChange={(e) => setData('beds', e.target.value)}
                                                placeholder="e.g., 3"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="baths">Baths *</Label>
                                            <Input
                                                id="baths"
                                                value={data.baths}
                                                onChange={(e) => setData('baths', e.target.value)}
                                                placeholder="e.g., 2.5"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="garages">Garages *</Label>
                                            <Input
                                                id="garages"
                                                value={data.garages}
                                                onChange={(e) =>
                                                    setData('garages', e.target.value)
                                                }
                                                placeholder="e.g., 2"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="sqft">Sqft *</Label>
                                            <Input
                                                id="sqft"
                                                value={data.sqft}
                                                onChange={(e) => setData('sqft', e.target.value)}
                                                placeholder="e.g., 2,500"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="zillow_link">Zillow Link</Label>
                                        <Input
                                            id="zillow_link"
                                            value={data.zillow_link}
                                            onChange={(e) =>
                                                setData('zillow_link', e.target.value)
                                            }
                                            placeholder="https://zillow.com/..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="prev_property_slug">
                                                Previous Property Slug
                                            </Label>
                                            <Input
                                                id="prev_property_slug"
                                                value={data.prev_property_slug}
                                                onChange={(e) =>
                                                    setData('prev_property_slug', e.target.value)
                                                }
                                                placeholder="previous-property-slug"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="next_property_slug">
                                                Next Property Slug
                                            </Label>
                                            <Input
                                                id="next_property_slug"
                                                value={data.next_property_slug}
                                                onChange={(e) =>
                                                    setData('next_property_slug', e.target.value)
                                                }
                                                placeholder="next-property-slug"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="cover_image_id">
                                            Cover Image ID (Google Drive)
                                        </Label>
                                        <Input
                                            id="cover_image_id"
                                            value={data.cover_image_id}
                                            onChange={(e) =>
                                                setData('cover_image_id', e.target.value)
                                            }
                                            placeholder="Enter Google Drive file ID"
                                        />
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
                        </TabsContent>

                        <TabsContent value="gallery" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Gallery Images</CardTitle>
                                        <Button
                                            type="button"
                                            onClick={addGalleryImage}
                                            size="sm"
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Image
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {data.gallery.length === 0 ? (
                                        <p className="text-sm text-muted-foreground text-center py-8">
                                            No images added yet. Click "Add Image" to get started.
                                        </p>
                                    ) : (
                                        data.gallery.map((imageId, index) => (
                                            <div key={index} className="flex gap-2">
                                                <Input
                                                    value={imageId}
                                                    onChange={(e) =>
                                                        updateGalleryImage(index, e.target.value)
                                                    }
                                                    placeholder="Enter Google Drive file ID"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => removeGalleryImage(index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="special" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>What's Special</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label>Badges</Label>
                                            <Button type="button" onClick={addBadge} size="sm">
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add Badge
                                            </Button>
                                        </div>
                                        <div className="space-y-2">
                                            {data.whats_special.badges.map((badge, index) => (
                                                <div key={index} className="flex gap-2">
                                                    <Input
                                                        value={badge}
                                                        onChange={(e) =>
                                                            updateBadge(index, e.target.value)
                                                        }
                                                        placeholder="Enter badge text"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => removeBadge(index)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="special_description">Description *</Label>
                                        <Textarea
                                            id="special_description"
                                            value={data.whats_special.description}
                                            onChange={(e) =>
                                                setData('whats_special', {
                                                    ...data.whats_special,
                                                    description: e.target.value,
                                                })
                                            }
                                            placeholder="Enter what's special description"
                                            rows={4}
                                        />
                                        {errors['whats_special.description'] && (
                                            <p className="text-sm text-destructive">
                                                {errors['whats_special.description']}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="facts" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Facts & Features</CardTitle>
                                        <Button
                                            type="button"
                                            onClick={addFactFeature}
                                            size="sm"
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Section
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {data.facts_features.length === 0 ? (
                                        <p className="text-sm text-muted-foreground text-center py-8">
                                            No facts & features added yet.
                                        </p>
                                    ) : (
                                        data.facts_features.map((fact, factIndex) => (
                                            <Card key={factIndex}>
                                                <CardContent className="pt-6 space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-semibold">
                                                            Section {factIndex + 1}
                                                        </h4>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                removeFactFeature(factIndex)
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Title *</Label>
                                                        <Input
                                                            value={fact.title}
                                                            onChange={(e) =>
                                                                updateFactFeature(
                                                                    factIndex,
                                                                    'title',
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="Enter section title"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <Label>List Items *</Label>
                                                            <Button
                                                                type="button"
                                                                onClick={() =>
                                                                    addFactItem(factIndex)
                                                                }
                                                                size="sm"
                                                            >
                                                                <Plus className="mr-2 h-4 w-4" />
                                                                Add Item
                                                            </Button>
                                                        </div>
                                                        <div className="space-y-2">
                                                            {fact.list.map((item, itemIndex) => (
                                                                <div
                                                                    key={itemIndex}
                                                                    className="flex gap-2"
                                                                >
                                                                    <Input
                                                                        value={item}
                                                                        onChange={(e) =>
                                                                            updateFactItem(
                                                                                factIndex,
                                                                                itemIndex,
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        placeholder="Enter list item"
                                                                    />
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="icon"
                                                                        onClick={() =>
                                                                            removeFactItem(
                                                                                factIndex,
                                                                                itemIndex
                                                                            )
                                                                        }
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="floors" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Floor Plans</CardTitle>
                                        <Button type="button" onClick={addFloorPlan} size="sm">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Floor Plan
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {data.floor_plans.length === 0 ? (
                                        <p className="text-sm text-muted-foreground text-center py-8">
                                            No floor plans added yet.
                                        </p>
                                    ) : (
                                        data.floor_plans.map((plan, index) => (
                                            <Card key={index}>
                                                <CardContent className="pt-6 space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-semibold">
                                                            Plan {index + 1}
                                                        </h4>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => removeFloorPlan(index)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Title *</Label>
                                                        <Input
                                                            value={plan.title}
                                                            onChange={(e) =>
                                                                updateFloorPlan(
                                                                    index,
                                                                    'title',
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="Enter floor plan title"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Image ID (Google Drive) *</Label>
                                                        <Input
                                                            value={plan.image_id}
                                                            onChange={(e) =>
                                                                updateFloorPlan(
                                                                    index,
                                                                    'image_id',
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="Enter Google Drive file ID"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Description *</Label>
                                                        <Textarea
                                                            value={plan.description}
                                                            onChange={(e) =>
                                                                updateFloorPlan(
                                                                    index,
                                                                    'description',
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="Enter floor plan description"
                                                            rows={3}
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Property'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
