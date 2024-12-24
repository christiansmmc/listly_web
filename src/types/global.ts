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

export interface ItemGetCartDataResponse {
    id: number,
    name: string,
    checked: boolean,
}

export interface GetCartDataResponse {
    name: string,
    code: string,
    items: ItemGetCartDataResponse[]
}