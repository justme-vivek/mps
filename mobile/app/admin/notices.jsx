import React, { useState } from 'react';
import Text from '../../src/components/ui/Text';
import Screen from '../../src/components/ui/Screen';
import EmptyState from '../../src/components/ui/EmptyState';
import ConfirmDialog from '../../src/components/ui/ConfirmDialog';
import Badge from '../../src/components/ui/Badge';
import Input from '../../src/components/ui/Input';
import AdminList from '../../src/components/admin/AdminList';
import EntityCard from '../../src/components/admin/EntityCard';
import AdminAddFab from '../../src/components/admin/AdminAddFab';
import FormModal from '../../src/components/admin/FormModal';
import { Field, SwitchRow } from '../../src/components/admin/Field';
import PdfPickerField from '../../src/components/admin/PdfPickerField';
import { useNoticesInfinite, noticeService } from '../../src/features/notices/noticeService';
import { useEntityMutations } from '../../src/hooks/useEntityMutations';
import { useToast } from '../../src/components/ui/Toast';
import { toDateInput } from '../../src/utils/format';

const EMPTY = {
  title: '',
  content: '',
  date: '',
  isImportant: false,
  isPinned: false,
  published: true,
  pdf: { url: null, file: null, name: null },
};

export default function AdminNotices() {
  const list = useNoticesInfinite();
  const notices = list.data || [];
  const { create, update, remove } = useEntityMutations({
    service: noticeService,
    keys: noticeService.keys,
    noun: 'Notice',
  });
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [deleting, setDeleting] = useState(null);

  const openCreate = () => {
    setForm({ ...EMPTY, date: toDateInput(new Date()), pdf: { url: null, file: null, name: null } });
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (notice) => {
    setForm({
      title: notice.title || '',
      content: notice.content || '',
      date: toDateInput(notice.date),
      isImportant: !!notice.isImportant,
      isPinned: !!notice.isPinned,
      published: notice.status !== 'draft',
      pdf: { url: notice.pdfUrl || null, file: null, name: notice.pdfUrl ? 'Attached PDF' : null },
    });
    setEditingId(notice._id);
    setModalOpen(true);
  };

  const submit = () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.show('Title and content are required', 'error');
      return;
    }
    const fields = {
      title: form.title.trim(),
      content: form.content.trim(),
      date: form.date || undefined,
      isImportant: form.isImportant,
      isPinned: form.isPinned,
      status: form.published ? 'published' : 'draft',
      ...(form.pdf.file ? {} : { pdfUrl: form.pdf.url || '' }),
    };
    const payload = { fields, file: form.pdf.file };
    if (editingId) {
      update.mutate({ id: editingId, ...payload }, { onSuccess: () => setModalOpen(false) });
    } else {
      create.mutate(payload, { onSuccess: () => setModalOpen(false) });
    }
  };

  return (
    <Screen scroll={false} maxWidth={960}>
      <AdminList
        list={list}
        renderItem={({ item }) => (
          <EntityCard
            title={item.title}
            subtitle={item.content}
            meta={`${item.status === 'draft' ? 'Draft' : 'Published'} · ${toDateInput(item.date)}`}
            badges={
              <>
                {item.isPinned ? <Badge label="Pinned" tone="accent" /> : null}
                {item.isImportant ? <Badge label="Important" tone="danger" /> : null}
                {item.pdfUrl ? <Badge label="PDF" tone="neutral" /> : null}
              </>
            }
            onEdit={() => openEdit(item)}
            onDelete={() => setDeleting(item)}
          />
        )}
        empty={<EmptyState title="No notices yet" message="Tap + to publish your first notice." />}
      />

      <AdminAddFab label="New notice" onPress={openCreate} />

      <FormModal
        visible={modalOpen}
        title={editingId ? 'Edit notice' : 'New notice'}
        onClose={() => setModalOpen(false)}
        onSubmit={submit}
        submitting={create.isPending || update.isPending}
      >
        <Field label="Title *">
          <Input placeholder="Notice title" value={form.title} onChangeText={(v) => setForm((f) => ({ ...f, title: v }))} />
        </Field>
        <Field label="Content *">
          <Input
            placeholder="Write the full notice…"
            multiline
            style={{ minHeight: 110, textAlignVertical: 'top' }}
            value={form.content}
            onChangeText={(v) => setForm((f) => ({ ...f, content: v }))}
          />
        </Field>
        <Field label="Date" hint="Defaults to today">
          <Input placeholder="YYYY-MM-DD" value={form.date} onChangeText={(v) => setForm((f) => ({ ...f, date: v }))} />
        </Field>
        <SwitchRow
          label="Important"
          description="Highlights the notice with a red badge"
          value={form.isImportant}
          onChange={(v) => setForm((f) => ({ ...f, isImportant: v }))}
        />
        <SwitchRow
          label="Pinned"
          description="Keeps the notice at the top of the list"
          value={form.isPinned}
          onChange={(v) => setForm((f) => ({ ...f, isPinned: v }))}
        />
        <SwitchRow
          label="Published"
          description="Drafts are hidden from the app"
          value={form.published}
          onChange={(v) => setForm((f) => ({ ...f, published: v }))}
        />
        <PdfPickerField label="PDF attachment (optional)" value={form.pdf} onChange={(pdf) => setForm((f) => ({ ...f, pdf }))} />
      </FormModal>

      <ConfirmDialog
        visible={!!deleting}
        title="Delete notice?"
        message={`"${deleting?.title}" and its attachment will be removed.`}
        confirmLabel="Delete"
        danger
        loading={remove.isPending}
        onConfirm={() => remove.mutate(deleting._id, { onSettled: () => setDeleting(null) })}
        onCancel={() => setDeleting(null)}
      />
    </Screen>
  );
}
