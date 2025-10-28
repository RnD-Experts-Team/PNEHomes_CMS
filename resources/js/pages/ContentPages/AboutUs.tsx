import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IdPickerButton } from '@/components/drive/IdPickerButton';
import QuillEditorPro from '@/components/QuillEditorPro';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'About Us', href: '#' },
];

interface AboutUs {
  cover_image_id: string;
  slogan: string;
  title: string;
  content: string;
}

interface Props {
  aboutUs?: AboutUs;
}

interface FormData {
  cover_image_id: string;
  slogan: string;
  title: string;
  content: string;
}

export default function AboutUsPage({ aboutUs }: Props) {
  const { data, setData, put, processing, errors } = useForm<FormData>({
    cover_image_id: aboutUs?.cover_image_id || '',
    slogan: aboutUs?.slogan || '',
    title: aboutUs?.title || '',
    content: aboutUs?.content || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put('/admin/about-us');
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="About Us" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">About Us Page</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cover_image_id">Cover Image ID (Google Drive) *</Label>
                <div className="flex gap-2">
                  <Input
                    id="cover_image_id"
                    value={data.cover_image_id}
                    onChange={(e) => setData('cover_image_id', e.target.value)}
                    placeholder="Enter Google Drive file ID"
                  />
                  <IdPickerButton onPick={(id) => setData('cover_image_id', id)} />
                </div>
                {errors.cover_image_id && (
                  <p className="text-sm text-destructive">{errors.cover_image_id}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slogan">Slogan *</Label>
                <Input
                  id="slogan"
                  value={data.slogan}
                  onChange={(e) => setData('slogan', e.target.value)}
                  placeholder="Enter slogan"
                />
                {errors.slogan && (
                  <p className="text-sm text-destructive">{errors.slogan}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={data.title}
                  onChange={(e) => setData('title', e.target.value)}
                  placeholder="Enter title"
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>

                <QuillEditorPro
                  value={data.content}
                  onChange={(html) => setData('content', html)}
                  placeholder="Write your About Us content…"
                  height="500px"
                  className="w-full"
                />

                {errors.content && (
                  <p className="text-sm text-destructive">{errors.content}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  This editor supports headings, colors, lists, links, images (upload or URL), video, code blocks, RTL, and more.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={processing}>
              {processing ? 'Updating...' : 'Update About Us'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
