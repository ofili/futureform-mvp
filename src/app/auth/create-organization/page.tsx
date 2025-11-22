'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import Logo from '@/components/Logo';
import Link from 'next/link';

interface FormOption {
  id: string;
  value: string;
  label: string;
  displayOrder: number;
}


export default function CreateOrganization() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [orgData, setOrgData] = useState({
    name: '',
    type: '',
    sectorFocus: '',
    region: '',
    country: '',
    relationshipStage: 'Discovery',
    source: '',
    referralSource: '',
    pilotAgreementSigned: false,
    caseStudyApproval: false
  });
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    jobTitle: '',
    department: '',
    password: '',
    confirmPassword: ''
  });
  const router = useRouter();

  // Fetch form options from database
  const { data: sectors } = useQuery<FormOption[]>({
    queryKey: ['form-options', 'sector'],
    queryFn: async () => {
      const response = await fetch('/api/v1/admin/form-options?category=sector');
      if (!response.ok) return [];
      const options = await response.json();
      return options.filter((o: any) => o.isActive);
    }
  });

  const { data: regions } = useQuery<FormOption[]>({
    queryKey: ['form-options', 'region'],
    queryFn: async () => {
      const response = await fetch('/api/v1/admin/form-options?category=region');
      if (!response.ok) return [];
      const options = await response.json();
      return options.filter((o: any) => o.isActive);
    }
  });

  const { data: departments } = useQuery<FormOption[]>({
    queryKey: ['form-options', 'department'],
    queryFn: async () => {
      const response = await fetch('/api/v1/admin/form-options?category=department');
      if (!response.ok) return [];
      const options = await response.json();
      return options.filter((o: any) => o.isActive);
    }
  });

  const { data: relationshipStages } = useQuery<FormOption[]>({
    queryKey: ['form-options', 'relationship_stage'],
    queryFn: async () => {
      const response = await fetch('/api/v1/admin/form-options?category=relationship_stage');
      if (!response.ok) return [];
      const options = await response.json();
      return options.filter((o: any) => o.isActive);
    }
  });

  const { data: sources } = useQuery<FormOption[]>({
    queryKey: ['form-options', 'source'],
    queryFn: async () => {
      const response = await fetch('/api/v1/admin/form-options?category=source');
      if (!response.ok) return [];
      const options = await response.json();
      return options.filter((o: any) => o.isActive);
    }
  });

  const validateEmailMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch('/api/v1/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Email validation failed');
      }
      return result;
    },
    onSuccess: () => setStep(2),
    onError: (error) => console.error('Validation error:', error)
  });

  const registerMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          organization: orgData,
          user: userData
        })
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }
      return result;
    },
    onSuccess: (data) => {
      alert(data.message);
      router.push('/auth/login');
    },
    onError: (error) => {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />
            <Link href="/">
              <Button variant="ghost" size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Register
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>
              {step === 1 && 'Get Started'}
              {step === 2 && 'Organization Details'}
              {step === 3 && 'Your Account Details'}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              {step === 1 && 'Enter your email to begin registration'}
              {step === 2 && 'Tell us about your organization'}
              {step === 3 && 'Complete your account setup'}
            </p>
            <div className="flex gap-2 mt-4">
              <div className={`h-1 flex-1 rounded ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
              <div className={`h-1 flex-1 rounded ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
              <div className={`h-1 flex-1 rounded ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            </div>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <form onSubmit={(e) => {
                e.preventDefault();
                validateEmailMutation.mutate(email);
              }} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Work Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full" disabled={validateEmailMutation.isPending}>
                  {validateEmailMutation.isPending ? 'Validating...' : 'Continue'}
                </Button>
                {validateEmailMutation.isError && (
                  <p className="text-sm text-red-600">
                    {validateEmailMutation.error?.message || 'Email validation failed'}.
                    <Link href="/auth/login" className="underline">Sign in instead</Link>
                  </p>
                )}
              </form>
            )}

            {step === 2 && (
              <form onSubmit={(e) => {
                e.preventDefault();
                setStep(3);
              }} className="space-y-4">
                <Input
                  placeholder="Organization Name"
                  value={orgData.name}
                  onChange={(e) => setOrgData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />

                <NativeSelect
                  value={orgData.sectorFocus}
                  onChange={(e) => setOrgData(prev => ({ ...prev, sectorFocus: e.target.value }))}
                  required
                >
                  <option value="">Select Sector Focus</option>
                  {sectors?.map(option => (
                    <option key={option.id} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </NativeSelect>

                <NativeSelect
                  value={orgData.region}
                  onChange={(e) => setOrgData(prev => ({ ...prev, region: e.target.value }))}
                  required
                >
                  <option value="">Select Region</option>
                  {regions?.map(option => (
                    <option key={option.id} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </NativeSelect>

                <Input
                  placeholder="Country"
                  value={orgData.country}
                  onChange={(e) => setOrgData(prev => ({ ...prev, country: e.target.value }))}
                  required
                />

                <NativeSelect
                  value={orgData.relationshipStage}
                  onChange={(e) => setOrgData(prev => ({ ...prev, relationshipStage: e.target.value }))}
                  required
                >
                  <option value="">Select Relationship Stage</option>
                  {relationshipStages?.map(option => (
                    <option key={option.id} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </NativeSelect>

                <NativeSelect
                  value={orgData.source}
                  onChange={(e) => setOrgData(prev => ({ ...prev, source: e.target.value }))}
                  required
                >
                  <option value="">Select Source</option>
                  {sources?.map(option => (
                    <option key={option.id} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </NativeSelect>

                {orgData.source === 'Referral' && (
                  <Input
                    placeholder="Referral Source (Optional)"
                    value={orgData.referralSource}
                    onChange={(e) => setOrgData(prev => ({ ...prev, referralSource: e.target.value }))}
                  />
                )}

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={orgData.pilotAgreementSigned}
                      onChange={(e) => setOrgData(prev => ({ ...prev, pilotAgreementSigned: e.target.checked }))}
                      className="rounded border-gray-300"
                    />
                    <span>Pilot Agreement Signed (Optional)</span>
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={orgData.caseStudyApproval}
                      onChange={(e) => setOrgData(prev => ({ ...prev, caseStudyApproval: e.target.checked }))}
                      className="rounded border-gray-300"
                    />
                    <span>Case Study Approval (Optional)</span>
                  </label>
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button type="submit" className="flex-1">
                    Continue
                  </Button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={(e) => {
                e.preventDefault();
                registerMutation.mutate();
              }} className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="First Name"
                    value={userData.firstName}
                    onChange={(e) => setUserData(prev => ({ ...prev, firstName: e.target.value }))}
                    required
                  />
                  <Input
                    placeholder="Last Name"
                    value={userData.lastName}
                    onChange={(e) => setUserData(prev => ({ ...prev, lastName: e.target.value }))}
                    required
                  />
                </div>

                <Input
                  placeholder="Job Title"
                  value={userData.jobTitle}
                  onChange={(e) => setUserData(prev => ({ ...prev, jobTitle: e.target.value }))}
                  required
                />

                <NativeSelect
                  value={userData.department}
                  onChange={(e) => setUserData(prev => ({ ...prev, department: e.target.value }))}
                  required
                >
                  <option value="">Select Department</option>
                  {departments?.map(option => (
                    <option key={option.id} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </NativeSelect>

                <Input
                  type="password"
                  placeholder="Password"
                  value={userData.password}
                  onChange={(e) => setUserData(prev => ({ ...prev, password: e.target.value }))}
                  required
                  minLength={8}
                />

                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={userData.confirmPassword}
                  onChange={(e) => setUserData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                  minLength={8}
                />

                {userData.password && userData.confirmPassword && userData.password !== userData.confirmPassword && (
                  <p className="text-sm text-red-600">Passwords do not match</p>
                )}

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={registerMutation.isPending || userData.password !== userData.confirmPassword}
                  >
                    {registerMutation.isPending ? 'Creating Account...' : 'Complete Registration'}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
          <div className="px-6 pb-6 text-center">
            <Link href="/auth/login" className="text-sm text-blue-600 hover:underline">
              Already have an account? Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div >
  );
}
