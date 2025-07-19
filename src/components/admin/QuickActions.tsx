import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Download, BarChart3 } from "lucide-react";
import { AddGymDialog } from "./AddGymDialog";

interface QuickActionsProps {
  token: string | null;
  onGymAdded: () => void;
}

export const QuickActions = ({ token, onGymAdded }: QuickActionsProps) => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-accent" />
          Quick Actions
        </CardTitle>
        <CardDescription>Frequently used admin functions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <AddGymDialog token={token} onGymAdded={onGymAdded}>
          <Button className="w-full" variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add New Gym
          </Button>
        </AddGymDialog>

        <Button variant="outline" className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Export Reports
        </Button>

        <Button variant="outline" className="w-full">
          <BarChart3 className="mr-2 h-4 w-4" />
          View Analytics
        </Button>
      </CardContent>
    </Card>
  );
};
