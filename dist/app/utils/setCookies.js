"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const setCookie = (res, tokenInfo) => {
    const isProd = process.env.NODE_ENV === "production";
    if (tokenInfo.accessToken) {
        res.cookie("accessToken", tokenInfo.accessToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            path: "/"
        });
    }
    if (tokenInfo.refreshToken) {
        res.cookie("refreshToken", tokenInfo.refreshToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            path: "/"
        });
    }
};
exports.default = setCookie;
