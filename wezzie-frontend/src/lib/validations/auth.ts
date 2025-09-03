import * as z from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().min(18, "Must be 18 or older").max(75, "Must be 75 and younger"),
  phone: z.string().regex(/^0[89][0-9]{8,10}$/, "Invalid phone number. Must start with 08 or 09 and be 10–12 digits long."),
  location: z.string().min(2, "Location is required"),
  gender: z.enum(["male", "female", "other"], {
    error: "Please select a gender",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})
export const resetPasswordSchema = z.object({
  email: z
    .string()
    .email("Invalid email address") // basic email validation
    .regex(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
      "Email must be in a valid format"
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});