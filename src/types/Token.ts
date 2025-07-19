export interface Token {
    id: number,
    user_id: number,
    refreshtoken: string,
}

export interface Tokens {
    accessToken: string,
    refreshToken: string,
}