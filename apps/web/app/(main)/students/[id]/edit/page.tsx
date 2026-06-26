'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditStudentPage() {
  const router = useRouter();
  const { id } = useParams();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [monthlyFee, setMonthlyFee] = useState(1000);
  const [subscriptionStartDate, setSubscriptionStartDate] = useState('');
  const [subscriptionEndDate, setSubscriptionEndDate] = useState('');

  useEffect(() => {
    async function fetchStudent() {
      try {
        const { data } = await api.get(`/students/${id}`);
        const student = data.data;
        setName(student.name || '');
        setPhone(student.phone || '');
        setEmail(student.email || '');
        setAddress(student.address || '');
        setMonthlyFee(student.monthlyFee || 1000);
        
        if (student.subscriptionStartDate) {
          setSubscriptionStartDate(new Date(student.subscriptionStartDate).toISOString().slice(0, 10));
        }
        if (student.subscriptionEndDate) {
          setSubscriptionEndDate(new Date(student.subscriptionEndDate).toISOString().slice(0, 10));
        }
      } catch (err) {
        setError('Failed to load student data');
      } finally {
        setFetching(false);
      }
    }
    fetchStudent();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.patch(`/students/${id}`, {
        name,
        phone,
        email,
        address,
        monthlyFee: Number(monthlyFee),
        subscriptionStartDate: new Date(subscriptionStartDate).toISOString(),
        subscriptionEndDate: new Date(subscriptionEndDate).toISOString(),
      });
      router.push(`/students/${id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update student');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex justify-center p-8">Loading student data...</div>;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href={`/students/${id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Student</h1>
          <p className="text-muted-foreground">Update the student's information.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
          <CardDescription>Modify the student's basic information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="student-form" onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyFee">Monthly Fee (₹) *</Label>
                <Input id="monthlyFee" type="number" required value={monthlyFee} onChange={(e) => setMonthlyFee(Number(e.target.value))} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-6">
              <div className="space-y-2">
                <Label htmlFor="startDate">Subscription Start Date *</Label>
                <Input id="startDate" type="date" required value={subscriptionStartDate} onChange={(e) => setSubscriptionStartDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Subscription End Date *</Label>
                <Input id="endDate" type="date" required value={subscriptionEndDate} onChange={(e) => setSubscriptionEndDate(e.target.value)} />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t p-6">
          <Link href={`/students/${id}`}>
            <Button variant="outline" type="button" disabled={loading}>Cancel</Button>
          </Link>
          <Button type="submit" form="student-form" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
