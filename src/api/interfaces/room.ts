export interface ValidateRoomRequestType {
    code: string
    passcode: string
}

export interface ValidateRoomResponseType {
    access_token: string
}