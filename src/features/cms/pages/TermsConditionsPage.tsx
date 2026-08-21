import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import CMSContentEngine from '../components/CMSContentEngine';
import { MOCK_TERMS_CONDITIONS } from '../utils/constants';
import { type CMSBlock } from '../types';
import { useGetCMSContentQuery, useUpdateCMSContentMutation } from '../api/cmsApi';
import { deserializeCMSBlocks, serializeCMSBlocks } from '../utils/contentAdapter';

export default function TermsConditionsPage() {
  const { data, isLoading } = useGetCMSContentQuery('terms_conditions');
  const [updateCMSContent, { isLoading: isSaving }] = useUpdateCMSContentMutation();

  const blocks: CMSBlock[] = useMemo(() => {
    return deserializeCMSBlocks(data?.content, MOCK_TERMS_CONDITIONS);
  }, [data?.content]);

  const handleSave = async (updatedBlocks: CMSBlock[]) => {
    try {
      const serialized = serializeCMSBlocks(updatedBlocks);
      await updateCMSContent({
        type: 'terms_conditions',
        title: data?.title ?? 'Terms & Conditions',
        content: serialized,
      }).unwrap();
    } catch (err) {
      console.error('Failed to save Terms & Conditions content:', err);
    }
  };

  return (
    <>
      <Helmet>
        <title>Terms & Conditions CMS | Ride With Pals</title>
      </Helmet>
      <div className="min-h-screen pt-4 pb-20 px-2 sm:px-8 max-w-7xl mx-auto">
        <CMSContentEngine 
          key={data?.content || 'default'}
          pageTitle="Terms & Conditions"
          pageSubtitle="Modify driver coordination guidelines, subscription platform terms, and liability limits"
          initialBlocks={blocks}
          onSave={handleSave}
          isLoading={isLoading}
          isSaving={isSaving}
        />
      </div>
    </>
  );
}
