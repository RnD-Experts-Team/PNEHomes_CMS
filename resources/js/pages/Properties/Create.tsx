import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, X, Trash2 } from 'lucide-react';
import { IdPickerButton } from '@/components/drive/IdPickerButton';
import QuillEditorPro from '@/components/QuillEditorPro';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Properties', href: '/admin/properties' },
  { title: 'Create', href: '#' },
];

interface FormData {
  title: string;
  community: string;
  price: string;
  beds: string;
  baths: string;
  garages: string;
  sqft: string;
  zillow_link: string;
  order: number;
  is_active: boolean;
  gallery: string[];
  whats_special: {
    badges: string[];
    description: string;
  };
  facts_features: Array<{
    title: string;
    list: string[];
  }>;
  floor_plans: Array<{
    title: string;
    image_id: string;
    description: string;
  }>;
}

export default function PropertyCreate() {
  const { data, setData, post, processing, errors } = useForm<FormData>({
    title: '',
    community: '',
    price: '',
    beds: '',
    baths: '',
    garages: '',
    sqft: '',
    zillow_link: '',
    order: 0,
    is_active: true,
    gallery: [],
    whats_special: {
      badges: [],
      description: '',
    },
    facts_features: [],
    floor_plans: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/properties');
  };

  // ----- Gallery management
  const addGalleryImage = () => {
    setData('gallery', [...data.gallery, '']);
  };

  const appendManyGalleryImages = (ids: string[]) => {
    if (!ids.length) return;
    setData('gallery', [...data.gallery, ...ids]);
  };

  const updateGalleryImage = (index: number, value: string) => {
    const newGallery = [...data.gallery];
    newGallery[index] = value;
    setData('gallery', newGallery);
  };

  const removeGalleryImage = (index: number) => {
    setData('gallery', data.gallery.filter((_, i) => i !== index));
  };

  // ----- What's Special badges
  const addBadge = () => {
    setData('whats_special', {
      ...data.whats_special,
      badges: [...data.whats_special.badges, ''],
    });
  };

  const updateBadge = (index: number, value: string) => {
    const newBadges = [...data.whats_special.badges];
    newBadges[index] = value;
    setData('whats_special', { ...data.whats_special, badges: newBadges });
  };

  const removeBadge = (index: number) => {
    setData('whats_special', {
      ...data.whats_special,
      badges: data.whats_special.badges.filter((_, i) => i !== index),
    });
  };

  // ----- Facts & Features
  const addFactFeature = () => {
    setData('facts_features', [...data.facts_features, { title: '', list: [] }]);
  };

  const updateFactFeature = (index: number, field: 'title' | 'list', value: any) => {
    const newFacts = [...data.facts_features];
    newFacts[index][field] = value;
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
    newFacts[factIndex].list = newFacts[factIndex].list.filter((_, i) => i !== itemIndex);
    setData('facts_features', newFacts);
  };

  // ----- Floor Plans
  const addFloorPlan = () => {
    setData('floor_plans', [...data.floor_plans, { title: '', image_id: '', description: '' }]);
  };

  const updateFloorPlan = (index: number, field: keyof FormData['floor_plans'][0], value: string) => {
    const newPlans = [...data.floor_plans];
    newPlans[index][field] = value;
    setData('floor_plans', newPlans);
  };

  const removeFloorPlan = (index: number) => {
    setData('floor_plans', data.floor_plans.filter((_, i) => i !== index));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Property" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Create Property</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="special">What's Special</TabsTrigger>
              <TabsTrigger value="facts">Facts & Features</TabsTrigger>
              <TabsTrigger value="plans">Floor Plans</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-4">
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
                      onChange={(e) => setData('title', e.target.value)}
                      placeholder="PNE PLAN 56550SM"
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive">{errors.title}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Slug will be auto-generated from title
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="community">Community *</Label>
                      <Input
                        id="community"
                        value={data.community}
                        onChange={(e) => setData('community', e.target.value)}
                        placeholder="Beulah Park"
                      />
                      {errors.community && (
                        <p className="text-sm text-destructive">{errors.community}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Price *</Label>
                      <Input
                        id="price"
                        value={data.price}
                        onChange={(e) => setData('price', e.target.value)}
                        placeholder="289900"
                      />
                      {errors.price && (
                        <p className="text-sm text-destructive">{errors.price}</p>
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
                        placeholder="2"
                      />
                      {errors.beds && (
                        <p className="text-sm text-destructive">{errors.beds}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="baths">Baths *</Label>
                      <Input
                        id="baths"
                        value={data.baths}
                        onChange={(e) => setData('baths', e.target.value)}
                        placeholder="3.5"
                      />
                      {errors.baths && (
                        <p className="text-sm text-destructive">{errors.baths}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="garages">Garages *</Label>
                      <Input
                        id="garages"
                        value={data.garages}
                        onChange={(e) => setData('garages', e.target.value)}
                        placeholder="1"
                      />
                      {errors.garages && (
                        <p className="text-sm text-destructive">{errors.garages}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sqft">Sq Ft *</Label>
                      <Input
                        id="sqft"
                        value={data.sqft}
                        onChange={(e) => setData('sqft', e.target.value)}
                        placeholder="2343"
                      />
                      {errors.sqft && (
                        <p className="text-sm text-destructive">{errors.sqft}</p>
                      )}
                    </div>
                  </div>

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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="order">Order</Label>
                      <Input
                        id="order"
                        type="number"
                        value={data.order}
                        onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
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
            </TabsContent>

            {/* Gallery Tab */}
            <TabsContent value="gallery" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Gallery Images</CardTitle>
                    <div className="flex gap-2">
                      {/* NEW: multi-pick to append many IDs at once */}
                      <IdPickerButton
                        multiple
                        label="Pick Images (multi)"
                        mimeTypes={['image/jpeg', 'image/png', 'image/webp']}
                        onPickMany={appendManyGalleryImages}
                      />
                      <Button type="button" onClick={addGalleryImage} size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Image
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.gallery.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No images added yet
                    </p>
                  ) : (
                    data.gallery.map((imageId, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={imageId}
                          onChange={(e) => updateGalleryImage(index, e.target.value)}
                          placeholder="Google Drive file ID"
                        />
                        {/* keep single picker */}
                        <IdPickerButton onPick={(id) => updateGalleryImage(index, id)} />
                        {/* Optional per-row multi: replace + insert after */}
                        <IdPickerButton
                          multiple
                          label="Multi"
                          mimeTypes={['image/jpeg', 'image/png', 'image/webp']}
                          onPickMany={(ids) => {
                            if (!ids.length) return;
                            const first = ids[0];
                            const rest = ids.slice(1);
                            const newGallery = [...data.gallery];
                            newGallery[index] = first;
                            if (rest.length) newGallery.splice(index + 1, 0, ...rest);
                            setData('gallery', newGallery);
                          }}
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

            {/* What's Special Tab */}
            <TabsContent value="special" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>What's Special</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Badges</Label>
                      <Button type="button" onClick={addBadge} size="sm" variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Badge
                      </Button>
                    </div>
                    {data.whats_special.badges.map((badge, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={badge}
                          onChange={(e) => updateBadge(index, e.target.value)}
                          placeholder="Open-concept floor plan"
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

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <QuillEditorPro
                      value={data.whats_special.description}
                      onChange={(html) =>
                        setData('whats_special', { ...data.whats_special, description: html })
                      }
                      placeholder="Enter description..."
                      height="300px"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Facts & Features Tab */}
            <TabsContent value="facts" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Facts & Features</CardTitle>
                    <Button type="button" onClick={addFactFeature} size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Section
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.facts_features.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No facts & features added yet
                    </p>
                  ) : (
                    data.facts_features.map((fact, factIndex) => (
                      <Card key={factIndex}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">
                              Section {factIndex + 1}
                            </CardTitle>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFactFeature(factIndex)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label>Section Title</Label>
                            <Input
                              value={fact.title}
                              onChange={(e) =>
                                updateFactFeature(factIndex, 'title', e.target.value)
                              }
                              placeholder="Kitchen"
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label>Items</Label>
                              <Button
                                type="button"
                                onClick={() => addFactItem(factIndex)}
                                size="sm"
                                variant="outline"
                              >
                                <Plus className="mr-2 h-3 w-3" />
                                Add Item
                              </Button>
                            </div>
                            {fact.list.map((item, itemIndex) => (
                              <div key={itemIndex} className="flex gap-2">
                                <Input
                                  value={item}
                                  onChange={(e) =>
                                    updateFactItem(factIndex, itemIndex, e.target.value)
                                  }
                                  placeholder="Granite countertops"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => removeFactItem(factIndex, itemIndex)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Floor Plans Tab */}
            <TabsContent value="plans" className="space-y-4">
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
                      No floor plans added yet
                    </p>
                  ) : (
                    data.floor_plans.map((plan, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">
                              Floor Plan {index + 1}
                            </CardTitle>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFloorPlan(index)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                              value={plan.title}
                              onChange={(e) =>
                                updateFloorPlan(index, 'title', e.target.value)
                              }
                              placeholder="Main Level"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Image ID (Google Drive)</Label>
                            <div className="flex gap-2">
                              <Input
                                value={plan.image_id}
                                onChange={(e) =>
                                  updateFloorPlan(index, 'image_id', e.target.value)
                                }
                                placeholder="Google Drive file ID"
                              />
                              {/* keep single picker for plan image */}
                              <IdPickerButton
                                onPick={(id) => updateFloorPlan(index, 'image_id', id)}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                              value={plan.description}
                              onChange={(e) =>
                                updateFloorPlan(index, 'description', e.target.value)
                              }
                              placeholder="Optional description"
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
              {processing ? 'Creating...' : 'Create Property'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
