'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

export default function StudentProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudent() {
      try {
        const { data } = await api.get(`/students/${id}`);
        setStudent(data.data);
      } catch (error) {
        console.error('Failed to fetch student:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStudent();
  }, [id]);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this student?')) {
      try {
        await api.delete(`/students/${id}`);
        router.push('/students');
      } catch (error) {
        console.error('Failed to delete student:', error);
      }
    }
  };

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;
  if (!student) return <div className="text-red-500 p-8">Student not found.</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/students">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{student.name}</h1>
            <p className="text-muted-foreground">{student.email || 'No email provided'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/students/${id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" /> Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6 col-span-1 border-r pr-6 border-border">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
            <Badge className={student.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}>
              {student.status}
            </Badge>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Phone Number</h3>
            <p>{student.phone}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Address</h3>
            <p>{student.address || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Assigned Seat</h3>
            <p className="font-semibold">{student.seatNumber ? `Seat ${student.seatNumber}` : 'Not assigned'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Monthly Fee</h3>
            <p>₹{student.monthlyFee}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Subscription Period</h3>
            <p>{new Date(student.subscriptionStartDate).toLocaleDateString()} - {new Date(student.subscriptionEndDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
            </CardHeader>
            <CardContent>
              {student.payments && student.payments.length > 0 ? (
                <div className="space-y-4">
                  {student.payments.map((payment: any) => (
                    <div key={payment.id} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">₹{payment.amount} ({payment.paymentMethod})</p>
                        <p className="text-xs text-muted-foreground">For: {new Date(payment.monthCovered).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No payment history found.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              {student.attendances && student.attendances.length > 0 ? (
                <div className="space-y-4">
                  {student.attendances.map((att: any) => (
                    <div key={att.id} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">{new Date(att.date).toLocaleDateString()}</p>
                        <Badge variant="outline">{att.status}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground text-right">
                        <p>In: {att.checkInTime ? new Date(att.checkInTime).toLocaleTimeString() : '--:--'}</p>
                        <p>Out: {att.checkOutTime ? new Date(att.checkOutTime).toLocaleTimeString() : '--:--'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No attendance records found.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
