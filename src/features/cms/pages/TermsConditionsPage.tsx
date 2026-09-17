import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import CMSContentEngine from '../components/CMSContentEngine';
import { MOCK_TERMS_CONDITIONS } from '../utils/constants';
import { type CMSBlock } from '../types';
import { useGetCMSContentQuery, useUpdateCMSContentMutation } from '../api/cmsApi';
import { deserializeCMSBlocks, serializeCMSBlocks } from '../utils/contentAdapter';

export default function TermsConditionsPage() {
  const { data, isLoading } = useGetCMSContentQuery('terms_conditions');
  const [updateCMSContent, { isLoading: isSaving }] = useUpdateCMSContentMutation();

  const blocksEn: CMSBlock[] = useMemo(() => {
    return deserializeCMSBlocks(data?.content, MOCK_TERMS_CONDITIONS);
  }, [data?.content]);

  const blocksEs: CMSBlock[] = useMemo(() => {
    return deserializeCMSBlocks(data?.contentEs, []);
  }, [data?.contentEs]);

  const handleSave = async (
    updatedBlocksEn: CMSBlock[],
    updatedBlocksEs?: CMSBlock[],
    language?: 'en' | 'es'
  ) => {
    try {
      const serializedEn = serializeCMSBlocks(updatedBlocksEn);
      const serializedEs = updatedBlocksEs && updatedBlocksEs.length > 0
        ? serializeCMSBlocks(updatedBlocksEs)
        : undefined;

      await updateCMSContent({
        type: 'terms_conditions',
        title: data?.title ?? 'Terms & Conditions',
        content: serializedEn,
        titleEs: data?.titleEs ?? 'Términos y Condiciones',
        contentEs: serializedEs,
        language: language ?? 'en',
      }).unwrap();

      toast.success('Terms & Conditions updated and published successfully!');
    } catch (err: unknown) {
      const errorObj = err as { message?: string; data?: { message?: string } };
      const msg = errorObj?.message || errorObj?.data?.message || 'Failed to save Terms & Conditions content.';
      toast.error(msg);
      throw err;
    }
  };

  return (
    <>
      <Helmet>
        <title>Terms & Conditions CMS | Ride With Pals</title>
      </Helmet>
      <div className="min-h-screen pt-4 pb-20 px-2 sm:px-8 max-w-7xl mx-auto">
        <CMSContentEngine
          key={`${data?.content || 'default'}-${data?.contentEs || 'default-es'}`}
          pageTitle="Terms & Conditions"
          pageSubtitle="Modify driver coordination guidelines, subscription platform terms, and liability limits"
          initialBlocks={blocksEn}
          initialBlocksEs={blocksEs}
          onSave={handleSave}
          isLoading={isLoading}
          isSaving={isSaving}
        />
      </div>
    </>
  );
}
