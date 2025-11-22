'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface ProfileSettingsProps {
    initialFirstName?: string;
    initialLastName?: string;
    initialEmail?: string;
    onSave: (data: { firstName: string; lastName: string; email: string }) => void;
}

export function ProfileSettings({ initialFirstName = '', initialLastName = '', initialEmail = '', onSave }: ProfileSettingsProps) {
    const [firstName, setFirstName] = useState(initialFirstName);
    const [lastName, setLastName] = useState(initialLastName);
    const [email, setEmail] = useState(initialEmail);

    const handleSave = () => {
        onSave({ firstName, lastName, email });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="pt-2">
                    <Button onClick={handleSave}>Save Changes</Button>
                </div>
            </CardContent>
        </Card>
    );
}
