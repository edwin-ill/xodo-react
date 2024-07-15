import NextAuth from "next-auth";

declare module "next-auth"{
    interface Session{
    user:{
        "email": string,
        "id": string,
        "userName": string,
        "roles": string[],
        "isVerified": boolean,
        "hasError": boolean,
        "error": null | string,
        "jwToken": string,
        "refreshToken": string,
        "iat": number,
        "exp": number,
        "jti": string
    }
}
}