export interface CreateCartFirstStepResponse {
    code: string
}

export interface CreateCartFirstStepResponse {
    code: string
    passcode: string
}

export interface LoggedInDataType {
    isLoggedIn: boolean,
    cartCode: string | undefined
    cartPasscode: string | undefined
}