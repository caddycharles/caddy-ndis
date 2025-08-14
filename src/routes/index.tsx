import { createFileRoute } from "@tanstack/react-router";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/lib/hooks/use-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Calendar, FileText, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/")({
  component: ProtectedHomePage,
});

function ProtectedHomePage() {
  return (
    <AuthGuard>
      <DashboardPage />
    </AuthGuard>
  );
}

function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    {
      title: "Total Participants",
      value: "24",
      icon: Users,
      change: "+2 this week",
    },
    {
      title: "Active Services",
      value: "156",
      icon: Calendar,
      change: "+12 this month",
    },
    {
      title: "Documents",
      value: "48",
      icon: FileText,
      change: "3 pending review",
    },
    {
      title: "Budget Utilization",
      value: "68%",
      icon: TrendingUp,
      change: "On track",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.firstName || "User"}! Here's your overview for
          today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="card-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity and Tasks */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 card-shadow">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from your participants and team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Service agreement approved
                  </p>
                  <p className="text-sm text-muted-foreground">
                    John Smith - 2 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Budget review completed
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Sarah Johnson - 5 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    New participant onboarded
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Michael Brown - 1 day ago
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 card-shadow">
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>
              Important items requiring your attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <input type="checkbox" className="mr-3" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Review plan for Emily Chen
                  </p>
                  <p className="text-sm text-muted-foreground">Due tomorrow</p>
                </div>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-3" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Submit quarterly report
                  </p>
                  <p className="text-sm text-muted-foreground">Due in 3 days</p>
                </div>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-3" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Team meeting preparation
                  </p>
                  <p className="text-sm text-muted-foreground">Due Friday</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
