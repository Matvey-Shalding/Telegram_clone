import { API_ROUTES } from "@/config/routes";
import { Conversation } from "@/db/schema";
import { axiosInstance } from "./instance";

export const get = async (): Promise<Conversation[]> => {
  return (await axiosInstance.get(API_ROUTES.CONVERSATIONS)).data;
};
