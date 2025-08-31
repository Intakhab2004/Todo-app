import z from "zod"

export const signinSchema = z.object({
    identifier: z.string().min(1, "This field is required"),
    password: z.string().min(1, "Password is reuired")
})