import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Video, ListChecks, BarChart3 } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your video streaming platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Upload New Video</CardTitle>
            <PlusCircle className="h-6 w-6 text-accent" />
          </CardHeader>
          <CardContent>
            <CardDescription>Add new movies or TV show episodes to your catalog.</CardDescription>
            <Button asChild className="mt-4 w-full">
              <Link href="/admin/upload">Go to Upload</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Manage Videos</CardTitle>
            <Video className="h-6 w-6 text-accent" />
          </CardHeader>
          <CardContent>
            <CardDescription>Edit or remove existing video content.</CardDescription>
            <Button variant="outline" className="mt-4 w-full" disabled>Coming Soon</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Manage Categories</CardTitle>
            <ListChecks className="h-6 w-6 text-accent" />
          </CardHeader>
          <CardContent>
            <CardDescription>Organize your content by adding or editing categories.</CardDescription>
            <Button variant="outline" className="mt-4 w-full" disabled>Coming Soon</Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">View Analytics</CardTitle>
            <BarChart3 className="h-6 w-6 text-accent" />
          </CardHeader>
          <CardContent>
            <CardDescription>Track views, user engagement, and other metrics.</CardDescription>
            <Button variant="outline" className="mt-4 w-full" disabled>Coming Soon</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
