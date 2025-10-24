import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [

    {
        title: 'Home Page',
        href: '#',
    },
];

interface HomeData {
    first_section: any;
    hero_sections: any[];
    hero: any;
    services: any;
    service_links: any[];
    grid_section: any;
    grid_links: any[];
    testimonials: any[];
    settings: any;
}

interface Props {
    homeData: HomeData;
}

export default function HomePage({ homeData }: Props) {
    const [activeTab, setActiveTab] = useState('first-section');

    // First Section Form
    const firstSectionForm = useForm({
        video_id: homeData.first_section?.video_id || '',
        mobile_cover_image_id: homeData.first_section?.mobile_cover_image_id || '',
        logo_image_id: homeData.first_section?.logo_image_id || '',
        title: homeData.first_section?.title || '',
        subtitle: homeData.first_section?.subtitle || '',
        book_button_text: homeData.first_section?.book_button_text || '',
    });

    // Hero Form
    const heroForm = useForm({
        title: homeData.hero?.title || '',
        subtitle: homeData.hero?.subtitle || '',
    });

    // Services Form
    const servicesForm = useForm({
        title: homeData.services?.title || '',
        cover_image_id: homeData.services?.cover_image_id || '',
        description: homeData.services?.description || '',
    });

    // Grid Section Form
    const gridSectionForm = useForm({
        video_id: homeData.grid_section?.video_id || '',
        logo_image_id: homeData.grid_section?.logo_image_id || '',
    });

    // Settings Form
    const settingsForm = useForm({
        contact_title: homeData.settings?.contact_title || 'CONTACT',
    });

    const handleFirstSectionSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        firstSectionForm.put('/admin/home/first-section');
    };

    const handleHeroSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        heroForm.put('/admin/home/hero');
    };

    const handleServicesSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        servicesForm.put('/admin/home/services');
    };

    const handleGridSectionSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        gridSectionForm.put('/admin/home/grid-section');
    };

    const handleSettingsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        settingsForm.put('/admin/home/settings');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Home Page" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Home Page Management</h1>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="first-section">First Section</TabsTrigger>
                        <TabsTrigger value="hero">Hero</TabsTrigger>
                        <TabsTrigger value="services">Services</TabsTrigger>
                        <TabsTrigger value="grid">Grid Section</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="first-section" className="space-y-4">
                        <form onSubmit={handleFirstSectionSubmit}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>First Section</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="video_id">Video ID (Google Drive) *</Label>
                                        <Input
                                            id="video_id"
                                            value={firstSectionForm.data.video_id}
                                            onChange={(e) =>
                                                firstSectionForm.setData('video_id', e.target.value)
                                            }
                                            placeholder="Enter Google Drive video ID"
                                        />
                                        {firstSectionForm.errors.video_id && (
                                            <p className="text-sm text-destructive">
                                                {firstSectionForm.errors.video_id}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="mobile_cover_image_id">
                                            Mobile Cover Image ID (Google Drive) *
                                        </Label>
                                        <Input
                                            id="mobile_cover_image_id"
                                            value={firstSectionForm.data.mobile_cover_image_id}
                                            onChange={(e) =>
                                                firstSectionForm.setData(
                                                    'mobile_cover_image_id',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter Google Drive image ID"
                                        />
                                        {firstSectionForm.errors.mobile_cover_image_id && (
                                            <p className="text-sm text-destructive">
                                                {firstSectionForm.errors.mobile_cover_image_id}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="logo_image_id">
                                            Logo Image ID (Google Drive) *
                                        </Label>
                                        <Input
                                            id="logo_image_id"
                                            value={firstSectionForm.data.logo_image_id}
                                            onChange={(e) =>
                                                firstSectionForm.setData(
                                                    'logo_image_id',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter Google Drive image ID"
                                        />
                                        {firstSectionForm.errors.logo_image_id && (
                                            <p className="text-sm text-destructive">
                                                {firstSectionForm.errors.logo_image_id}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title *</Label>
                                        <Input
                                            id="title"
                                            value={firstSectionForm.data.title}
                                            onChange={(e) =>
                                                firstSectionForm.setData('title', e.target.value)
                                            }
                                            placeholder="Enter title"
                                        />
                                        {firstSectionForm.errors.title && (
                                            <p className="text-sm text-destructive">
                                                {firstSectionForm.errors.title}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subtitle">Subtitle</Label>
                                        <Input
                                            id="subtitle"
                                            value={firstSectionForm.data.subtitle}
                                            onChange={(e) =>
                                                firstSectionForm.setData('subtitle', e.target.value)
                                            }
                                            placeholder="Enter subtitle"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="book_button_text">Book Button Text</Label>
                                        <Input
                                            id="book_button_text"
                                            value={firstSectionForm.data.book_button_text}
                                            onChange={(e) =>
                                                firstSectionForm.setData(
                                                    'book_button_text',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="e.g., Book Now"
                                        />
                                    </div>

                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            disabled={firstSectionForm.processing}
                                        >
                                            {firstSectionForm.processing
                                                ? 'Updating...'
                                                : 'Update First Section'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </form>
                    </TabsContent>

                    <TabsContent value="hero" className="space-y-4">
                        <form onSubmit={handleHeroSubmit}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Hero Section</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="hero_title">Title *</Label>
                                        <Input
                                            id="hero_title"
                                            value={heroForm.data.title}
                                            onChange={(e) =>
                                                heroForm.setData('title', e.target.value)
                                            }
                                            placeholder="Enter hero title"
                                        />
                                        {heroForm.errors.title && (
                                            <p className="text-sm text-destructive">
                                                {heroForm.errors.title}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="hero_subtitle">Subtitle</Label>
                                        <Input
                                            id="hero_subtitle"
                                            value={heroForm.data.subtitle}
                                            onChange={(e) =>
                                                heroForm.setData('subtitle', e.target.value)
                                            }
                                            placeholder="Enter hero subtitle"
                                        />
                                    </div>

                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={heroForm.processing}>
                                            {heroForm.processing ? 'Updating...' : 'Update Hero'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </form>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Hero Sections (Icons)</CardTitle>
                                    <Link href="/admin/home-hero-sections">
                                        <Button variant="outline" size="sm">
                                            <ExternalLink className="mr-2 h-4 w-4" />
                                            Manage Sections
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    {homeData.hero_sections?.length || 0} section(s) configured
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="services" className="space-y-4">
                        <form onSubmit={handleServicesSubmit}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Services Section</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="services_title">Title *</Label>
                                        <Input
                                            id="services_title"
                                            value={servicesForm.data.title}
                                            onChange={(e) =>
                                                servicesForm.setData('title', e.target.value)
                                            }
                                            placeholder="Enter services title"
                                        />
                                        {servicesForm.errors.title && (
                                            <p className="text-sm text-destructive">
                                                {servicesForm.errors.title}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="services_cover">
                                            Cover Image ID (Google Drive) *
                                        </Label>
                                        <Input
                                            id="services_cover"
                                            value={servicesForm.data.cover_image_id}
                                            onChange={(e) =>
                                                servicesForm.setData(
                                                    'cover_image_id',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter Google Drive image ID"
                                        />
                                        {servicesForm.errors.cover_image_id && (
                                            <p className="text-sm text-destructive">
                                                {servicesForm.errors.cover_image_id}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="services_description">Description</Label>
                                        <Textarea
                                            id="services_description"
                                            value={servicesForm.data.description}
                                            onChange={(e) =>
                                                servicesForm.setData('description', e.target.value)
                                            }
                                            placeholder="Enter services description"
                                            rows={4}
                                        />
                                    </div>

                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={servicesForm.processing}>
                                            {servicesForm.processing
                                                ? 'Updating...'
                                                : 'Update Services'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </form>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Service Links</CardTitle>
                                    <Link href="/admin/home-service-links">
                                        <Button variant="outline" size="sm">
                                            <ExternalLink className="mr-2 h-4 w-4" />
                                            Manage Links
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    {homeData.service_links?.length || 0} link(s) configured
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="grid" className="space-y-4">
                        <form onSubmit={handleGridSectionSubmit}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Grid Section</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="grid_video_id">
                                            Video ID (Google Drive) *
                                        </Label>
                                        <Input
                                            id="grid_video_id"
                                            value={gridSectionForm.data.video_id}
                                            onChange={(e) =>
                                                gridSectionForm.setData('video_id', e.target.value)
                                            }
                                            placeholder="Enter Google Drive video ID"
                                        />
                                        {gridSectionForm.errors.video_id && (
                                            <p className="text-sm text-destructive">
                                                {gridSectionForm.errors.video_id}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="grid_logo_image_id">
                                            Logo Image ID (Google Drive) *
                                        </Label>
                                        <Input
                                            id="grid_logo_image_id"
                                            value={gridSectionForm.data.logo_image_id}
                                            onChange={(e) =>
                                                gridSectionForm.setData(
                                                    'logo_image_id',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter Google Drive image ID"
                                        />
                                        {gridSectionForm.errors.logo_image_id && (
                                            <p className="text-sm text-destructive">
                                                {gridSectionForm.errors.logo_image_id}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            disabled={gridSectionForm.processing}
                                        >
                                            {gridSectionForm.processing
                                                ? 'Updating...'
                                                : 'Update Grid Section'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </form>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Grid Links</CardTitle>
                                    <Link href="/admin/home-grid-links">
                                        <Button variant="outline" size="sm">
                                            <ExternalLink className="mr-2 h-4 w-4" />
                                            Manage Links
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    {homeData.grid_links?.length || 0} link(s) configured
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Testimonials</CardTitle>
                                    <Link href="/admin/home-testimonials">
                                        <Button variant="outline" size="sm">
                                            <ExternalLink className="mr-2 h-4 w-4" />
                                            Manage Testimonials
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    {homeData.testimonials?.length || 0} testimonial(s) configured
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-4">
                        <form onSubmit={handleSettingsSubmit}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Home Page Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="contact_title">Contact Title *</Label>
                                        <Input
                                            id="contact_title"
                                            value={settingsForm.data.contact_title}
                                            onChange={(e) =>
                                                settingsForm.setData(
                                                    'contact_title',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="e.g., CONTACT"
                                        />
                                        {settingsForm.errors.contact_title && (
                                            <p className="text-sm text-destructive">
                                                {settingsForm.errors.contact_title}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={settingsForm.processing}>
                                            {settingsForm.processing
                                                ? 'Updating...'
                                                : 'Update Settings'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </form>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
