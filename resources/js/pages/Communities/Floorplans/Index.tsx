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
import { Pencil, Trash2, Plus, ArrowLeft } from 'lucide-react';
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

interface Community {
    id: number;
    title: string;
}

interface Floorplan {
    id: number;
    title: string;
    slug: string;
    community: Community;
    order: number;
    is_active: boolean;
}

interface Props {
    floorplans: Floorplan[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Communities', href: '/admin/communities' },
    { title: 'Floor Plans', href: '#' },
];

export default function FloorplansIndex({ floorplans }: Props) {
    const handleDelete = (id: number) => {
        router.delete(`/admin/communities-floorplans/${id}`, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Floor Plans" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/admin/communities">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold">Floor Plans</h1>
                    </div>
                    <Link href="/admin/communities-floorplans/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Floor Plan
                        </Button>
                    </Link>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Community</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {floorplans.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center">
                                        No floor plans found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                floorplans.map((plan) => (
                                    <TableRow key={plan.id}>
                                        <TableCell>{plan.order}</TableCell>
                                        <TableCell className="font-medium">{plan.title}</TableCell>
                                        <TableCell>
                                            <code className="rounded bg-muted px-2 py-1 text-sm">
                                                {plan.slug}
                                            </code>
                                        </TableCell>
                                        <TableCell>{plan.community.title}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    plan.is_active ? 'default' : 'secondary'
                                                }
                                            >
                                                {plan.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/admin/communities-floorplans/${plan.id}/edit`}
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
                                                                Delete Floor Plan
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to delete "
                                                                {plan.title}"? This action cannot be
                                                                undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>
                                                                Cancel
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(plan.id)}
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
