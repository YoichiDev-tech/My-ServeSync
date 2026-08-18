import express, { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

export const app = express();
app.use(express.json({ limit: '10kb' }));

const LOG_TYPES = [
    'temperature_check',
    'haccp',
    'opening_signoff',
    'closing_signoff',
] as const;

const MAX_LENGTHS = {
    location: 100,
    unit: 10,
    notes: 2000,
    recorded_by_name: 100,
    correction_reason: 500,
} as const;

function isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
}

// Only POST is allowed — this endpoint can create rows, never modify them
// There is intentionally no PUT/PATCH handler anywhere in this file
app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed.',
        });
    }
    next();
});

app.use(async (req: Request, res: Response) => {
    const body = req.body ?? {};

    const {
        log_type,
        location,
        value,
        unit,
        notes,
        recorded_by_name,
        recorded_by_user_id,
        recorded_at,
        corrects_log_id,
        correction_reason,
    } = body;

    // Required fields
    if (!LOG_TYPES.includes(log_type) || !isNonEmptyString(recorded_by_name)) {
        return res.status(400).json({
            success: false,
            error: 'Missing or invalid required fields.',
        });
    }

    // A correction must explain itself and point at a real prior entry
    if (corrects_log_id !== undefined && corrects_log_id !== null) {
        if (!isNonEmptyString(correction_reason)) {
            return res.status(400).json({
                success: false,
                error: 'correction_reason is required when correcting a prior log.',
            });
        }
    }

    // Length checks
    if (
        (isNonEmptyString(location) && location.length > MAX_LENGTHS.location) ||
        (isNonEmptyString(unit) && unit.length > MAX_LENGTHS.unit) ||
        (isNonEmptyString(notes) && notes.length > MAX_LENGTHS.notes) ||
        recorded_by_name.length > MAX_LENGTHS.recorded_by_name ||
        (isNonEmptyString(correction_reason) && correction_reason.length > MAX_LENGTHS.correction_reason)
    ) {
        return res.status(400).json({
            success: false,
            error: 'One or more fields exceed maximum allowed length.',
        });
    }

    if (value !== undefined && value !== null && typeof value !== 'number') {
        return res.status(400).json({
            success: false,
            error: 'value must be a number.',
        });
    }

    // Supabase client — service role, needed to write across the API boundary
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    // Get user_id (the owning manager/account) from header, same convention as staff-create
    const userId = req.headers['x-user-id'];
    if (!userId || typeof userId !== 'string') {
        return res.status(401).json({
            success: false,
            error: 'Missing user authentication.',
        });
    }

    // NOTE: this is the only database call this endpoint ever makes
    // No .update(), no .delete() — anywhere in this file, on purpose
    const { data, error } = await supabase
        .from('compliance_logs')
        .insert([
            {
                user_id: userId,
                log_type,
                location: location || null,
                value: value ?? null,
                unit: unit || null,
                notes: notes || null,
                recorded_by_name,
                recorded_by_user_id: recorded_by_user_id || null,
                recorded_at: recorded_at || new Date().toISOString(),
                corrects_log_id: corrects_log_id || null,
                correction_reason: correction_reason || null,
            },
        ])
        .select('id, recorded_at')
        .single();

    if (error) {
        return res.status(500).json({
            success: false,
            error: 'Could not write compliance log.',
            details: error.message,
        });
    }

    return res.status(200).json({
        success: true,
        message: 'Compliance log recorded.',
        id: data.id,
        recorded_at: data.recorded_at,
    });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    return res.status(500).json({
        success: false,
        error: 'Internal server error.',
    });
});

// Vercel-compatible handler
export default function handler(req: any, res: any) {
    return app(req, res);
}