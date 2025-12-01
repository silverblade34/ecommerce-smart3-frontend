"use client";
import { useEstrellaSession } from "@/hooks/useEstrellaSession";

export const SessionManager = () => {
  useEstrellaSession();
  return null; 
};