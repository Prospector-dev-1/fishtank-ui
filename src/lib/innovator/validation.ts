import { z } from 'zod';

// Project validation schemas
export const quickPitchSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(60, 'Title must be less than 60 characters'),
  tagline: z.string()
    .max(80, 'Tagline must be less than 80 characters')
    .optional(),
  category: z.string().optional(),
  stage: z.enum(['idea', 'mvp', 'seed', 'seriesA']),
  location: z.string().optional(),
  tags: z.array(z.string()).default([])
});

export const deepDiveSchema = z.object({
  problem: z.string()
    .min(120, 'Problem statement must be at least 120 characters')
    .optional(),
  solution: z.string()
    .min(120, 'Solution description must be at least 120 characters')
    .optional(),
  market: z.string().optional(),
  competitors: z.string().optional(),
  businessModel: z.string().optional(),
  traction: z.string().optional(),
  metrics: z.object({
    mrr: z.number().min(0).optional(),
    users: z.number().min(0).optional()
  }).optional(),
  fundingAsk: z.object({
    amount: z.number().min(1, 'Funding amount must be greater than 0'),
    equity: z.number().min(0).max(100, 'Equity must be between 0 and 100').optional()
  }).optional()
});

export const publishSchema = z.object({
  visibility: z.enum(['public', 'under_nda']),
  hasMedia: z.boolean().refine(val => val === true, 'At least one media asset is required')
});

// Combined project schema
export const projectSchema = quickPitchSchema.merge(deepDiveSchema).merge(publishSchema);

// User validation schemas
export const userUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email address').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  city: z.string().optional(),
  skills: z.array(z.string()).optional(),
  cofounderOpen: z.boolean().optional(),
  cofounderRoles: z.array(z.string()).optional(),
  availability: z.string().optional(),
  links: z.array(z.string().optional()).optional(),
  timezone: z.string().optional()
});

// Auth validation schemas
export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const signUpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// Messaging validation
export const messageSchema = z.object({
  text: z.string().min(1, 'Message cannot be empty').max(2000, 'Message too long')
});

// NDA request validation
export const ndaRequestSchema = z.object({
  templateId: z.enum(['std', 'strict']),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional()
});

// Schedule request validation  
export const scheduleRequestSchema = z.object({
  proposedSlots: z.array(z.string().datetime())
    .min(1, 'At least one time slot is required')
    .max(3, 'Maximum 3 time slots allowed')
});

// Validation helpers
export const validateField = <T>(schema: z.ZodSchema<T>, value: unknown): { success: boolean; error?: string } => {
  try {
    schema.parse(value);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message };
    }
    return { success: false, error: 'Validation failed' };
  }
};

export const getValidationErrors = <T>(schema: z.ZodSchema<T>, value: unknown): Record<string, string> => {
  try {
    schema.parse(value);
    return {};
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors.reduce((acc, err) => {
        const path = err.path.join('.');
        acc[path] = err.message;
        return acc;
      }, {} as Record<string, string>);
    }
    return {};
  }
};