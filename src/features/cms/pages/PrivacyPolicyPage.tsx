import { Helmet } from 'react-helmet-async';
import CMSContentEngine from '../components/CMSContentEngine';
import { MOCK_PRIVACY_POLICY } from '../utils/constants';
import { type CMSBlock } from '../types';

export default function PrivacyPolicyPage() {
  const handleSave = (updatedBlocks: CMSBlock[]) => {
    console.log('Saved Privacy Policy blocks:', updatedBlocks);
  };

  return (
    <>
      <Helmet>
        <title>Privacy Policy CMS | Ride With Pals</title>
      </Helmet>
      <div className="min-h-screen pt-4 pb-20 px-2 sm:px-8 max-w-7xl mx-auto">
        <CMSContentEngine 
          pageTitle="Privacy Policy"
          pageSubtitle="Manage client privacy regulations, cookie policies, and data processing blocks"
          initialBlocks={MOCK_PRIVACY_POLICY}
          onSave={handleSave}
        />
      </div>
    </>
  );
}
