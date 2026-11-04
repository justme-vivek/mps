import React, { useState } from 'react';
import { FlatList } from 'react-native';
import Text from '../../src/components/ui/Text';
import Screen from '../../src/components/ui/Screen';
import Skeleton from '../../src/components/ui/Skeleton';
import EmptyState from '../../src/components/ui/EmptyState';
import ConfirmDialog from '../../src/components/ui/ConfirmDialog';
import Input from '../../src/components/ui/Input';
import EntityCard from '../../src/components/admin/EntityCard';
import AdminAddFab from '../../src/components/admin/AdminAddFab';
import FormModal from '../../src/components/admin/FormModal';
import { Field } from '../../src/components/admin/Field';
import ImagePickerField from '../../src/components/admin/ImagePickerField';
import { useGallery, galleryService } from '../../src/features/gallery/galleryService';
import { useEntityMutations } from '../../src/hooks/useEntityMutations';
import { useToast } from '../../src/components/ui/Toast';
import { toDateInput } from '../../src/utils/format';

const EMPTY = { title: '', category: 'General', date: '', media: { url: null, file: null } };

export default function AdminGallery() {
  const { data: photos = [], isLoading } = useGallery();
  const { create, update, remove } = useEntityMutations({
    service: galleryService,
    keys: galleryService.keys,
    noun: 'Photo',
  });
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [deleting, setDeleting] = useState(null);

  const openCreate = () => {
    setForm({ ...EMPTY, media: { url: null, file: null } });
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (photo) => {
    setForm({
      title: photo.title || '',
      category: photo.category || 'General',
      date: toDateInput(photo.date),
      media: { url: photo.imageUrl || null, file: null },
    });
    setEditingId(photo._id);
    setModalOpen(true);
  };

  const submit = () => {
    if (!form.title.trim()) {
      toast.show('Title is required', 'error');
      return;
    }
    if (!form.media.url) {
      toast.show('An image is required', 'error');
      return;
    }
    const fields = {
      title: form.title.trim(),
      category: form.category.trim() || 'General',
      ...(form.date ? { date: form.date } : {}),
      ...(form.media.file ? {} : { imageUrl: form.media.url }),
    };
    const payload = { fields, file: form.media.file };
    if (editingId) {
      update.mutate({ id: editingId, ...payload }, { onSuccess: () => setModalOpen(false) });
    } else {
      create.mutate(payload, { onSuccess: () => setModalOpen(false) });
    }
  };

  return (
    <Screen scroll={false} maxWidth={960}>
      <FlatList
        style={{ flex: 1 }}
        data={photos || []}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <EntityCard
            title={item.title}
            imageUrl={item.imageUrl}
            meta={`${item.category || 'General'} · ${toDateInput(item.date)}`}
            onEdit={() => openEdit(item)}
            onDelete={() => setDeleting(item)}
          />
        )}
        ListEmptyComponent={
          isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            <EmptyState title="No photos yet" message="Tap + to add photos to the gallery." />
          )
        }
      />

      <AdminAddFab label="Add photo" onPress={openCreate} />

      <FormModal
        visible={modalOpen}
        title={editingId ? 'Edit photo' : 'Add photo'}
        onClose={() => setModalOpen(false)}
        onSubmit={submit}
        submitting={create.isPending || update.isPending}
      >
        <Field label="Title *">
          <Input placeholder="e.g. Annual Day 2026" value={form.title} onChangeText={(v) => setForm((f) => ({ ...f, title: v }))} />
        </Field>
        <Field label="Category" hint="Photos are grouped by category in the app">
          <Input placeholder="General / Sports / Cultural…" value={form.category} onChangeText={(v) => setForm((f) => ({ ...f, category: v }))} />
        </Field>
        <Field label="Date" hint="Defaults to today">
          <Input placeholder="YYYY-MM-DD" value={form.date} onChangeText={(v) => setForm((f) => ({ ...f, date: v }))} />
        </Field>
        <ImagePickerField label="Photo" required value={form.media} onChange={(media) => setForm((f) => ({ ...f, media }))} />
      </FormModal>

      <ConfirmDialog
        visible={!!deleting}
        title="Delete photo?"
        message={`"${deleting?.title}" will be removed along with its image.`}
        confirmLabel="Delete"
        danger
        loading={remove.isPending}
        onConfirm={() => remove.mutate(deleting._id, { onSettled: () => setDeleting(null) })}
        onCancel={() => setDeleting(null)}
      />
    </Screen>
  );
}
