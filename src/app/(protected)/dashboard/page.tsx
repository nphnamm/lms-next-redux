'use client';

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  GraduationCap,
  Calendar,
  MessageSquare,
  TrendingUp,
  Clock,
  Award,
  ChevronRight,
  Bell,
  Users,
  Brain,
} from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";

const stats = [
  {
    title: "Course Progress",
    value: "67%",
    change: "+5.25%",
    icon: TrendingUp,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    title: "Study Hours",
    value: "24.5",
    change: "This Week",
    icon: Clock,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Assignments",
    value: "12/15",
    change: "Completed",
    icon: GraduationCap,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Active Streak",
    value: "7",
    change: "Days",
    icon: Award,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
];

const recentActivities = [
  {
    id: 1,
    title: "Completed JavaScript Basics",
    description: "Course Progress",
    time: "2 hours ago",
    icon: BookOpen,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: 2,
    title: "Submitted React Assignment",
    description: "Assignment",
    time: "5 hours ago",
    icon: GraduationCap,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    id: 3,
    title: "Joined Node.js Study Group",
    description: "Community",
    time: "1 day ago",
    icon: Users,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
];

const upcomingSchedule = [
  {
    id: 1,
    title: "Advanced React Patterns",
    type: "Live Session",
    time: "Today, 3:00 PM",
    duration: "1 hour",
  },
  {
    id: 2,
    title: "Database Design Quiz",
    type: "Assessment",
    time: "Tomorrow, 10:00 AM",
    duration: "45 minutes",
  },
  {
    id: 3,
    title: "TypeScript Workshop",
    type: "Workshop",
    time: "Wed, 2:00 PM",
    duration: "2 hours",
  },
];

export default function DashboardPage() {
  const { user } = useAppSelector((state: RootState) => state.auth);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground mt-2">
            Track your progress and manage your learning journey.
          </p>
        </div>
        <Button size="icon" variant="outline" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-primary animate-pulse" />
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-none shadow-md hover:shadow-lg transition-all duration-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className={stat.color}>{stat.change}</span>
                    <ChevronRight className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity */}
        <Card className="col-span-4 border-none shadow-md">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest learning activities and achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-6">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4"
                  >
                    <div className={`${activity.bgColor} p-2 rounded-lg`}>
                      <activity.icon className={`h-5 w-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">{activity.title}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>{activity.description}</span>
                        <span className="mx-2">•</span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Upcoming Schedule */}
        <Card className="col-span-3 border-none shadow-md">
          <CardHeader>
            <CardTitle>Upcoming Schedule</CardTitle>
            <CardDescription>Your scheduled sessions and assessments</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-6">
                {upcomingSchedule.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative rounded-lg border p-4 hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{event.type}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {event.duration}
                      </span>
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="font-medium group-hover:text-primary transition-colors">
                        {event.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{event.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Learning Progress Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle>Course Progress</CardTitle>
            <CardDescription>Track your learning journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">React Fundamentals</span>
                  <span className="text-sm text-muted-foreground">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Node.js Basics</span>
                  <span className="text-sm text-muted-foreground">45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">TypeScript</span>
                  <span className="text-sm text-muted-foreground">60%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle>Study Streak</CardTitle>
            <CardDescription>Keep up your daily learning habit</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center">
              <div className="relative">
                <Award className="h-16 w-16 text-primary animate-pulse" />
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                  7
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Days in a row</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle>Learning Focus</CardTitle>
            <CardDescription>Your current learning priorities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Brain className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Frontend Development</p>
                  <p className="text-sm text-muted-foreground">Primary focus</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Backend Integration</p>
                  <p className="text-sm text-muted-foreground">Secondary focus</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium">Team Collaboration</p>
                  <p className="text-sm text-muted-foreground">Ongoing skill</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 