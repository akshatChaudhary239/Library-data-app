'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SeatsPage() {
  const queryClient = useQueryClient();
  const [selectedSeat, setSelectedSeat] = useState<any>(null);
  const [assignStudentId, setAssignStudentId] = useState('');

  const { data: seats, isLoading: seatsLoading } = useQuery({
    queryKey: ['seats'],
    queryFn: async () => {
      const { data } = await api.get('/seats');
      return data.data;
    }
  });

  const { data: students, isLoading: studentsLoading } = useQuery({
    queryKey: ['students-available'],
    queryFn: async () => {
      const { data } = await api.get('/students', { params: { limit: 1000 } });
      // Filter out students who already have a seat
      return data.data.filter((s: any) => !s.seatNumber && s.status === 'ACTIVE');
    }
  });

  const assignMutation = useMutation({
    mutationFn: async () => {
      if (!selectedSeat || !assignStudentId) return;
      await api.patch(`/seats/${selectedSeat.id}/assign`, { studentId: assignStudentId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seats'] });
      queryClient.invalidateQueries({ queryKey: ['students-available'] });
      setSelectedSeat(null);
      setAssignStudentId('');
    }
  });

  const unassignMutation = useMutation({
    mutationFn: async () => {
      if (!selectedSeat) return;
      await api.patch(`/seats/${selectedSeat.id}/unassign`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seats'] });
      queryClient.invalidateQueries({ queryKey: ['students-available'] });
      setSelectedSeat(null);
    }
  });

  const reserveMutation = useMutation({
    mutationFn: async () => {
      if (!selectedSeat) return;
      await api.patch(`/seats/${selectedSeat.id}/reserve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seats'] });
      setSelectedSeat(null);
    }
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'AVAILABLE': return 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 hover:scale-[1.05] hover:shadow-md hover:-translate-y-1';
      case 'OCCUPIED': return 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 hover:scale-[1.05] hover:shadow-md hover:-translate-y-1';
      case 'RESERVED': return 'bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 hover:scale-[1.05] hover:shadow-md hover:-translate-y-1';
      default: return 'bg-gray-100 border-gray-300 text-gray-800 hover:scale-[1.05] hover:shadow-md hover:-translate-y-1';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Seat Map</h1>
          <p className="text-muted-foreground">Manage seating layout and assignments.</p>
        </div>
      </div>

      {seatsLoading ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">Loading seats...</div>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
          {seats?.map((seat: any) => (
            <div 
              key={seat.id}
              onClick={() => setSelectedSeat(seat)}
              className={`
                aspect-square rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer transition-colors
                ${getStatusColor(seat.status)}
              `}
            >
              <span className="text-lg font-bold">{seat.number}</span>
              <span className="text-[10px] uppercase font-semibold opacity-70 mt-1 hidden sm:block">
                {seat.status.substring(0, 3)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Action Modal */}
      <Dialog open={!!selectedSeat} onOpenChange={(open) => !open && setSelectedSeat(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Seat {selectedSeat?.number}</DialogTitle>
            <DialogDescription>
              Current Status: <strong>{selectedSeat?.status}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedSeat?.status === 'AVAILABLE' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Assign Student</label>
                  <Select value={assignStudentId} onValueChange={(val) => setAssignStudentId(val as string)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {studentsLoading ? (
                        <SelectItem value="loading" disabled>Loading students...</SelectItem>
                      ) : students?.length === 0 ? (
                        <SelectItem value="none" disabled>No unassigned active students</SelectItem>
                      ) : (
                        students?.map((s: any) => (
                          <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button 
                    className="flex-1" 
                    disabled={!assignStudentId || assignMutation.isPending}
                    onClick={() => assignMutation.mutate()}
                  >
                    Assign
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    disabled={reserveMutation.isPending}
                    onClick={() => reserveMutation.mutate()}
                  >
                    Mark Reserved
                  </Button>
                </div>
              </div>
            )}

            {(selectedSeat?.status === 'OCCUPIED' || selectedSeat?.status === 'RESERVED') && (
              <div className="space-y-4">
                {selectedSeat?.students?.length > 0 && (
                  <div className="p-3 bg-muted rounded-md text-sm">
                    Currently assigned to: <strong>{selectedSeat.students[0].name}</strong>
                  </div>
                )}
                <Button 
                  variant="destructive" 
                  className="w-full"
                  disabled={unassignMutation.isPending}
                  onClick={() => unassignMutation.mutate()}
                >
                  Unassign / Make Available
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
