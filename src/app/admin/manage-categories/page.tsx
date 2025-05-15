
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import type { VideoCategory } from '@/types';
// Removed: import { getCategories, addCategory, updateCategory, deleteCategory } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Edit, Trash2, PlusCircle, Loader2, ListChecks } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const categoryFormSchema = z.object({
  id: z.string().optional(), // Keep id for editing simulation
  name: z.string().min(2, "Category name must be at least 2 characters.").max(50),
  description: z.string().max(200, "Description can be up to 200 characters.").optional(),
});
type CategoryFormData = z.infer<typeof categoryFormSchema>;

export default function ManageCategoriesPage() {
  const [categories, setCategories] = useState<VideoCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<VideoCategory | null>(null);
  const [showFormDialog, setShowFormDialog] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { name: "", description: "" },
  });

  const fetchCategoriesData = async () => {
    setIsLoading(true);
    try {
      // const fetchedCategories = await getCategories(); // Backend call will replace this
      setCategories([]); // Set to empty as backend is not ready
       toast({
        title: "Backend Pending",
        description: "Category list will populate once backend is connected.",
        variant: "default"
      });
    } catch (error) {
      console.error("Failed to fetch categories (backend pending):", error);
      toast({ title: "Error", description: "Could not load categories. Ensure backend is running.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesData();
  }, []); 

  const handleOpenFormDialog = (category?: VideoCategory) => {
    if (category) {
      setEditingCategory(category);
      form.reset({ id: category.id, name: category.name, description: category.description || "" });
    } else {
      setEditingCategory(null);
      form.reset({ name: "", description: "" });
    }
    setShowFormDialog(true);
  };

  const handleFormSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
      if (editingCategory) {
        // await updateCategory(editingCategory.id, data); // Backend call
        // Simulate update in local state for demo purposes
        setCategories(prev => prev.map(cat => cat.id === editingCategory.id ? {...cat, ...data, id: cat.id } : cat));
        toast({ title: "Category Updated (Mock)", description: `"${data.name}" has been updated. Backend integration needed.` });
      } else {
        // await addCategory(data); // Backend call
        // Simulate add in local state for demo purposes
        const newCategory = { ...data, id: `mock-${Date.now().toString()}` };
        setCategories(prev => [newCategory, ...prev]);
        toast({ title: "Category Added (Mock)", description: `"${data.name}" has been added. Backend integration needed.` });
      }
      setShowFormDialog(false);
      // fetchCategoriesData(); // No need to re-fetch if local state is updated, or re-fetch when backend is real
    } catch (error) {
      console.error("Failed to save category (mock):", error);
      toast({ title: "Error (Mock)", description: "Could not save category.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
      // await deleteCategory(categoryId); // Backend call
      // Simulate delete in local state
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      toast({ title: "Category Deleted (Mock)", description: `"${categoryName}" has been removed. Backend integration needed.` });
      // fetchCategoriesData(); // No need to re-fetch if local state is updated
    } catch (error) {
      console.error("Failed to delete category (mock):", error);
      toast({ title: "Error (Mock)", description: "Could not delete category.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="outline" asChild className="mb-6 gap-2">
             <Link href="/admin"><ArrowLeft className="h-4 w-4" /> Back to Dashboard</Link>
        </Button>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 py-3 border-b last:border-b-0">
                <Skeleton className="h-6 flex-1" />
                <Skeleton className="h-6 w-2/3 md:w-1/3" />
                <Skeleton className="h-8 w-10" />
                <Skeleton className="h-8 w-10" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" asChild className="gap-2">
          <Link href="/admin"><ArrowLeft className="h-4 w-4" /> Back to Dashboard</Link>
        </Button>
        <Dialog open={showFormDialog} onOpenChange={setShowFormDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenFormDialog()}>
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Edit" : "Add New"} Category</DialogTitle>
              <DialogDescription>
                {editingCategory ? "Update the details for this category." : "Enter the details for the new category."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl><Input placeholder="e.g., Action Packed" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl><Textarea placeholder="A brief description of the category..." {...field} rows={3} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {editingCategory ? "Save Changes" : "Add Category"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="h-6 w-6 text-primary" /> Manage Categories
          </CardTitle>
          <CardDescription>View, add, edit, or delete video categories. (Backend integration pending)</CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length === 0 && !isLoading ? (
            <div className="text-center py-10">
              <ListChecks className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium">No Categories Found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Get started by adding a new category or connect to a backend.
              </p>
              <Button onClick={() => handleOpenFormDialog()} className="mt-4">
                 <PlusCircle className="mr-2 h-4 w-4" />Add Category
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground truncate max-w-xs">
                      {category.description || 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenFormDialog(category)} title="Edit" className="mr-2">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" title="Delete" disabled={isSubmitting}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the
                              category "{category.name}" (mock deletion).
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteCategory(category.id, category.name)}
                              disabled={isSubmitting}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

