import React, { useState } from 'react';
import { FlatList } from 'react-native';
import Text from '../../src/components/ui/Text';
import Screen from '../../src/components/ui/Screen';
import Skeleton from '../../src/components/ui/Skeleton';
import EmptyState from '../../src/components/ui/EmptyState';
import ConfirmDialog from '../../src/components/ui/ConfirmDialog';
import Badge from '../../src/components/ui/Badge';
import Input from '../../src/components/ui/Input';
import EntityCard from '../../src/components/admin/EntityCard';
import AdminAddFab from '../../src/components/admin/AdminAddFab';
import FormModal from '../../src/components/admin/FormModal';
import { Field, SwitchRow } from '../../src/components/admin/Field';
import ImagePickerField from '../../src/components/admin/ImagePickerField';
import { useBanners, bannerService } from '../../src/features/banners/bannerService';
import { useEntityMutations } from '../../src/hooks/useEntityMutations';
import { useToast } from '../../src/components/ui/Toast';

const EMPTY = { title: '', subtitle: '', link: '', order: '0', isActive: true, media: { url: null, file: null } };

export default function AdminBanners() {
  const { data: banners = [], isLoading } = useBanners();
  const { create, update, remove } = useEntityMutations({
    service: bannerService,
    keys: bannerService.keys,
    noun: 'Banner',
  });
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [deleting, setDeleting] = useState(null);

  const openCreate = () => {
    setForm(EMPTY);
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (banner) => {
    setForm({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      link: banner.link || '',
      order: String(banner.order ?? 0),
      isActive: banner.isActive !== false,
      media: { url: banner.imageUrl || null, file: null },
    });
    setEditingId(banner._id);
    setModalOpen(true);
  };

  const submit = () => {
    if (!form.title.trim()) {
      toast.show('Title is required', 'error');
      return;
    }
    if (!form.media.url) {
      toast.show('A banner image is required', 'error');
      return;
    }
    const fields = {
      title: form.title.trim(),
      subtitle: form.subtitle,
      link: form.link,
      order: form.order,
      isActive: form.isActive,
      // send the URL only when no freshly picked file is attached
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
        data={banners || []}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <EntityCard
            title={item.title}
            subtitle={item.subtitle}
            imageUrl={item.imageUrl}
            meta={`Order ${item.order ?? 0}`}
            badges={<Badge label={item.isActive !== false ? 'Active' : 'Hidden'} tone={item.isActive !== false ? 'success' : 'neutral'} />}
            onEdit={() => openEdit(item)}
            onDelete={() => setDeleting(item)}
          />
        )}
        ListEmptyComponent={
          isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            <EmptyState
              title="No banners yet"
              message="Hero banners appear at the top of the app home screen."
            />
          )
        }
      />

      {/* Floating add button */}
      <AdminAddFab label="New banner" onPress={openCreate} />

      <FormModal
        visible={modalOpen}
        title={editingId ? 'Edit banner' : 'New banner'}
        onClose={() => setModalOpen(false)}
        onSubmit={submit}
        submitting={create.isPending || update.isPending}
      >
        <Field label="Title *">
          <Input placeholder="e.g. Admissions Open 2026-27" value={form.title} onChangeText={(v) => setForm((f) => ({ ...f, title: v }))} />
        </Field>
        <Field label="Subtitle">
          <Input placeholder="Supporting line" value={form.subtitle} onChangeText={(v) => setForm((f) => ({ ...f, subtitle: v }))} />
        </Field>
        <Field label="Link (optional)">
          <Input placeholder="/notices" autoCapitalize="none" value={form.link} onChangeText={(v) => setForm((f) => ({ ...f, link: v }))} />
        </Field>
        <Field label="Display order">
          <Input placeholder="0" keyboardType="number-pad" value={form.order} onChangeText={(v) => setForm((f) => ({ ...f, order: v }))} />
        </Field>
        <SwitchRow
          label="Active"
          description="Inactive banners are hidden from the app"
          value={form.isActive}
          onChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
        />
        <ImagePickerField label="Banner image" required value={form.media} onChange={(media) => setForm((f) => ({ ...f, media }))} />
      </FormModal>

      <ConfirmDialog
        visible={!!deleting}
        title="Delete banner?"
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
