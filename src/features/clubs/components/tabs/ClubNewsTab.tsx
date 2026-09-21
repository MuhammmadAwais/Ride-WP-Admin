import React from 'react';
import { FileText, Calendar, User, Newspaper } from 'lucide-react';
import type { ClubNewsItem } from '../../types/clubTypes';
import { SafeImage } from '@/Components/common/SafeImage';
import { UserAvatar } from '@/Components/common/UserAvatar';

interface ClubNewsTabProps {
  news: ClubNewsItem[];
}

export const ClubNewsTab: React.FC<ClubNewsTabProps> = ({ news }) => {
  if (news.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[320px] bg-surface border border-border border-dashed rounded-3xl p-8 text-center mt-6 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
          <Newspaper size={32} />
        </div>
        <h3 className="font-poppins font-bold text-lg text-text-main mb-1">No News Available</h3>
        <p className="text-text-muted font-roboto text-sm max-w-sm">
          No club announcements, race recaps, or community updates have been posted yet.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500 pb-12 mt-6">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-xl font-poppins font-bold text-text-main flex items-center gap-2.5">
            Club News & Updates
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent/10 text-accent border border-accent/20">
              {news.length}
            </span>
          </h3>
          <p className="text-sm font-roboto text-text-muted mt-0.5">
            Latest announcements broadcasted to club athletes and followers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item, index) => {
          const image = item.image || item.imageUrl || null;
          const authorName = item.author?.fullName || item.authorName || 'Club Admin';
          const authorAvatar = item.author?.profileImage || null;
          const content = item.content || item.description || '';

          let formattedDate = 'Recent';
          if (item.createdAt) {
            try {
              formattedDate = new Date(item.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
            } catch {
              formattedDate = item.createdAt;
            }
          }

          return (
            <div
              key={item.id || index}
              className="bg-surface rounded-3xl border border-border overflow-hidden hover:border-accent/40 transition-all flex flex-col shadow-sm group"
            >
              {image ? (
                <div className="h-48 w-full overflow-hidden bg-main-bg relative">
                  <SafeImage
                    src={image}
                    alt={item.title || 'News post'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    fallback={
                      <div className="w-full h-full flex items-center justify-center bg-accent/5 text-accent/30">
                        <FileText size={36} />
                      </div>
                    }
                  />
                </div>
              ) : (
                <div className="h-28 w-full bg-gradient-to-br from-accent/10 via-surface to-surface flex items-center justify-center border-b border-border">
                  <FileText size={32} className="text-accent/40" />
                </div>
              )}

              <div className="p-6 flex flex-col flex-1">
                <h4 className="font-poppins font-bold text-base text-text-main group-hover:text-accent transition-colors line-clamp-2 mb-2">
                  {item.title || 'Club Announcement'}
                </h4>

                {content && (
                  <p className="font-roboto text-xs text-text-muted line-clamp-3 mb-4 leading-relaxed flex-1">
                    {content}
                  </p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                  <div className="flex items-center gap-2">
                    <UserAvatar src={authorAvatar} name={authorName} size="xs" />
                    <span className="font-roboto font-semibold text-xs text-text-main truncate max-w-[120px]">
                      {authorName}
                    </span>
                  </div>

                  <span className="font-roboto text-[11px] text-text-muted flex items-center gap-1">
                    <Calendar size={12} className="text-accent" />
                    {formattedDate}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
