'use client';

import { useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import type {
  SupplierRecord,
  SupplierStatus,
  SupplierUpsertPayload,
} from '../suppliers.types';
import { supplierStatuses } from '../suppliers.types';

type ContactDraft = {
  name: string;
  role: string;
  email: string;
  phone: string;
  whatsapp: string;
  isPrimary: boolean;
};

type SupplierFormState = {
  name: string;
  legalName: string;
  email: string;
  phone: string;
  whatsapp: string;
  city: string;
  address: string;
  taxNumber: string;
  category: string;
  notes: string;
  status: SupplierStatus | '';
  contacts: ContactDraft[];
};

const emptyContact = (): ContactDraft => ({
  name: '',
  role: '',
  email: '',
  phone: '',
  whatsapp: '',
  isPrimary: false,
});

const emptyState = (): SupplierFormState => ({
  name: '',
  legalName: '',
  email: '',
  phone: '',
  whatsapp: '',
  city: '',
  address: '',
  taxNumber: '',
  category: '',
  notes: '',
  status: '',
  contacts: [emptyContact()],
});

const toDraft = (supplier?: SupplierRecord | null): SupplierFormState => {
  if (!supplier) {
    return emptyState();
  }

  return {
    name: supplier.name,
    legalName: supplier.legalName ?? '',
    email: supplier.email ?? '',
    phone: supplier.phone ?? '',
    whatsapp: supplier.whatsapp ?? '',
    city: supplier.city ?? '',
    address: supplier.address ?? '',
    taxNumber: supplier.taxNumber ?? '',
    category: supplier.category ?? '',
    notes: supplier.notes ?? '',
    status: supplier.status,
    contacts:
      supplier.contacts.length > 0
        ? supplier.contacts.map((contact) => ({
            name: contact.name,
            role: contact.role ?? '',
            email: contact.email ?? '',
            phone: contact.phone ?? '',
            whatsapp: contact.whatsapp ?? '',
            isPrimary: contact.isPrimary,
          }))
        : [emptyContact()],
  };
};

const buildPayload = (
  draft: SupplierFormState,
  mode: 'create' | 'edit',
): SupplierUpsertPayload => ({
  name: draft.name.trim(),
  ...(draft.legalName.trim() ? { legalName: draft.legalName.trim() } : {}),
  ...(draft.email.trim() ? { email: draft.email.trim().toLowerCase() } : {}),
  ...(draft.phone.trim() ? { phone: draft.phone.trim() } : {}),
  ...(draft.whatsapp.trim() ? { whatsapp: draft.whatsapp.trim() } : {}),
  ...(draft.city.trim() ? { city: draft.city.trim() } : {}),
  ...(draft.address.trim() ? { address: draft.address.trim() } : {}),
  ...(draft.taxNumber.trim() ? { taxNumber: draft.taxNumber.trim() } : {}),
  ...(draft.category.trim() ? { category: draft.category.trim() } : {}),
  ...(draft.notes.trim() ? { notes: draft.notes.trim() } : {}),
  ...(mode === 'create' && draft.status ? { status: draft.status } : {}),
  contacts: draft.contacts
    .map((contact) => ({
      name: contact.name.trim(),
      ...(contact.role.trim() ? { role: contact.role.trim() } : {}),
      ...(contact.email.trim() ? { email: contact.email.trim().toLowerCase() } : {}),
      ...(contact.phone.trim() ? { phone: contact.phone.trim() } : {}),
      ...(contact.whatsapp.trim() ? { whatsapp: contact.whatsapp.trim() } : {}),
      ...(contact.isPrimary ? { isPrimary: true } : {}),
    }))
    .filter((contact) => contact.name.length > 0),
});

type SupplierFormDialogProps = {
  open: boolean;
  mode: 'create' | 'edit';
  title: string;
  description: string;
  initialSupplier?: SupplierRecord | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (payload: SupplierUpsertPayload) => Promise<void>;
};

export function SupplierFormDialog({
  open,
  mode,
  title,
  description,
  initialSupplier = null,
  loading = false,
  onClose,
  onSubmit,
}: SupplierFormDialogProps) {
  const [draft, setDraft] = useState<SupplierFormState>(() => toDraft(initialSupplier));
  const [fieldError, setFieldError] = useState<string | null>(null);

  const primaryContactCount = useMemo(
    () => draft.contacts.filter((contact) => contact.isPrimary).length,
    [draft.contacts],
  );

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const updateContact = (index: number, update: Partial<ContactDraft>) => {
    setDraft((current) => ({
      ...current,
      contacts: current.contacts.map((contact, contactIndex) =>
        contactIndex === index ? { ...contact, ...update } : contact,
      ),
    }));
  };

  const addContact = () => {
    setDraft((current) => ({
      ...current,
      contacts: [...current.contacts, emptyContact()],
    }));
  };

  const removeContact = (index: number) => {
    setDraft((current) => {
      const nextContacts = current.contacts.filter((_, contactIndex) => contactIndex !== index);
      return {
        ...current,
        contacts: nextContacts.length > 0 ? nextContacts : [emptyContact()],
      };
    });
  };

  const handleSubmit = async () => {
    if (!draft.name.trim()) {
      setFieldError('Supplier name is required.');
      return;
    }

    if (draft.contacts.some((contact) => contact.isPrimary) && primaryContactCount > 1) {
      setFieldError('Only one contact can be marked as primary.');
      return;
    }

    setFieldError(null);
    await onSubmit(buildPayload(draft, mode));
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : handleClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 800 }}>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>

          {fieldError ? <Alert severity="error">{fieldError}</Alert> : null}

          <TextField
            label="Supplier name"
            required
            fullWidth
            value={draft.name}
            onChange={(event) =>
              setDraft((current) => ({ ...current, name: event.target.value }))
            }
          />

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              label="Legal name"
              fullWidth
              value={draft.legalName}
              onChange={(event) =>
                setDraft((current) => ({ ...current, legalName: event.target.value }))
              }
            />
            <TextField
              label="Email"
              fullWidth
              value={draft.email}
              onChange={(event) =>
                setDraft((current) => ({ ...current, email: event.target.value }))
              }
            />
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              label="Phone"
              fullWidth
              value={draft.phone}
              onChange={(event) =>
                setDraft((current) => ({ ...current, phone: event.target.value }))
              }
            />
            <TextField
              label="WhatsApp"
              fullWidth
              value={draft.whatsapp}
              onChange={(event) =>
                setDraft((current) => ({ ...current, whatsapp: event.target.value }))
              }
            />
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              label="City"
              fullWidth
              value={draft.city}
              onChange={(event) =>
                setDraft((current) => ({ ...current, city: event.target.value }))
              }
            />
            <TextField
              label="Category"
              fullWidth
              value={draft.category}
              onChange={(event) =>
                setDraft((current) => ({ ...current, category: event.target.value }))
              }
            />
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              label="Address"
              fullWidth
              value={draft.address}
              onChange={(event) =>
                setDraft((current) => ({ ...current, address: event.target.value }))
              }
            />
            <TextField
              label="Tax number"
              fullWidth
              value={draft.taxNumber}
              onChange={(event) =>
                setDraft((current) => ({ ...current, taxNumber: event.target.value }))
              }
            />
          </Stack>

          <TextField
            label="Internal notes"
            fullWidth
            multiline
            minRows={4}
            value={draft.notes}
            onChange={(event) =>
              setDraft((current) => ({ ...current, notes: event.target.value }))
            }
          />

          {mode === 'create' ? (
            <TextField
              select
              label="Initial status"
              fullWidth
              value={draft.status}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  status: event.target.value as SupplierStatus | '',
                }))
              }
              helperText="Optional. If not selected, the backend default applies."
            >
              <MenuItem value="">Use backend default</MenuItem>
              {supplierStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
          ) : null}

          <Divider />

          <Stack spacing={1.5}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Contacts
              </Typography>
              <Button startIcon={<AddCircleOutlineIcon />} onClick={addContact} variant="text">
                Add contact
              </Button>
            </Stack>

            <Stack spacing={2}>
              {draft.contacts.map((contact, index) => (
                <Stack
                  key={`${index}-${contact.name}`}
                  spacing={1.5}
                  sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: 1 }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      Contact {index + 1}
                    </Typography>
                    <IconButton
                      onClick={() => removeContact(index)}
                      disabled={draft.contacts.length === 1 || loading}
                      size="small"
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextField
                      label="Name"
                      fullWidth
                      value={contact.name}
                      onChange={(event) =>
                        updateContact(index, { name: event.target.value })
                      }
                    />
                    <TextField
                      label="Role"
                      fullWidth
                      value={contact.role}
                      onChange={(event) =>
                        updateContact(index, { role: event.target.value })
                      }
                    />
                  </Stack>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextField
                      label="Email"
                      fullWidth
                      value={contact.email}
                      onChange={(event) =>
                        updateContact(index, { email: event.target.value })
                      }
                    />
                    <TextField
                      label="Phone"
                      fullWidth
                      value={contact.phone}
                      onChange={(event) =>
                        updateContact(index, { phone: event.target.value })
                      }
                    />
                  </Stack>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextField
                      label="WhatsApp"
                      fullWidth
                      value={contact.whatsapp}
                      onChange={(event) =>
                        updateContact(index, { whatsapp: event.target.value })
                      }
                    />
                    <TextField
                      select
                      label="Primary"
                      fullWidth
                      value={contact.isPrimary ? 'yes' : 'no'}
                      onChange={(event) =>
                        updateContact(index, { isPrimary: event.target.value === 'yes' })
                      }
                    >
                      <MenuItem value="yes">Yes</MenuItem>
                      <MenuItem value="no">No</MenuItem>
                    </TextField>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} disabled={loading} variant="outlined">
          Cancel
        </Button>
        <Button onClick={() => void handleSubmit()} disabled={loading} variant="contained">
          {loading ? (mode === 'create' ? 'Creating...' : 'Saving...') : mode === 'create' ? 'Create Supplier' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
