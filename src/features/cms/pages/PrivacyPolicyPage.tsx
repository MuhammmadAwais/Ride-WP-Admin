import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import CMSContentEngine from '../components/CMSContentEngine';
import { MOCK_PRIVACY_POLICY } from '../utils/constants';
import { type CMSBlock } from '../types';
import { useGetCMSContentQuery, useUpdateCMSContentMutation } from '../api/cmsApi';
import { deserializeCMSBlocks, serializeCMSBlocks } from '../utils/contentAdapter';

export default function PrivacyPolicyPage() {
  const { data, isLoading } = useGetCMSContentQuery('privacy_policy');
  const [updateCMSContent, { isLoading: isSaving }] = useUpdateCMSContentMutation();

  const blocks: CMSBlock[] = useMemo(() => {
    return deserializeCMSBlocks(data?.content, MOCK_PRIVACY_POLICY);
  }, [data?.content]);

  const handleSave = async (updatedBlocks: CMSBlock[]) => {
    try {
      const serialized = serializeCMSBlocks(updatedBlocks);
      await updateCMSContent({
        type: 'privacy_policy',
        title: data?.title ?? 'Privacy Policy',
        content: serialized,
      }).unwrap();
    } catch (err) {
      console.error('Failed to save Privacy Policy content:', err);
    }
  };

  return (
    <>
      <Helmet>
        <title>Privacy Policy CMS | Ride With Pals</title>
      </Helmet>
      <div className="min-h-screen pt-4 pb-20 px-2 sm:px-8 max-w-7xl mx-auto">
        <CMSContentEngine 
          key={data?.content || 'default'}
          pageTitle="Privacy Policy"
          pageSubtitle="Manage client privacy regulations, cookie policies, and data processing blocks"
          initialBlocks={blocks}
          onSave={handleSave}
          isLoading={isLoading}
          isSaving={isSaving}
        />
      </div>
    </>
  );
}
