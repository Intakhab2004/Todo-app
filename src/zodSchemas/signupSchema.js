import z from "zod"

export const signupSchema = z.object({
    username: z.string()
                        .min(1, {message: "Username is required"})
                        .min(2, {message: "Username must be more than 2 characters"})
                        .max(20, {message: "Username must not be more than 20 characters"})
                        .regex(/^[a-zA-Z0-9_]+$/, {message: "Username can only contain letters, numbers, and underscores"}),

    email: z.email({message: "Invalid email address"})
                  .min(1, {message: "Email is required"}),

    password: z.string()
                        .min(1, {message: "Password is required"})
                        .min(6, {message: "Password must be of atleast 6 characters"}),
    
    confirmPassword: z.string()
                              .min(1, {message: "Confirm password is required"})
                              .min(6, {message: "Password must be of atleast 6 characters"})
})