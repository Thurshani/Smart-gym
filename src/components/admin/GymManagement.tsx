import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Edit, Mail } from "lucide-react";
import { AddGymDialog } from "./AddGymDialog";
import { Gym } from "./types";

interface GymManagementProps {
  gyms: Gym[];
  token: string | null;
  onGymAdded: () => void;
}

export const GymManagement = ({
  gyms,
  token,
  onGymAdded,
}: GymManagementProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter gyms based on search term
  const filteredGyms = gyms.filter(
    (gym) =>
      gym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gym.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gym.gymCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Gym Management</CardTitle>
            <CardDescription>
              Manage all partner gyms on the platform
            </CardDescription>
          </div>
          <AddGymDialog token={token} onGymAdded={onGymAdded} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search gyms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGyms.map((gym) => (
              <TableRow key={gym._id}>
                <TableCell className="font-medium">{gym.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{gym.gymCode}</Badge>
                </TableCell>
                <TableCell>{gym.email}</TableCell>
                <TableCell>{gym.location.address}</TableCell>
                <TableCell>{gym.capacity}</TableCell>
                <TableCell>
                  <Badge variant={gym.isActive ? "default" : "secondary"}>
                    {gym.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
