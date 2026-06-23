'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

export default function StudentsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: students, isLoading } = useQuery({
    queryKey: ['students', searchTerm],
    queryFn: async () => {
      const { data } = await api.get('/students', {
        params: { search: searchTerm, limit: 100 }
      });
      return data.data;
    }
  });

  const handleExportCSV = () => {
    if (!students || students.length === 0) return;
    
    // Headers
    const headers = ['Name', 'Phone', 'Email', 'Seat Number', 'Status', 'Join Date', 'Expiry Date'];
    
    // Rows
    const rows = students.map((s: any) => [
      s.name,
      s.phone,
      s.email || '',
      s.seatNumber || 'Unassigned',
      s.status,
      new Date(s.joiningDate).toLocaleDateString(),
      new Date(s.subscriptionEndDate).toLocaleDateString()
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "students_export.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">Manage your library members.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV} disabled={!students || students.length === 0}>
            Export CSV
          </Button>
          <Button onClick={() => router.push('/students/add')}>
            <Plus className="h-4 w-4 mr-2" /> Add Student
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input 
          type="text" 
          placeholder="Search students..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex h-10 w-full max-w-sm rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="rounded-md border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Seat</TableHead>
              <TableHead>Status</TableHead>
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
              students?.map((student: any) => (
                <TableRow 
                  key={student.id} 
                  className="cursor-pointer transition-all hover:bg-primary/5 hover:shadow-sm"
                  onClick={() => router.push(`/students/${student.id}`)}
                >
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.phone}</TableCell>
                  <TableCell>{student.seatNumber || '--'}</TableCell>
                  <TableCell>
                    <Badge variant={student.status === 'ACTIVE' ? 'default' : student.status === 'EXPIRED' ? 'destructive' : 'secondary'} className="shadow-sm">
                      {student.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
