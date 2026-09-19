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
    content: 'Our Mission & Community Vision'
  },
  {
    id: 'ab-2',
    type: 'paragraph',
    content: 'Ride With Pals was built to empower cycling, running, and endurance sports enthusiasts to connect, ride together, and grow thriving clubs. We provide real-time GPX route navigation, coordinated group rides, Strava synchronization, and transparent club membership management.'
  },
  {
    id: 'ab-3',
    type: 'heading',
    content: 'Platform Accomplishments'
  },
  {
    id: 'ab-4',
    type: 'paragraph',
    content: 'Since our inception, athletes and club leaders worldwide have organized thousands of rides and trail runs, elevating camaraderie and outdoor fitness:'
  },
  {
    id: 'ab-5',
    type: 'list',
    content: [
      'Over 50,000 completed club rides and endurance events across road, gravel, and trail sports.',
      'Active sports clubs processing membership tiers with seamless Stripe integrations.',
      'Safe peer-to-peer cycling marketplace and direct club merchandise shops.'
    ]
  }
];

