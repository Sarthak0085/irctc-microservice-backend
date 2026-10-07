import z from "zod";

export const signUpSchema = z.object({
    firstName: z.string().trim().min(3, "First Name must be atleast 3 characters").max(50, "First Name cannot exceed 50 characters"),
    lastName: z.string().trim().min(3, "First Name must be atleast 3 characters").max(50, "First Name cannot exceed 50 characters").optional().or(z.literal('')),
    email: z.string().trim().toLowerCase().email("Invalid email address"),
    password: z.string().min(8, 'Password must be at least 8 characters long')
      .max(100, 'Password cannot exceed 100 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
    confirmPassword: z.string()  
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignUpBody = z.infer<typeof signUpSchema>  