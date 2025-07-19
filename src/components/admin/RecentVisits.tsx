import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity } from "lucide-react";
import { RecentVisit } from "./types";

interface RecentVisitsProps {
  visits: RecentVisit[];
}

export const RecentVisits = ({ visits }: RecentVisitsProps) => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Recent Visits
        </CardTitle>
        <CardDescription>
          Latest gym check-ins across the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {visits.slice(0, 8).map((visit) => (
            <div
              key={visit._id}
              className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div>
                  <p className="font-medium">{visit.member.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {visit.gym.name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm">
                  {new Date(visit.date).toLocaleDateString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(visit.checkInTime).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
