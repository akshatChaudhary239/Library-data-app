'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import dynamic from 'next/dynamic';

const ReceiptButton = dynamic(() => import('@/components/ReceiptButton'), { ssr: false });

export default function PaymentsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    amount: '',
    paymentMethod: 'CASH',
    monthCovered: new Date().toISOString().slice(0, 7) // YYYY-MM
  });

  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const { data } = await api.get('/payments');
      return data.data;
    }
  });

  const { data: students, isLoading: studentsLoading } = useQuery({
    queryKey: ['students-active'],
    queryFn: async () => {
      const { data } = await api.get('/students', { params: { limit: 1000 } });
      return data.data.filter((s: any) => s.status === 'ACTIVE');
    }
  });

  const addPaymentMutation = useMutation({
    mutationFn: async (payload: any) => {
      await api.post('/payments', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      setIsModalOpen(false);
      setFormData({
        studentId: '',
        amount: '',
        paymentMethod: 'CASH',
        monthCovered: new Date().toISOString().slice(0, 7)
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPaymentMutation.mutate({
      studentId: formData.studentId,
      amount: parseFloat(formData.amount),
      paymentMethod: formData.paymentMethod,
      monthCovered: `${formData.monthCovered}-01T00:00:00.000Z`
    });
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'UPI': return <Badge className="bg-purple-500">UPI</Badge>;
      case 'CASH': return <Badge className="bg-emerald-500">Cash</Badge>;
      case 'BANK_TRANSFER': return <Badge className="bg-blue-500">Bank</Badge>;
      default: return <Badge variant="outline">{method}</Badge>;
    }
  };

  // jsPDF logic moved to ReceiptButton component to prevent SSR crash

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">Track fee collection and history.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Record Payment
        </Button>
      </div>

      <div className="rounded-md border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Month</TableHead>
              <TableHead className="text-right">Receipt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paymentsLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">Loading...</TableCell>
              </TableRow>
            ) : payments?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">No payments recorded yet.</TableCell>
              </TableRow>
            ) : (
              payments?.map((payment: any) => (
                <TableRow key={payment.id} className="transition-all hover:bg-primary/5 hover:shadow-sm">
                  <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{payment.student?.name}</TableCell>
                  <TableCell className="font-bold">₹{payment.amount}</TableCell>
                  <TableCell>{getMethodBadge(payment.paymentMethod)}</TableCell>
                  <TableCell>{new Date(payment.monthCovered).toLocaleDateString('default', { month: 'short', year: 'numeric' })}</TableCell>
                  <TableCell className="text-right">
                    <ReceiptButton payment={payment} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>Add a new fee payment record.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Student</label>
              <Select 
                value={formData.studentId} 
                onValueChange={(val) => {
                  const student = students?.find((s: any) => s.id === val);
                  setFormData(prev => ({ 
                    ...prev, 
                    studentId: val as string,
                    amount: String(student ? student.monthlyFee : prev.amount)
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {studentsLoading ? (
                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                  ) : (
                    students?.map((s: any) => (
                      <SelectItem key={s.id} value={s.id}>{s.name} (Seat {s.seatNumber || '--'})</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount (₹)</label>
              <Input 
                type="number" 
                required 
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Method</label>
                <Select 
                  value={formData.paymentMethod} 
                  onValueChange={(val) => setFormData(prev => ({ ...prev, paymentMethod: val as string }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">Cash</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Month Covered</label>
                <Input 
                  type="month" 
                  required 
                  value={formData.monthCovered}
                  onChange={(e) => setFormData({...formData, monthCovered: e.target.value})}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={addPaymentMutation.isPending || !formData.studentId}>
              {addPaymentMutation.isPending ? 'Saving...' : 'Save Payment'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
