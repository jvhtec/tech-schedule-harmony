import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useLocations = () => {
  return useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      console.log("Fetching locations...");
      const { data, error } = await supabase
        .from("locations")
        .select("name")
        .order("name");

      if (error) throw error;
      console.log("Fetched locations:", data);
      return data.map((loc) => loc.name);
    },
  });
};