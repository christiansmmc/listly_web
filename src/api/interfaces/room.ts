export interface ValidateRoomRequestType {
    code: string
    passcode: string
}

export interface ValidateRoomAccessCodeRequestType {
    room_code: string
    access_code: string
}

export interface ValidateRoomAccessCodeResponseType {
    access_token: string
}

export interface ValidateRoomResponseType {
    access_token: string
}

export interface CreateCartFirstStepResponseType {
    code: string
}

export interface CreateRoomLastStepRequestType {
    code: string
    passcode: string
}

export interface GenerateAccessCodeResponseType {
    access_code: string
}