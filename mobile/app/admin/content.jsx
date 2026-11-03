import React, { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import Screen from '../../src/components/ui/Screen';
import Skeleton from '../../src/components/ui/Skeleton';
import ListRow from '../../src/components/ui/ListRow';
import Input from '../../src/components/ui/Input';
import FormModal from '../../src/components/admin/FormModal';
import { Field } from '../../src/components/admin/Field';
import { useContentSection, useUpdateContentSection } from '../../src/features/content/contentService';
import { useToast } from '../../src/components/ui/Toast';
import { apiErrorMessage } from '../../src/services/api';

const SECTIONS = [
  { id: 'about', title: 'About Us' },
  { id: 'principal-message', title: "Principal's Message" },
  { id: 'admissions', title: 'Admissions' },
  { id: 'infrastructure', title: 'Infrastructure' },
  { id: 'contact', title: 'Contact Info' },
];

export default function AdminContent() {
  const toast = useToast();
  const updateSection = useUpdateContentSection();
  const [activeId, setActiveId] = useState(null);
  const [form, setForm] = useState({ title: '', content: '' });

  const { data: section, isLoading } = useContentSection(activeId);

  const openSection = (id) => {
    setActiveId(id);
    setForm({ title: '', content: '' });
  };

  // hydrate the form once the section loads
  React.useEffect(() => {
    if (section) {
      setForm({ title: section.title || '', content: section.content || '' });
    }
  }, [section]);

  const save = () => {
    updateSection.mutate(
      { sectionId: activeId, payload: { title: form.title, content: form.content } },
      {
        onSuccess: () => {
          toast.show('Content saved', 'success');
          setActiveId(null);
        },
        onError: (error) => toast.show(apiErrorMessage(error), 'error'),
      }
    );
  };

  const activeTitle = SECTIONS.find((s) => s.id === activeId)?.title;

  return (
    <Screen>
      <Text className="mb-1 text-2xl font-black text-ink">Website Content</Text>
      <Text className="mb-4 text-[13px] text-ink-muted">
        Edit the text blocks shown across the app.
      </Text>

      <FlatList
        data={SECTIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ListRow
            title={item.title}
            subtitle={`Section: ${item.id}`}
            chevron
            onPress={() => openSection(item.id)}
            className="mb-3"
          />
        )}
      />

      <FormModal
        visible={!!activeId}
        title={`Edit: ${activeTitle || ''}`}
        onClose={() => setActiveId(null)}
        onSubmit={save}
        submitLabel="Save changes"
        submitting={updateSection.isPending}
      >
        {isLoading ? (
          <View style={{ gap: 10 }}>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
          </View>
        ) : (
          <>
            <Field label="Heading">
              <Input placeholder="Section heading" value={form.title} onChangeText={(v) => setForm((f) => ({ ...f, title: v }))} />
            </Field>
            <Field label="Body text">
              <Input
                placeholder="Write the section content…"
                multiline
                style={{ minHeight: 160, textAlignVertical: 'top' }}
                value={form.content}
                onChangeText={(v) => setForm((f) => ({ ...f, content: v }))}
              />
            </Field>
          </>
        )}
      </FormModal>
    </Screen>
  );
}
