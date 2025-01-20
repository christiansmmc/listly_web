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

export interface CategoryResponse {
    id: number,
    name: string,
}

export interface ItemGetCartDataResponse {
    id: number,
    name: string,
    checked: boolean,
    category: CategoryResponse
}

export interface GetCartDataResponse {
    name: string,
    code: string,
    items: ItemGetCartDataResponse[],
}

export interface ItemsCategoryGroup {
    id: number,
    name: string,
    checked: boolean,
}

export interface CategoryGroup {
    categoryId: number,
    categoryName: string,
    items: ItemsCategoryGroup[]
}