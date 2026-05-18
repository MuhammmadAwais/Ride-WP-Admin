import { type TargetSegment, type RecipientUser } from '../types';
import { X } from 'lucide-react';

interface CompositionPanelProps {
  title: string;
  setTitle: (v: string) => void;
  body: string;
  setBody: (v: string) => void;
  imageUrl: string;
  setImageUrl: (v: string) => void;
  targetSegment: TargetSegment;
  setTargetSegment: (v: TargetSegment) => void;
  selectedUsers: RecipientUser[];
  onRemoveUser: (id: string) => void;
  onOpenSelector: () => void;
  onSend: () => void;
}

export default function CompositionPanel(props: CompositionPanelProps) {
  return (
    <div className="w-full space-y-5 sm:space-y-6 animate-in fade-in duration-200">
      
      {/* Title */}
      <div className="flex flex-col gap-1.5 sm:gap-2">
        <label className="font-poppins font-bold text-text-muted text-[11px] sm:text-[12px] uppercase tracking-wider">
          Notification Title
        </label>
        <input 
          type="text" 
          value={props.title} 
          onChange={(e) => props.setTitle(e.target.value)} 
          placeholder="Enter a descriptive notification title..." 
          className="w-full h-12 bg-main-bg border border-border rounded-xl px-4 text-text-main font-roboto focus:outline-none focus:border-[#EB712B] transition-colors placeholder:text-text-muted/50 text-[14px]"
        />
      </div>

      {/* Body */}
      <div className="flex flex-col gap-1.5 sm:gap-2">
        <label className="font-poppins font-bold text-text-muted text-[11px] sm:text-[12px] uppercase tracking-wider">
          Notification Body
        </label>
        <textarea 
          value={props.body} 
          onChange={(e) => props.setBody(e.target.value)} 
          placeholder="Compose notification message contents..." 
          rows={5}
          className="w-full bg-main-bg border border-border rounded-xl px-4 py-3 text-text-main font-roboto resize-none focus:outline-none focus:border-[#EB712B] transition-colors placeholder:text-text-muted/50 text-[14px] leading-relaxed"
        />
      </div>

      {/* Send To Segmented Control */}
      <div className="flex flex-col gap-1.5 sm:gap-2">
        <label className="font-poppins font-bold text-text-muted text-[11px] sm:text-[12px] uppercase tracking-wider">
          Send To Recipient
        </label>
        <div className="grid grid-cols-2 bg-main-bg border border-border rounded-xl p-1 gap-1 h-12 items-center">
          <button 
            type="button"
            onClick={() => {
              props.setTargetSegment('All Users');
            }}
            className={`h-full rounded-lg font-poppins font-semibold text-[10px] sm:text-[11px] uppercase tracking-wider transition-colors ${props.targetSegment === 'All Users' ? 'bg-[#EB712B] text-white' : 'text-text-muted hover:text-text-main'}`}
          >
            All Users
          </button>
          <button 
            type="button"
            onClick={props.onOpenSelector}
            className={`h-full rounded-lg font-poppins font-semibold text-[10px] sm:text-[11px] uppercase tracking-wider transition-colors ${props.targetSegment === 'Specific Users' ? 'bg-[#EB712B] text-white' : 'text-text-muted hover:text-text-main'}`}
          >
            Specific Users
          </button>
        </div>

        {/* Selected Users Chips */}
        {props.targetSegment === 'Specific Users' && props.selectedUsers.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 bg-main-bg/30 border border-border p-3 rounded-xl max-h-[140px] overflow-y-auto custom-scrollbar">
            {props.selectedUsers.map(u => (
              <div key={u.id} className="bg-[#EB712B]/10 border border-[#EB712B]/20 text-[#EB712B] rounded-lg px-2.5 py-1 flex items-center gap-1.5 font-roboto text-[11px] font-bold uppercase tracking-wider flex-shrink-0">
                {u.username}
                <button 
                  onClick={(e) => { e.stopPropagation(); props.onRemoveUser(u.id); }} 
                  className="hover:text-red-400 transition-colors"
                >
                  <X size={11} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Optional Image URL */}
      <div className="flex flex-col gap-1.5 sm:gap-2">
        <label className="font-poppins font-bold text-text-muted text-[11px] sm:text-[12px] uppercase tracking-wider">
          Image URL (Optional)
        </label>
        <input 
          type="text" 
          value={props.imageUrl} 
          onChange={(e) => props.setImageUrl(e.target.value)} 
          placeholder="https://images.unsplash.com/your-image.jpg" 
          className="w-full h-12 bg-main-bg border border-border rounded-xl px-4 text-text-main font-roboto focus:outline-none focus:border-[#EB712B] transition-colors placeholder:text-text-muted/50 text-[14px]"
        />
      </div>

      {/* Action Footer */}
      <div className="pt-4 flex justify-end">
        <button 
          onClick={props.onSend}
          className="w-full sm:w-auto bg-[#EB712B] hover:bg-[#d66524] text-white font-poppins font-bold text-[11px] sm:text-[12px] uppercase tracking-widest py-3.5 px-10 rounded-xl transition-all shadow-sm cursor-pointer select-none"
        >
          Send Notification
        </button>
      </div>
    </div>
  );
}
