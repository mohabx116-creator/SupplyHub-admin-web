'use client';

import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { getRequestRoute } from '@/lib/routes/routes';
import { RequestStatusChip } from './RequestStatusChip';
import type { RequestRecord } from '../requests.types';

type RequestsTableProps = {
  requests: RequestRecord[];
};

const formatDate = (value: string | null) => {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

const shortId = (id: string) => id.slice(0, 8).toUpperCase();

export function RequestsTable({ requests }: RequestsTableProps) {
  const router = useRouter();

  return (
    <Card sx={{ overflow: 'hidden', border: '1px solid #e2e8f0', borderRadius: 1 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Request</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Requested by</TableCell>
              <TableCell align="right">Items</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Updated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <TableRow
                key={request.id}
                hover
                onClick={() => router.push(getRequestRoute(request.id))}
                sx={{
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                  '&:hover': {
                    bgcolor: 'rgba(15, 23, 42, 0.02) !important',
                  },
                }}
              >
                <TableCell>
                  <Stack spacing={0.5}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                      {request.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: 'monospace',
                        color: 'text.secondary',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {shortId(request.id)}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <RequestStatusChip status={request.status} />
                </TableCell>
                <TableCell>
                  <Stack spacing={0.25}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                      {request.company.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {request.company.city ?? 'No city'} • {request.company.status}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack spacing={0.25}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                      {request.requestedBy.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {request.requestedBy.email}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell align="right" sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#0f172a' }}>
                  {request.items.length}
                </TableCell>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'text.secondary' }}>
                  {formatDate(request.createdAt)}
                </TableCell>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'text.secondary' }}>
                  {formatDate(request.updatedAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
