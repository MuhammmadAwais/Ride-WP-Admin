import { type CMSBlock } from '../types';

export const MOCK_PRIVACY_POLICY: CMSBlock[] = [
  {
    id: 'pp-1',
    type: 'heading',
    content: '1. Introduction and Scope'
  },
  {
    id: 'pp-2',
    type: 'paragraph',
    content: 'Welcome to Ride With Pals. We value your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our admin control panel and associated driver application services.'
  },
  {
    id: 'pp-3',
    type: 'heading',
    content: '2. Information We Collect'
  },
  {
    id: 'pp-4',
    type: 'paragraph',
    content: 'We process personal driver data to guarantee secure ride coordinations across active club routes. This includes:'
  },
  {
    id: 'pp-5',
    type: 'list',
    content: [
      'Geographical coordinates and realtime location streams during active club runs.',
      'Driver contact information, including emails, usernames, and telephone logs.',
      'Payment transaction metadata (excluding raw financial credit details).'
    ]
  },
  {
    id: 'pp-6',
    type: 'heading',
    content: '3. Data Security Measures'
  },
  {
    id: 'pp-7',
    type: 'paragraph',
    content: 'All transmissions utilize end-to-end SSL layers. Access logs within this administrative panel are audited continuously to guarantee compliance with regional privacy guidelines and prevent unauthorized administrative data leaks.'
  }
];

export const MOCK_TERMS_CONDITIONS: CMSBlock[] = [
  {
    id: 'tc-1',
    type: 'heading',
    content: '1. Administrative Acceptable Use'
  },
  {
    id: 'tc-2',
    type: 'paragraph',
    content: 'By accessing this admin control panel, you agree to manage platform operations professionally. Administrative accounts must not manipulate platform metrics, distribute false posts, or leak sensitive user data to external agencies.'
  },
  {
    id: 'tc-3',
    type: 'heading',
    content: '2. Club Coordination Guidelines'
  },
  {
    id: 'tc-4',
    type: 'paragraph',
    content: 'Club creators and operators hold full liability for coordinating physical runs. Ride With Pals operates as a SaaS coordinator tool and is not liable for road hazards, vehicle maintenance issues, or participant physical accidents.'
  },
  {
    id: 'tc-5',
    type: 'list',
    content: [
      'Operators must verify physical road safety parameters before scheduling runs.',
      'Discriminatory club guidelines or selective access restrictions are strictly prohibited.',
      'Platform fees are processed immediately and are non-refundable upon coordinate publication.'
    ]
  }
];

export const MOCK_ABOUT_PAGE: CMSBlock[] = [
  {
    id: 'ab-1',
    type: 'heading',
    content: 'Our Vision'
  },
  {
    id: 'ab-2',
    type: 'paragraph',
    content: 'Ride With Pals was built to bridge the gap between active car club organizers and driving enthusiasts. We offer advanced ride-coordination parameters, real-time map synchronization overlays, and secure, flat subscription payments.'
  },
  {
    id: 'ab-3',
    type: 'heading',
    content: 'Platform Accomplishments'
  },
  {
    id: 'ab-4',
    type: 'paragraph',
    content: 'Since our launch, we have successfully managed and scaled hundreds of premium car club spaces across the globe, driving deeper local community connections:'
  },
  {
    id: 'ab-5',
    type: 'list',
    content: [
      'Over 200,000 completed group runs and neonatal chase tracks.',
      'Active club spaces processing subscription coordinate access safely.',
      'High driver retention rates supported by optimized real-time communication modules.'
    ]
  }
];
