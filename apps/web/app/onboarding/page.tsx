'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [totalSeats, setTotalSeats] = useState(50);
  const [defaultMonthlyFee, setDefaultMonthlyFee] = useState(1000);
  const [openingTime, setOpeningTime] = useState('08:00');
  const [closingTime, setClosingTime] = useState('22:00');

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      try {
        await api.post('/library/setup', {
          name,
          ownerName,
          phone,
          address,
          totalSeats: Number(totalSeats),
          defaultMonthlyFee: Number(defaultMonthlyFee),
          openingTime,
          closingTime,
        });
      } catch (setupErr: any) {
        if (setupErr.response?.data?.error?.code !== 'LIBRARY_EXISTS') {
          throw setupErr;
        }
      }

      // Refresh token to inject the newly created libraryId into the JWT payload
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        const { data } = await api.post('/auth/refresh', { refreshToken });
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
      }

      // Auto-generate seats using the updated token
      try {
        await api.post('/seats/generate', { totalSeats: Number(totalSeats) });
      } catch (seatsErr: any) {
        if (seatsErr.response?.data?.error?.code !== 'SEATS_EXIST') {
          throw seatsErr;
        }
      }

      router.push('/dashboard');
    } catch (err: any) {
      const apiError = err.response?.data?.error;
      let errorMessage = apiError?.message || 'Library setup failed. Please try again.';
      if (apiError?.details) {
        errorMessage += ': ' + apiError.details.map((d: any) => d.message).join(', ');
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
      <Card className="w-full max-w-xl">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Setup your Library</CardTitle>
          <CardDescription>
            Step {step} of 2 - Let's get your workspace configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Library Name</Label>
                    <Input id="name" placeholder="Focus Library" required value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Owner Name</Label>
                    <Input id="ownerName" placeholder="Jane Doe" required value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Phone</Label>
                  <Input id="phone" type="tel" placeholder="+91 9876543210" required value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Full Address</Label>
                  <Input id="address" placeholder="123 Education Hub, New Delhi" required value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalSeats">Total Capacity (Seats)</Label>
                    <Input id="totalSeats" type="number" min={1} required value={totalSeats} onChange={(e) => setTotalSeats(Number(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="defaultMonthlyFee">Default Monthly Fee (₹)</Label>
                    <Input id="defaultMonthlyFee" type="number" min={0} required value={defaultMonthlyFee} onChange={(e) => setDefaultMonthlyFee(Number(e.target.value))} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="openingTime">Opening Time</Label>
                    <Input id="openingTime" type="time" required value={openingTime} onChange={(e) => setOpeningTime(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="closingTime">Closing Time</Label>
                    <Input id="closingTime" type="time" required value={closingTime} onChange={(e) => setClosingTime(e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              {step === 2 ? (
                <Button type="button" variant="outline" onClick={handleBack} disabled={loading}>
                  Back
                </Button>
              ) : (
                <div /> // Empty div to push next button to right
              )}
              
              <Button type="submit" disabled={loading}>
                {step === 1 ? 'Continue' : (loading ? 'Setting up...' : 'Complete Setup')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
