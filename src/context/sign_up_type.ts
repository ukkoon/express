export enum SignUpTypeEnum {
    PHONE_NUM = "PHONE_NUM",
    NAVER = "NAVER",
    KAKAO = "KAKAO"
}

export interface SnsIdVerifyPayload {
    snsId: string
    phoneNum?: string
    verified: boolean
}