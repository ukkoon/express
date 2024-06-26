import fetch from "cross-fetch";
import jwt from 'jsonwebtoken';
import { AllowedPayload } from "../interface/token_payloads";
import { SignUpTypeEnum, SnsIdVerifyPayload } from "./sign_up_type";
import "../config";

export class Guard {
    toPayload(token: string): AllowedPayload {
        return jwt.verify(token.replace("Bearer ", ""), process.env.TOKEN_SECRET_V2!) as AllowedPayload
    }

    toToken(payload: AllowedPayload, expiresIn: string): string {
        let secret = process.env.TOKEN_SECRET_V2!
        let option = { expiresIn }

        return jwt.sign(payload, secret, option)
    }

    async verifySnsId(signUpType: SignUpTypeEnum, snsToken: string): Promise<SnsIdVerifyPayload> {
        switch (signUpType) {
            case SignUpTypeEnum.NAVER:
                let naverResponse = await this.getNaverProfile(snsToken)
                let naverProfile = await naverResponse.json()

                return {
                    phonenum: naverProfile.response.mobile_e164.replace("+82", "0").replace(/ |-/g, ""),
                    snsId: naverProfile.response.id,
                    verified: naverProfile.resultcode === "00"
                }
            case SignUpTypeEnum.KAKAO:
                let kakaoResponse = await this.getKakaoProfile(snsToken)
                let kakaoProfile = await kakaoResponse.json()

                return {
                    snsId: kakaoProfile.id.toString(),
                    phonenum: kakaoProfile.kakao_account.phone_number.replace("+82", "0").replace(/ |-/g, ""),
                    verified: kakaoResponse.statusText === "OK"
                };    

            case SignUpTypeEnum.PHONE_NUM:
            default:
                throw Error("OAuth Error")
        }
    }
    async getKakaoProfile(accessToken: string) {
        return fetch(`https://kapi.kakao.com/v2/user/me`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                Authorization: `Bearer ${accessToken}`,
            }
        })
    }
    async getNaverProfile(accessToken: string) {
        return fetch(`https://openapi.naver.com/v1/nid/me`,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                    Authorization: `Bearer ${accessToken}`,
                }
            })
    }
}

export default new Guard();