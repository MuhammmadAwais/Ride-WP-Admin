import { Helmet } from 'react-helmet-async';
import CMSContentEngine from '../components/CMSContentEngine';
import { MOCK_TERMS_CONDITIONS } from '../utils/constants';
import { type CMSBlock } from '../types';

export default function TermsConditionsPage() {
  const handleSave = (updatedBlocks: CMSBlock[]) => {
    console.log('Saved Terms & Conditions blocks:', updatedBlocks);
  };

  return (
    <>
      <Helmet>
        <title>Terms & Conditions CMS | Ride With Pals</title>
      </Helmet>
      <div className="min-h-screen pt-4 pb-20 px-2 sm:px-8 max-w-7xl mx-auto">
        <CMSContentEngine 
          pageTitle="Terms & Conditions"
          pageSubtitle="Modify driver coordination guidelines, subscription platform terms, and liability limits"
          initialBlocks={MOCK_TERMS_CONDITIONS}
          onSave={handleSave}
        />
      </div>
    </>
  );
}
