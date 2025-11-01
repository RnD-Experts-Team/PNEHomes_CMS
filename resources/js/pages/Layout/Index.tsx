import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link as LinkIcon } from 'lucide-react';
import { useState } from 'react';
import { IdPickerButton } from '@/components/drive/IdPickerButton';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Layout & Settings', href: '#' },
];

interface LayoutData {
  navigation: any;
  navigation_links: any[];
  footer_links: any[];
  contact_info: any;
  contact_info_navigation: any;
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
    button: layoutData.contact_info?.button || '',
  });

  // NEW: separate form for header/nav contact info
  const contactNavForm = useForm({
    phone: layoutData.contact_info_navigation?.phone || '',
    button: layoutData.contact_info_navigation?.button || '',
  });

  const handleNavigationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigationForm.put('/admin/layout/navigation');
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactForm.put('/admin/layout/contact-info');
  };

  const handleContactNavSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactNavForm.put('/admin/layout/contact-info-navigation');
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Layout & Settings" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Layout & Settings</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="navigation">Navigation</TabsTrigger>
            <TabsTrigger value="footer">Footer</TabsTrigger>
            <TabsTrigger value="contact">Contact Info</TabsTrigger>
            <TabsTrigger value="contact-nav">Contact Info (Header)</TabsTrigger>
            <TabsTrigger value="social">Social Links</TabsTrigger>
          </TabsList>

          {/* NAVIGATION */}
          <TabsContent value="navigation" className="space-y-4">
            <form onSubmit={handleNavigationSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Navigation Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="logo_image_id">Logo Image ID (Google Drive) *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="logo_image_id"
                        value={navigationForm.data.logo_image_id}
                        onChange={(e) => navigationForm.setData('logo_image_id', e.target.value)}
                        placeholder="Enter Google Drive file ID"
                      />
                      <IdPickerButton
                        onPick={(id) => navigationForm.setData('logo_image_id', id)}
                      />
                    </div>
                    {navigationForm.errors.logo_image_id && (
                      <p className="text-sm text-destructive">
                        {navigationForm.errors.logo_image_id}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={navigationForm.processing}>
                      {navigationForm.processing ? 'Updating...' : 'Update Navigation'}
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

          {/* FOOTER */}
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

          {/* CONTACT (GLOBAL) */}
          <TabsContent value="contact" className="space-y-4">
            <form onSubmit={handleContactSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (digits only)</Label>
                    <Input
                      id="phone"
                      value={contactForm.data.phone}
                      onChange={(e) => contactForm.setData('phone', e.target.value)}
                      placeholder="e.g. 359888123456"
                      inputMode="numeric"
                      pattern="\d*"
                    />
                    {contactForm.errors.phone && (
                      <p className="text-sm text-destructive">{contactForm.errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="button">Button Text</Label>
                    <Input
                      id="button"
                      value={contactForm.data.button}
                      onChange={(e) => contactForm.setData('button', e.target.value)}
                      placeholder="e.g. Contact Us"
                    />
                    {contactForm.errors.button && (
                      <p className="text-sm text-destructive">{contactForm.errors.button}</p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={contactForm.processing}>
                      {contactForm.processing ? 'Updating...' : 'Update Contact Info'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </TabsContent>

          {/* CONTACT (HEADER/NAV) */}
          <TabsContent value="contact-nav" className="space-y-4">
            <form onSubmit={handleContactNavSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Contact Info (Header/Navigation)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nav_phone">Phone (digits only)</Label>
                    <Input
                      id="nav_phone"
                      value={contactNavForm.data.phone}
                      onChange={(e) => contactNavForm.setData('phone', e.target.value)}
                      placeholder="e.g. 359888123456"
                      inputMode="numeric"
                      pattern="\d*"
                    />
                    {contactNavForm.errors.phone && (
                      <p className="text-sm text-destructive">{contactNavForm.errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nav_button">Button Text</Label>
                    <Input
                      id="nav_button"
                      value={contactNavForm.data.button}
                      onChange={(e) => contactNavForm.setData('button', e.target.value)}
                      placeholder="e.g. Call Now"
                    />
                    {contactNavForm.errors.button && (
                      <p className="text-sm text-destructive">{contactNavForm.errors.button}</p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={contactNavForm.processing}>
                      {contactNavForm.processing ? 'Updating...' : 'Update Header Contact Info'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </TabsContent>

          {/* SOCIAL */}
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
