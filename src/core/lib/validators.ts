import z from "zod";

export const RoleValidator = z.union([
    z.literal("STUDENT"),
    z.literal("TEACHER"),
    z.literal("LEADER"),
    z.literal("ADMIN"),
]);

export const AccessTokenValidator = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    image: z.string(),
    iat: z.number(),
    exp: z.number(),
    role: RoleValidator,
});

export const RefreshTokenValidator = z.object({
    id: z.string(),
    iat: z.number(),
    exp: z.number(),
});
