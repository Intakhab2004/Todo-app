import z from "zod";

export const subTaskSchema = z.object({
    title: z.string()
                    .min(1, "Title is required")
                    .min(2, "Title must be of atleast two characters")
                    .max(60, "Title must not be more than 60 characters")
})