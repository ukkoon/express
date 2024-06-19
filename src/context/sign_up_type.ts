export enum SignUpTypeEnum {
    PHONE_NUM = "PHONE_NUM",
    NAVER = "NAVER",
    KAKAO = "KAKAO"
}

export interface SnsIdVerifyPayload {
    snsId: string
    phonenum?: string
    verified: boolean
}