'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function AttendancePage() {
  const queryClient = useQueryClient();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const { data: students, isLoading } = useQuery({
    queryKey: ['attendance', date],
    queryFn: async () => {
      const { data } = await api.get('/students', { params: { limit: 1000 } });
      return data.data;
    }
  });

  const markAttendanceMutation = useMutation({
    mutationFn: async ({ studentId, status }: { studentId: string, status: string }) => {
      const endpoint = status === 'PRESENT' ? '/attendance/check-in' : '/attendance/check-out';
      await api.post(endpoint, { studentId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    }
  });

  const handleMarkAttendance = (studentId: string, status: string) => {
    markAttendanceMutation.mutate({ studentId, status });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">Mark daily check-ins and check-outs.</p>
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Seat</TableHead>
              <TableHead>Status Today</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">Loading...</TableCell>
              </TableRow>
            ) : students?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No students found.</TableCell>
              </TableRow>
            ) : (
              students?.map((student: any) => {
                const todayAttendance = student.attendances?.find((a: any) => new Date(a.date).toISOString().slice(0, 10) === date);
                const isPresent = todayAttendance?.status === 'PRESENT';
                const isCheckedOut = todayAttendance?.checkOutTime !== null;

                return (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.seatNumber || '--'}</TableCell>
                    <TableCell>
                      {todayAttendance ? (
                        <Badge variant={isPresent && !isCheckedOut ? 'default' : 'secondary'}>
                          {isPresent ? (isCheckedOut ? 'Checked Out' : 'Present') : todayAttendance.status}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">Not marked</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleMarkAttendance(student.id, 'PRESENT')}
                          disabled={isPresent && !isCheckedOut || markAttendanceMutation.isPending}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                          In
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleMarkAttendance(student.id, 'ABSENT')}
                          disabled={!isPresent || isCheckedOut || markAttendanceMutation.isPending}
                        >
                          <XCircle className="h-4 w-4 mr-1 text-red-500" />
                          Out
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
