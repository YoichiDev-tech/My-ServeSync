import express, { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

export const app = express();
app.use(express.json({ limit: '10mb' }));

// Required fields + max length
const MAX_LENGTHS = {
    name: 100,
    role: 100,
    hourly_rate: 9999,
    max_weekly_hours: 168,
    contact_email: 254,
    contact_phone: 50,
    preferred_shift_type: 100,
    notes: 2000,
} as const;

// Only POST allowed
app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: "Method not allowed.",
        });
    }
    next();
});

app.use(async (req: Request, res: Response) => {
    const body = req.body ?? {};

    const {
        name,
        role,
        hourly_rate,
        max_weekly_hours,
        contact_email,
        contact_phone,
        status,
        preferred_shift_type,
        notes,
    } = body;
    // Basic required fields
    if (!isNonEmptyString(name) || !isNonEmptyString(role) || typeof hourly_rate !== 'number' ||
        typeof max_weekly_hours !== 'number') {
        return res.status(400).json({
            success: false,
            error: "Missing required fields.",
        });
    }

    // Length checks
    if (name.length > MAX_LENGTHS.name || role.length > MAX_LENGTHS.role || (isNonEmptyString(contact_email) &&
        contact_email.length > MAX_LENGTHS.contact_email) || (isNonEmptyString(contact_phone) &&
        contact_phone.length > MAX_LENGTHS.contact_phone) || (isNonEmptyString(preferred_shift_type) &&
        preferred_shift_type.length > MAX_LENGTHS.preferred_shift_type) || (isNonEmptyString(notes) &&
        notes.length > MAX_LENGTHS.notes)) {
        return res.status(400).json({
            success: false,
            error: "One or more fields exceed maximum allowed length.",
        });
    }

    // Supabase client
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!); // Must be service role key for insert with RLS

    // Get user_id from header (frontend must send it)
    const userId =  req.headers['X-user-id'];
    if (!userId || typeof userId !== 'string') {
        return res.status(401).json({
            success: false,
            error: "Missing user authentication.",
        });
    }

    // Insert into supabase
    const {error,} = await supabase.from('staff').insert([
        {
            user_id: userId,
            name,
            role,
            hourly_rate,
            max_weekly_hours,
            contact_email: contact_email || null,
            contact_phone: contact_phone || null,
            status: status || 'active',
            preferred_shift_type: preferred_shift_type || null,
            notes: notes || null,
        },
    ]);

    if (error) {
        return res.status(500).json({
            success: false,
            error: "Could not create staff member.",
            details: error.message,
        });
    }

    return res.status(200).json({
        success: true,
        message: "Staff member created successfully.",
    });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    return res.status(500).json({
        success: false,
        error: "Internal server error.",
    });
});

// Vercel-compatible handler
export default function handler(req: any. res: any) {
    return app(req, res);
}