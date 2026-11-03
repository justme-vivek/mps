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
import { useEvents, eventService } from '../../src/features/events/eventService';
import { useEntityMutations } from '../../src/hooks/useEntityMutations';
import { useToast } from '../../src/components/ui/Toast';
import { toDateInput } from '../../src/utils/format';

const EMPTY = {
  title: '',
  description: '',
  date: toDateInput(new Date()),
  location: '',
  media: { url: null, file: null },
};

export default function AdminEvents() {
  const { data: events = [], isLoading } = useEvents();
  const { create, update, remove } = useEntityMutations({
    service: eventService,
    keys: eventService.keys,
    noun: 'Event',
  });
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [deleting, setDeleting] = useState(null);

  const openCreate = () => {
    setForm({ ...EMPTY, date: toDateInput(new Date()), media: { url: null, file: null } });
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (event) => {
    setForm({
      title: event.title || '',
      description: event.description || '',
      date: toDateInput(event.date),
      location: event.location || '',
      media: { url: event.bannerUrl || null, file: null },
    });
    setEditingId(event._id);
    setModalOpen(true);
  };

  const submit = () => {
    if (!form.title.trim() || !form.description.trim() || !form.date) {
      toast.show('Title, description and date are required', 'error');
      return;
    }
    const fields = {
      title: form.title.trim(),
      description: form.description.trim(),
      date: form.date,
      location: form.location,
      ...(form.media.file ? {} : { bannerUrl: form.media.url || '' }),
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
        data={events || []}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <EntityCard
            title={item.title}
            subtitle={item.description}
            imageUrl={item.bannerUrl}
            meta={`${toDateInput(item.date)}${item.location ? ` · ${item.location}` : ''}`}
            onEdit={() => openEdit(item)}
            onDelete={() => setDeleting(item)}
          />
        )}
        ListEmptyComponent={
          isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            <EmptyState title="No events yet" message="Tap + to schedule your first event." />
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
        title={editingId ? 'Edit event' : 'New event'}
        onClose={() => setModalOpen(false)}
        onSubmit={submit}
        submitting={create.isPending || update.isPending}
      >
        <Field label="Title *">
          <Input placeholder="Event title" value={form.title} onChangeText={(v) => setForm((f) => ({ ...f, title: v }))} />
        </Field>
        <Field label="Description *">
          <Input
            placeholder="What is happening?"
            multiline
            style={{ minHeight: 90, textAlignVertical: 'top' }}
            value={form.description}
            onChangeText={(v) => setForm((f) => ({ ...f, description: v }))}
          />
        </Field>
        <Field label="Date *" hint="Format: YYYY-MM-DD">
          <Input placeholder="2026-03-12" value={form.date} onChangeText={(v) => setForm((f) => ({ ...f, date: v }))} />
        </Field>
        <Field label="Location">
          <Input placeholder="School auditorium" value={form.location} onChangeText={(v) => setForm((f) => ({ ...f, location: v }))} />
        </Field>
        <ImagePickerField label="Banner image (optional)" value={form.media} onChange={(media) => setForm((f) => ({ ...f, media }))} />
      </FormModal>

      <ConfirmDialog
        visible={!!deleting}
        title="Delete event?"
        message={`"${deleting?.title}" will be removed along with its banner.`}
        confirmLabel="Delete"
        danger
        loading={remove.isPending}
        onConfirm={() => remove.mutate(deleting._id, { onSettled: () => setDeleting(null) })}
        onCancel={() => setDeleting(null)}
      />
    </Screen>
  );
}
