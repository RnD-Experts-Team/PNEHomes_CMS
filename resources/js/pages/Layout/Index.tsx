import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link as LinkIcon } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Layout & Settings', href: '#' },
];

interface LayoutData {
    navigation: any;
    navigation_links: any[];
    footer_links: any[];
    contact_info: any;
    social_links: any[];
}

interface Props {
    layoutData: LayoutData;
}

export default function LayoutIndex({ layoutData }: Props) {
    const [activeTab, setActiveTab] = useState('navigation');

    const navigationForm = useForm({
        logo_image_id: layoutData.navigation?.logo_image_id || '',
    });

    const contactForm = useForm({
        phone: layoutData.contact_info?.phone || '',
        email: layoutData.contact_info?.email || '',
        address: layoutData.contact_info?.address || '',
    });

    const handleNavigationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigationForm.put('/admin/layout/navigation');
    };

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        contactForm.put('/admin/layout/contact-info');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Layout & Settings" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Layout & Settings</h1>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="navigation">Navigation</TabsTrigger>
                        <TabsTrigger value="footer">Footer</TabsTrigger>
                        <TabsTrigger value="contact">Contact Info</TabsTrigger>
                        <TabsTrigger value="social">Social Links</TabsTrigger>
                    </TabsList>

                    <TabsContent value="navigation" className="space-y-4">
                        <form onSubmit={handleNavigationSubmit}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Navigation Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="logo_image_id">
                                            Logo Image ID (Google Drive) *
                                        </Label>
                                        <Input
                                            id="logo_image_id"
                                            value={navigationForm.data.logo_image_id}
                                            onChange={(e) =>
                                                navigationForm.setData('logo_image_id', e.target.value)
                                            }
                                            placeholder="Enter Google Drive file ID"
                                        />
                                        {navigationForm.errors.logo_image_id && (
                                            <p className="text-sm text-destructive">
                                                {navigationForm.errors.logo_image_id}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={navigationForm.processing}>
                                            {navigationForm.processing
                                                ? 'Updating...'
                                                : 'Update Navigation'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </form>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Navigation Links</CardTitle>
                                    <Link href="/admin/navigation-links">
                                        <Button variant="outline" size="sm">
                                            <LinkIcon className="mr-2 h-4 w-4" />
                                            Manage Links
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    {layoutData.navigation_links.length} link(s) configured
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="footer" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Footer Links</CardTitle>
                                    <Link href="/admin/footer-links">
                                        <Button variant="outline" size="sm">
                                            <LinkIcon className="mr-2 h-4 w-4" />
                                            Manage Links
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    {layoutData.footer_links.length} link(s) configured
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="contact" className="space-y-4">
                        <form onSubmit={handleContactSubmit}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Contact Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            value={contactForm.data.phone}
                                            onChange={(e) =>
                                                contactForm.setData('phone', e.target.value)
                                            }
                                            placeholder="Enter phone number"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={contactForm.data.email}
                                            onChange={(e) =>
                                                contactForm.setData('email', e.target.value)
                                            }
                                            placeholder="Enter email address"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Textarea
                                            id="address"
                                            value={contactForm.data.address}
                                            onChange={(e) =>
                                                contactForm.setData('address', e.target.value)
                                            }
                                            placeholder="Enter address"
                                            rows={3}
                                        />
                                    </div>

                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={contactForm.processing}>
                                            {contactForm.processing
                                                ? 'Updating...'
                                                : 'Update Contact Info'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </form>
                    </TabsContent>

                    <TabsContent value="social" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Social Media Links</CardTitle>
                                    <Link href="/admin/social-links">
                                        <Button variant="outline" size="sm">
                                            <LinkIcon className="mr-2 h-4 w-4" />
                                            Manage Links
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    {layoutData.social_links.length} link(s) configured
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
