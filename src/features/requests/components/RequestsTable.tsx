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
    <Card sx={{ overflow: 'hidden' }}>
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
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>
                  <Stack spacing={0.5}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {request.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {shortId(request.id)}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <RequestStatusChip status={request.status} />
                </TableCell>
                <TableCell>
                  <Stack spacing={0.25}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {request.company.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {request.company.city ?? 'No city'} • {request.company.status}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack spacing={0.25}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {request.requestedBy.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {request.requestedBy.email}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell align="right">{request.items.length}</TableCell>
                <TableCell>{formatDate(request.createdAt)}</TableCell>
                <TableCell>{formatDate(request.updatedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
