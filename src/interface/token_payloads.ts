import { JwtPayload } from "jsonwebtoken";

export interface AccessTokenPayload extends JwtPayload {
    verified: Boolean;
}

export interface RefreshTokenPayload extends JwtPayload {
    accessToken: string;
}

export interface AdminAuthorizingTokenPayload extends AccessTokenPayload {
    email: string;
    otp: string;
}

export interface AdminAccessTokenPayload extends AccessTokenPayload {
    email: string
}

export interface AdminRefreshTokenPayload extends RefreshTokenPayload {
    email: string
}

export interface MemberAuthorizingTokenPayload extends AccessTokenPayload {
    countryCode: number;
    phoneNum: string;
    authcode: string;
}

export interface MemberAccessTokenPayload extends AccessTokenPayload {
    id: number;
}

export interface MemberRefreshTokenPayload extends RefreshTokenPayload {
    id: number
}

export interface LegacyAccessTokenPayload extends JwtPayload {
    id: number,
    type: number,
    iat: number
}

export type AllowedPayload =
    AdminAccessTokenPayload |
    AdminAuthorizingTokenPayload |
    AdminRefreshTokenPayload |
    MemberAccessTokenPayload |
    MemberAuthorizingTokenPayload |
    MemberRefreshTokenPayload |
    LegacyAccessTokenPayload