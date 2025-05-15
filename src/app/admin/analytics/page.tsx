
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, BarChart3, Video, Users, Eye, TrendingUp, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getVideos, getCategories } from '@/data/mock'; // For mock data counts
import type { Video as VideoType, VideoCategory } from '@/types';

// Mock data for charts
const viewsPerCategoryData = [
  { category: "Action", views: 4500 },
  { category: "Comedy", views: 3200 },
  { category: "Drama", views: 5100 },
  { category: "Sci-Fi", views: 3800 },
  { category: "Docs", views: 2500 },
];

const uploadsOverTimeData = [
  { month: "Jan", uploads: 5 },
  { month: "Feb", uploads: 8 },
  { month: "Mar", uploads: 12 },
  { month: "Apr", uploads: 7 },
  { month: "May", uploads: 15 },
  { month: "Jun", uploads: 10 },
];

const userEngagementData = [
  { name: 'Watch Time (Avg Min)', value: 45 },
  { name: 'Completion Rate (%)', value: 65 },
  { name: 'Likes per View (%)', value: 5 },
];
const PIE_COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];


export default function AnalyticsPage() {
  const [totalVideos, setTotalVideos] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [mockTotalViews, setMockTotalViews] = useState(0);
  const [mockActiveUsers, setMockActiveUsers] = useState(0);

  useEffect(() => {
    async function fetchDataCounts() {
      setIsLoading(true); // Keep this if you want to show loading for these counts specifically
      try {
        const [videos, categories] = await Promise.all([
          getVideos(),
          getCategories()
        ]);
        setTotalVideos(videos.length);
        setTotalCategories(categories.length);
      } catch (error) {
        console.error("Failed to fetch data counts for analytics:", error);
        // Handle error if needed, e.g., show a toast
      } finally {
        setIsLoading(false); // Set loading to false after all data is fetched
      }
    }
    fetchDataCounts();
  }, []);

  useEffect(() => {
    // This useEffect can run independently or be part of the main one
    // if its data relies on the main fetch. For pure mock data, it's fine separately.
    setMockTotalViews(Math.floor(Math.random() * 50000) + 10000);
    setMockActiveUsers(Math.floor(Math.random() * 2000) + 500);
  },[]); // Runs once on mount


  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_,i) => <Card key={i}><CardHeader><Skeleton className="h-6 w-1/2 mb-1" /><Skeleton className="h-4 w-3/4" /></CardHeader><CardContent><Skeleton className="h-8 w-1/3" /></CardContent></Card>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card><CardHeader><Skeleton className="h-7 w-1/3 mb-2"/></CardHeader><CardContent><Skeleton className="w-full h-72" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-7 w-1/3 mb-2"/></CardHeader><CardContent><Skeleton className="w-full h-72" /></CardContent></Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="outline" asChild className="mb-6 gap-2">
        <Link href="/admin"><ArrowLeft className="h-4 w-4" /> Back to Dashboard</Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" /> Platform Analytics
        </h1>
        <p className="text-muted-foreground">Overview of your video streaming platform's performance.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
            <Video className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVideos}</div>
            <p className="text-xs text-muted-foreground">Currently in catalog</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <ListChecks className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
            <p className="text-xs text-muted-foreground">Available genres</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views (Mock)</CardTitle>
            <Eye className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTotalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users (Mock)</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockActiveUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+10% this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Views per Category (Mock)</CardTitle>
            <CardDescription>Distribution of views across top categories.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={viewsPerCategoryData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="category" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={(value) => `${value/1000}k`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Video Uploads Over Time (Mock)</CardTitle>
            <CardDescription>Number of new videos added per month.</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={{}} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={uploadsOverTimeData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12}/>
                        <YAxis tickLine={false} axisLine={false} fontSize={12}/>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="uploads" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r:4, fill: "hsl(var(--primary))", stroke: "hsl(var(--background))", strokeWidth: 2 }} activeDot={{ r: 6 }}/>
                    </LineChart>
                </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>User Engagement Metrics (Mock)</CardTitle>
                <CardDescription>Key indicators of user interaction with content.</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
                <ChartContainer config={{}} className="w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
                            <Pie
                                data={userEngagementData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                innerRadius={60}
                                labelLine={false}
                                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
                                  const RADIAN = Math.PI / 180;
                                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                  const x = cx + (radius + 15) * Math.cos(-midAngle * RADIAN);
                                  const y = cy + (radius + 15) * Math.sin(-midAngle * RADIAN);
                                  return (
                                    <text x={x} y={y} fill="hsl(var(--foreground))" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
                                      {`${name}: ${(percent * 100).toFixed(0)}%`}
                                    </text>
                                  );
                                }}
                            >
                                {userEngagementData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                             <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
      </div>
       <Card className="mt-8">
        <CardHeader>
          <CardTitle>More Analytics Coming Soon!</CardTitle>
          <CardDescription>
            We're working on adding more detailed reports, including top-performing videos, user demographics, and revenue metrics (if applicable).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Future features might include custom date range filtering, exportable reports, and real-time data streams.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

