import { Head, Link, router } from '@inertiajs/react';
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
import { Pencil, Trash2, Plus } from 'lucide-react';
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

interface Album {
    id: number;
    slug: string;
    title: string;
    has_sub_albums: boolean;
    sub_albums_count: number;
    images_count: number;
    order: number;
    is_active: boolean;
}

interface Props {
    albums: Album[];
}

const breadcrumbs: BreadcrumbItem[] = [

    {
        title: 'Gallery Albums',
        href: '#',
    },
];

export default function GalleryIndex({ albums }: Props) {
    const handleDelete = (id: number) => {
        router.delete(`/admin/gallery-albums/${id}`, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gallery Albums" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Gallery Albums</h1>
                    <Link href="/admin/gallery-albums/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Album
                        </Button>
                    </Link>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Sub Albums</TableHead>
                                <TableHead>Images</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {albums.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center">
                                        No albums found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                albums.map((album) => (
                                    <TableRow key={album.id}>
                                        <TableCell>{album.order}</TableCell>
                                        <TableCell className="font-medium">
                                            {album.title}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {album.has_sub_albums
                                                    ? 'With Sub Albums'
                                                    : 'Direct Images'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{album.sub_albums_count || 0}</TableCell>
                                        <TableCell>{album.images_count || 0}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    album.is_active ? 'default' : 'secondary'
                                                }
                                            >
                                                {album.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/admin/gallery-albums/${album.id}/edit`}
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
                                                                Delete Album
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to delete "
                                                                {album.title}"? This action
                                                                cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>
                                                                Cancel
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() =>
                                                                    handleDelete(album.id)
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
