export type CMSBlockType = 'heading' | 'paragraph' | 'list';

export interface CMSBlock {
  id: string;
  type: CMSBlockType;
  content: string | string[];
}
