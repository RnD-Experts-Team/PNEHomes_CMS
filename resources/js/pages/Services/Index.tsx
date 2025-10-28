import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, Settings } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IdPickerButton } from '@/components/drive/IdPickerButton';
import { useState } from 'react';

interface Service {
    id: number;
    slug: string;
    title: string;
    sub_title?: string;
    order: number;
    is_active: boolean;
    created_at: string;
}

interface ServiceSettings {
    image_id: string;
}

interface Props {
    services: Service[];
    settings?: ServiceSettings;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Services',
        href: '#',
    },
];

export default function ServicesIndex({ services, settings }: Props) {
    const [settingsOpen, setSettingsOpen] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        image_id: settings?.image_id || '',
    });

    const handleDelete = (id: number) => {
        router.delete(`/admin/services/${id}`, {
            preserveScroll: true,
        });
    };

    const handleSettingsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/admin/services/settings', {
            preserveScroll: true,
            onSuccess: () => {
                setSettingsOpen(false);
                // Reload page data to reflect the updated settings
                router.reload({ only: ['settings'] });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Services" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Services</h1>
                    <div className="flex gap-2">
                        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Settings
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <form onSubmit={handleSettingsSubmit}>
                                    <DialogHeader>
                                        <DialogTitle>Services Settings</DialogTitle>
                                        <DialogDescription>
                                            Update the services page cover image
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="image_id">
                                                Cover Image ID (Google Drive) *
                                            </Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    id="image_id"
                                                    value={data.image_id}
                                                    onChange={(e) =>
                                                        setData('image_id', e.target.value)
                                                    }
                                                    placeholder="Enter Google Drive file ID"
                                                />
                                                <IdPickerButton
                                                    onPick={(id) => setData('image_id', id)}
                                                />
                                            </div>
                                            {errors.image_id && (
                                                <p className="text-sm text-destructive">
                                                    {errors.image_id}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setSettingsOpen(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={processing}>
                                            {processing ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>

                        <Link href="/admin/services/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Service
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {services.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">
                                        No services found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                services.map((service) => (
                                    <TableRow key={service.id}>
                                        <TableCell>{service.order}</TableCell>
                                        <TableCell className="font-medium">
                                            {service.title}
                                        </TableCell>
                                        <TableCell>
                                            <code className="rounded bg-muted px-2 py-1 text-sm">
                                                {service.slug}
                                            </code>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    service.is_active ? 'default' : 'secondary'
                                                }
                                            >
                                                {service.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/admin/services/${service.id}/edit`}
                                                >
                                                    <Button variant="outline" size="sm">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Delete Service
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to delete "
                                                                {service.title}"? This action
                                                                cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>
                                                                Cancel
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() =>
                                                                    handleDelete(service.id)
                                                                }
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
