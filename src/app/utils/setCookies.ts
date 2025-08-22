import { Response } from "express";

interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

const setCookie = (res: Response, tokenInfo: AuthTokens) => {
  if (tokenInfo.accessToken) {
    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: true,
    });
  }

  if (tokenInfo.refreshToken) {
    res.cookie("refreshToken", tokenInfo.refreshToken, {
      httpOnly: true,
      secure: true,
    });
  }
};

export default setCookie;