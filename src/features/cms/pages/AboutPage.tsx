import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import CMSContentEngine from '../components/CMSContentEngine';
import { MOCK_ABOUT_PAGE } from '../utils/constants';
import { type CMSBlock } from '../types';
import { useGetCMSContentQuery, useUpdateCMSContentMutation } from '../api/cmsApi';
import { deserializeCMSBlocks, serializeCMSBlocks } from '../utils/contentAdapter';

export default function AboutPage() {
  const { data, isLoading } = useGetCMSContentQuery('about');
  const [updateCMSContent, { isLoading: isSaving }] = useUpdateCMSContentMutation();

  const blocksEn: CMSBlock[] = useMemo(() => {
    return deserializeCMSBlocks(data?.content, MOCK_ABOUT_PAGE);
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
      const serializedEs =
        updatedBlocksEs && updatedBlocksEs.length > 0
          ? serializeCMSBlocks(updatedBlocksEs)
          : undefined;

      await updateCMSContent({
        type: 'about',
        title: data?.title ?? 'About Ride With Pals',
        content: serializedEn,
        titleEs: data?.titleEs ?? 'Sobre Ride With Pals',
        contentEs: serializedEs,
        language: language ?? 'en',
      }).unwrap();

      toast.success('About Us content updated and published successfully!');
    } catch (err: unknown) {
      const errorObj = err as { message?: string; data?: { message?: string } };
      const msg =
        errorObj?.message || errorObj?.data?.message || 'Failed to save About Us content.';
      toast.error(msg);
      throw err;
    }
  };

  return (
    <>
      <Helmet>
        <title>About Us CMS | Ride With Pals</title>
      </Helmet>
      <div className="min-h-screen pt-4 pb-20 px-2 sm:px-8 max-w-7xl mx-auto">
        <CMSContentEngine
          key={`${data?.content || 'default'}-${data?.contentEs || 'default-es'}`}
          pageTitle="About Ride With Pals"
          pageSubtitle="Manage community introduction, platform mission, athlete achievements, and organization story"
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
