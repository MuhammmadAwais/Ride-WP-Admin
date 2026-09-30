export type CMSBlockType = 'heading' | 'subheading' | 'paragraph' | 'list';

export interface CMSBlock {
  id: string;
  type: CMSBlockType;
  content: string | string[];
}
