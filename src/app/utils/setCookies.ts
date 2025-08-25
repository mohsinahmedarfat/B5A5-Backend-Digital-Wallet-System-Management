import { Response } from "express";

interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

const setCookie = (res: Response, tokenInfo: AuthTokens) => {
  const isProd = process.env.NODE_ENV === "production";

  if (tokenInfo.accessToken) {
    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
    });
  }

  if (tokenInfo.refreshToken) {
    res.cookie("refreshToken", tokenInfo.refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
    });
  }
};

export default setCookie;
