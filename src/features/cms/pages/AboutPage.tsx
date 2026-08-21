import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import CMSContentEngine from '../components/CMSContentEngine';
import { MOCK_ABOUT_PAGE } from '../utils/constants';
import { type CMSBlock } from '../types';
import { useGetCMSContentQuery, useUpdateCMSContentMutation } from '../api/cmsApi';
import { deserializeCMSBlocks, serializeCMSBlocks } from '../utils/contentAdapter';

export default function AboutPage() {
  const { data, isLoading } = useGetCMSContentQuery('about');
  const [updateCMSContent, { isLoading: isSaving }] = useUpdateCMSContentMutation();

  const blocks: CMSBlock[] = useMemo(() => {
    return deserializeCMSBlocks(data?.content, MOCK_ABOUT_PAGE);
  }, [data?.content]);

  const handleSave = async (updatedBlocks: CMSBlock[]) => {
    try {
      const serialized = serializeCMSBlocks(updatedBlocks);
      await updateCMSContent({
        type: 'about',
        title: data?.title ?? 'About',
        content: serialized,
      }).unwrap();
    } catch (err) {
      console.error('Failed to save About Page content:', err);
    }
  };

  return (
    <>
      <Helmet>
        <title>About CMS | Ride With Pals</title>
      </Helmet>
      <div className="min-h-screen pt-4 pb-20 px-2 sm:px-8 max-w-7xl mx-auto">
        <CMSContentEngine 
          key={data?.content || 'default'}
          pageTitle="About Page"
          pageSubtitle="Publish platform vision statements, completed group run metrics, and community statistics"
          initialBlocks={blocks}
          onSave={handleSave}
          isLoading={isLoading}
          isSaving={isSaving}
        />
      </div>
    </>
  );
}
