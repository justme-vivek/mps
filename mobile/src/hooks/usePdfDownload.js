import React, { useCallback, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../features/auth/AuthContext';
import { useToast } from '../components/ui/Toast';
import { useIncrementDownload } from '../features/downloads/downloadService';
import { downloadPdf, sharePdf } from '../utils/pdf';

/**
 * Download-and-share flow for PDF files.
 * Signed-in feature: guests are prompted to log in.
 * Registers the download with the backend (increments the counter).
 */
export function usePdfDownload() {
  const { status } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const increment = useIncrementDownload();
  const [busyId, setBusyId] = useState(null);

  const run = useCallback(
    async (item) => {
      if (status !== 'authenticated') {
        toast.show('Sign in to download files', 'info');
        router.push('/login');
        return;
      }
      setBusyId(item._id);
      try {
        const uri = await downloadPdf(item.fileUrl || item.pdfUrl, `${item.title || 'document'}.pdf`);
        await sharePdf(uri);
        increment.mutate(item._id);
      } catch (error) {
        toast.show('Download failed. Please try again.', 'error');
      } finally {
        setBusyId(null);
      }
    },
    [status, router, toast, increment]
  );

  return { run, busyId };
}

