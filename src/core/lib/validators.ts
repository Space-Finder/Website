import z from "zod";

export const AccessTokenValidator = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    image: z.string(),
    iat: z.number(),
    exp: z.number(),
});

export const RefreshTokenValidator = z.object({
    id: z.string(),
    iat: z.number(),
    exp: z.number(),
});
