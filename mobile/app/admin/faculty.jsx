import React, { useState } from 'react';
import { FlatList, Pressable, Text } from 'react-native';
import { Plus } from 'lucide-react-native';
import Screen from '../../src/components/ui/Screen';
import Skeleton from '../../src/components/ui/Skeleton';
import EmptyState from '../../src/components/ui/EmptyState';
import ConfirmDialog from '../../src/components/ui/ConfirmDialog';
import Input from '../../src/components/ui/Input';
import EntityCard from '../../src/components/admin/EntityCard';
import FormModal from '../../src/components/admin/FormModal';
import { Field } from '../../src/components/admin/Field';
import ImagePickerField from '../../src/components/admin/ImagePickerField';
import { useFaculty, facultyService } from '../../src/features/faculty/facultyService';
import { useEntityMutations } from '../../src/hooks/useEntityMutations';
import { useToast } from '../../src/components/ui/Toast';

const EMPTY = { name: '', designation: '', bio: '', order: '0', media: { url: null, file: null } };

export default function AdminFaculty() {
  const { data: faculty = [], isLoading } = useFaculty();
  const { create, update, remove } = useEntityMutations({
    service: facultyService,
    keys: facultyService.keys,
    noun: 'Faculty member',
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

  const openEdit = (member) => {
    setForm({
      name: member.name || '',
      designation: member.designation || '',
      bio: member.bio || '',
      order: String(member.order ?? 0),
      media: { url: member.photoUrl || null, file: null },
    });
    setEditingId(member._id);
    setModalOpen(true);
  };

  const submit = () => {
    if (!form.name.trim() || !form.designation.trim()) {
      toast.show('Name and designation are required', 'error');
      return;
    }
    if (!form.media.url) {
      toast.show('A photo is required', 'error');
      return;
    }
    const fields = {
      name: form.name.trim(),
      designation: form.designation.trim(),
      bio: form.bio,
      order: form.order,
      ...(form.media.file ? {} : { photoUrl: form.media.url }),
    };
    const payload = { fields, file: form.media.file };
    if (editingId) {
      update.mutate({ id: editingId, ...payload }, { onSuccess: () => setModalOpen(false) });
    } else {
      create.mutate(payload, { onSuccess: () => setModalOpen(false) });
    }
  };

  return (
    <Screen>
      <FlatList
        data={faculty || []}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <EntityCard
            title={item.name}
            subtitle={item.designation}
            imageUrl={item.photoUrl}
            meta={`Order ${item.order ?? 0}`}
            onEdit={() => openEdit(item)}
            onDelete={() => setDeleting(item)}
          />
        )}
        ListEmptyComponent={
          isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            <EmptyState title="No faculty yet" message="Tap + to add faculty profiles." />
          )
        }
      />

      <Pressable
        onPress={openCreate}
        className="absolute bottom-8 right-6 h-14 w-14 items-center justify-center rounded-full bg-primary-600 shadow-lg"
      >
        <Plus size={26} color="#FFFFFF" />
      </Pressable>

      <FormModal
        visible={modalOpen}
        title={editingId ? 'Edit faculty member' : 'New faculty member'}
        onClose={() => setModalOpen(false)}
        onSubmit={submit}
        submitting={create.isPending || update.isPending}
      >
        <Field label="Name *">
          <Input placeholder="Full name" value={form.name} onChangeText={(v) => setForm((f) => ({ ...f, name: v }))} />
        </Field>
        <Field label="Designation *">
          <Input placeholder="e.g. PGT Mathematics" value={form.designation} onChangeText={(v) => setForm((f) => ({ ...f, designation: v }))} />
        </Field>
        <Field label="Bio">
          <Input
            placeholder="Short profile"
            multiline
            style={{ minHeight: 80, textAlignVertical: 'top' }}
            value={form.bio}
            onChangeText={(v) => setForm((f) => ({ ...f, bio: v }))}
          />
        </Field>
        <Field label="Display order">
          <Input placeholder="0" keyboardType="number-pad" value={form.order} onChangeText={(v) => setForm((f) => ({ ...f, order: v }))} />
        </Field>
        <ImagePickerField label="Photo" required value={form.media} onChange={(media) => setForm((f) => ({ ...f, media }))} />
      </FormModal>

      <ConfirmDialog
        visible={!!deleting}
        title="Delete faculty member?"
        message={`"${deleting?.name}" will be removed along with their photo.`}
        confirmLabel="Delete"
        danger
        loading={remove.isPending}
        onConfirm={() => remove.mutate(deleting._id, { onSettled: () => setDeleting(null) })}
        onCancel={() => setDeleting(null)}
      />
    </Screen>
  );
}
