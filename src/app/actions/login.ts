"use server";
import { cookies } from "next/headers";

export const setUserCookie = async (
  accessToken: string,
  refreshToken: string,
) => {
  const cookie = await cookies();
  cookie.set("accessToken", accessToken);
  cookie.set("refreshToken", refreshToken);
  return;
};

export const removeUserCookie = async () => {
  const cookie = await cookies();
  cookie.delete("accessToken");
  cookie.delete("refreshToken");
  return;
};

export const isUserLogged = async () => {
  const cookie = await cookies();
  const res =
    cookie.get("accessToken")?.value && cookie.get("refreshToken")?.value;
  return res;
};
