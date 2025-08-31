import z from "zod";

export const categorySchema = z.object({
    name: z.string()
                    .min(1, "Category name is required")
                    .min(2, "Category name must be atleast of 2 characters")
                    .max(15, "Category name must not be more than 15 characters")
                    .regex(/^[A-Za-z]+$/, "Category name is invalid")
})