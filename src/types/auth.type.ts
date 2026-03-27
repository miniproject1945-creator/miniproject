export type RegisterRequest = {
    username: string;
    email: string;
    password: string;
    isAdmin: boolean;
    referralCode?: string;
};

export type LoginRequest = {
    identity: string;
    password: string;
};

export type Decoded = {
    id: number;
    isAdmin: boolean;
    iat: number;
}
