import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { NewGymData } from "./types";

interface AddGymDialogProps {
  token: string | null;
  onGymAdded: () => void;
  children?: React.ReactNode;
}

export const AddGymDialog = ({
  token,
  onGymAdded,
  children,
}: AddGymDialogProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newGym, setNewGym] = useState<NewGymData>({
    name: "",
    email: "",
    location: "",
    capacity: "",
    facilities: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewGym((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddGym = async () => {
    setIsSubmitting(true);
    try {
      // Basic validation
      if (
        !newGym.name ||
        !newGym.email ||
        !newGym.location ||
        !newGym.capacity
      ) {
        toast({
          title: "Validation Error",
          description: "Please fill out all required fields.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("/api/admin/gyms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newGym.name,
          email: newGym.email,
          location: {
            address: newGym.location,
            city: "N/A",
            state: "N/A",
            zipCode: "N/A",
          },
          capacity: Number(newGym.capacity),
          facilities: newGym.facilities
            ? newGym.facilities.split(",").map((f) => f.trim())
            : [],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add gym");
      }

      toast({
        title: "Success",
        description: `Gym "${newGym.name}" has been created successfully.`,
      });

      // Reset form and close dialog
      setNewGym({
        name: "",
        email: "",
        location: "",
        capacity: "",
        facilities: "",
      });
      setIsOpen(false);

      // Notify parent to refresh data
      onGymAdded();
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Gym
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Gym</DialogTitle>
          <DialogDescription>
            Create a new gym partner account with auto-generated credentials.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Gym Name</Label>
            <Input
              id="name"
              value={newGym.name}
              onChange={handleInputChange}
              placeholder="Enter gym name"
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={newGym.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={newGym.location}
              onChange={handleInputChange}
              placeholder="Enter gym address"
            />
          </div>
          <div>
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              value={newGym.capacity}
              onChange={handleInputChange}
              placeholder="Enter maximum capacity"
            />
          </div>
          <div>
            <Label htmlFor="facilities">Facilities (comma-separated)</Label>
            <Input
              id="facilities"
              value={newGym.facilities}
              onChange={handleInputChange}
              placeholder="e.g. Weights, Cardio, Pool, Sauna"
            />
          </div>
          <Button
            onClick={handleAddGym}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Gym
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
