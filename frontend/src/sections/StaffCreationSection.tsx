import { useState } from 'react';
import { supabaseClient } from '../utils/supabaseClient';

export default function StaffCreationSection() {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [hourlyRate, setHourlyRate] = useState('');
    const [maxWeeklyHours, setMaxWeeklyHours] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

    const handleSubmit = async () => {
        if(!name || !role || !hourlyRate || !maxWeeklyHours) {
           setStatus('error');
           return;
        }

        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) {
            setStatus('error');
            return;
        }
        const userId = user.id;

        setStatus('sending');
        
        try {
            const res = await fetch('/api/staff-create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-user-id': userId,
                },
                body: JSON.stringify({
                    name,
                    role,
                    hourly_rate: parseFloat(hourlyRate),
                    max_weekly_hours: parseFloat(maxWeeklyHours),
                }),
            });

            const data = await res.json();

            if(data.success) {
                setStatus('sent');
                setName('');
                setRole('');
                setHourlyRate('');
                setMaxWeeklyHours('');
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    return (
        <div>
            <h1>Create Staff Member</h1>

            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
            />
            <input
                type="number"
                placeholder="Hourly Rate"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
            />
            <input
                type="number"
                placeholder="Max Weekly Hours"
                value={maxWeeklyHours}
                onChange={(e) => setMaxWeeklyHours(e.target.value)}
            />
            <button type='button' onClick={handleSubmit}>
                {status === 'sending' ? 'Saving...' : 'Save Staff Member'}
            </button>

            {status === 'sent' && <p>Staff member created</p>}
            {status === 'error' && <p>Error creating staff member</p>}
        </div>
    );
}