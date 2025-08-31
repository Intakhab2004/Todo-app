import z from "zod";

export const taskSchema = z.object({
    title: z.string()
                    .min(1, "Title is required")
                    .min(2, "Title must be more than 2 characters"),

    description: z.string()
                          .min(10, "Description is required")
                          .optional()
                          .or(z.literal("")),

    categoryName: z.string().min(1, "Please select a category"),

    priority: z.preprocess(
        (val) => (val === "" || val == null ? "Low" : val),
        z.enum(["Low", "Medium", "High"])
    ),

    dueDate: z.string().min(1, "Date is required"),

    categoryName: z.string()
})