import { supabase } from "./supabase";

export const saveLead = async (leadData: any) => {
  const { data, error } = await supabase
    .from("leads")
    .insert([leadData]);

  if (error) {
    console.error("Error saving lead:", error);
  }

  return data;
};