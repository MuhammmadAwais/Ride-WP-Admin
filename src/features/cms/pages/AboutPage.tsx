import { Helmet } from 'react-helmet-async';
import CMSContentEngine from '../components/CMSContentEngine';
import { MOCK_ABOUT_PAGE } from '../utils/constants';
import { type CMSBlock } from '../types';

export default function AboutPage() {
  const handleSave = (updatedBlocks: CMSBlock[]) => {
    console.log('Saved About Page blocks:', updatedBlocks);
  };

  return (
    <>
      <Helmet>
        <title>About CMS | Ride With Pals</title>
      </Helmet>
      <div className="min-h-screen pt-4 pb-20 px-2 sm:px-8 max-w-7xl mx-auto">
        <CMSContentEngine 
          pageTitle="About Page"
          pageSubtitle="Publish platform vision statements, completed group run metrics, and community statistics"
          initialBlocks={MOCK_ABOUT_PAGE}
          onSave={handleSave}
        />
      </div>
    </>
  );
}
