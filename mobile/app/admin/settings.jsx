import React, { useEffect, useState } from 'react';
import Text from '../../src/components/ui/Text';
import Screen from '../../src/components/ui/Screen';
import PageTitle from '../../src/components/ui/PageTitle';
import Skeleton from '../../src/components/ui/Skeleton';
import Input from '../../src/components/ui/Input';
import Button from '../../src/components/ui/Button';
import Card from '../../src/components/ui/Card';
import { Field, SwitchRow } from '../../src/components/admin/Field';
import { useSettings, useUpdateSettings } from '../../src/features/settings/settingsService';
import { useToast } from '../../src/components/ui/Toast';
import { apiErrorMessage } from '../../src/services/api';

const SCHEMA = [
  { key: 'schoolName', label: 'School name' },
  { key: 'email', label: 'Contact email' },
  { key: 'phone', label: 'Contact phone' },
  { key: 'address', label: 'Address' },
  { key: 'website', label: 'Website' },
];

export default function AdminSettings() {
  const toast = useToast();
  const { data: settings, isLoading } = useSettings();
  const update = useUpdateSettings();
  const [form, setForm] = useState({});

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const save = () => {
    update.mutate(form, {
      onSuccess: () => toast.show('Settings saved', 'success'),
      onError: (error) => toast.show(apiErrorMessage(error), 'error'),
    });
  };

  if (isLoading) {
    return (
      <Screen maxWidth={560}>
        <Skeleton className="mb-3 h-8 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </Screen>
    );
  }

  return (
    <Screen maxWidth={560}>
      <PageTitle title="Settings" subtitle="Global school information" />

      <Card className="mb-4">
        {SCHEMA.map(({ key, label }) => (
          <Field key={key} label={label}>
            <Input
              placeholder={label}
              value={form[key] || ''}
              onChangeText={(v) => setForm((f) => ({ ...f, [key]: v }))}
            />
          </Field>
        ))}
        <SwitchRow
          label="Admissions open"
          description="Shows the admissions ribbon in the app"
          value={form.admissionsOpen !== false}
          onChange={(v) => setForm((f) => ({ ...f, admissionsOpen: v }))}
        />
      </Card>

      <Button title="Save settings" onPress={save} loading={update.isPending} size="lg" />
    </Screen>
  );
}
