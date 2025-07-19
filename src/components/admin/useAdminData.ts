import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { PlatformStats, Gym, Member, RecentVisit } from "./types";

interface UseAdminDataProps {
  token: string | null;
}

export const useAdminData = ({ token }: UseAdminDataProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [recentVisits, setRecentVisits] = useState<RecentVisit[]>([]);

  // Fetch admin dashboard data
  const fetchDashboardData = async () => {
    if (!token) return;
    try {
      const response = await fetch("/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch dashboard data");
      }
      setPlatformStats(data.data.stats);
      setRecentVisits(data.data.recentVisits);
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  // Fetch gyms data
  const fetchGyms = async () => {
    if (!token) return;
    try {
      const response = await fetch("/api/admin/gyms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch gyms");
      }
      setGyms(data.data.gyms);
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  // Fetch members data
  const fetchMembers = async () => {
    if (!token) return;
    try {
      const response = await fetch("/api/admin/members", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch members");
      }
      setMembers(data.data.members);
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  // Refresh all data
  const refreshData = async () => {
    setIsLoading(true);
    await Promise.all([
      fetchDashboardData(),
      fetchGyms(),
      fetchMembers(),
    ]);
    setIsLoading(false);
  };

  // Refresh after gym is added
  const handleGymAdded = async () => {
    await Promise.all([
      fetchDashboardData(),
      fetchGyms(),
    ]);
  };

  // Fetch all data on component mount
  useEffect(() => {
    if (token) {
      refreshData();
    }
  }, [token]);

  return {
    isLoading,
    platformStats,
    gyms,
    members,
    recentVisits,
    refreshData,
    handleGymAdded,
  };
}; 