import React from 'react';
import { 
  FileText, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Film, 
  Image as ImageIcon 
} from 'lucide-react';
import { formatBytes } from '../lib/utils';

export const FileList: React.FC<{
  files: File[];
  onRemove: (index: number) => void;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
  onClearAll: () => void;
  showOrderControls?: boolean;
}> = ({
  files,
  onRemove,
  onMoveUp,
  onMoveDown,
  onClearAll,
  showOrderControls = false,
}) => {
  if (files.length === 0) return null;

  const getIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FileText className="w-4 h-4 text-black" />;
    if (ext === 'mp4') return <Film className="w-4 h-4 text-black" />;
    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) {
      return <ImageIcon className="w-4 h-4 text-black" />;
    }
    return <FileText className="w-4 h-4 text-black" />;
  };

  const totalBytes = files.reduce((acc, f) => acc + f.size, 0);

  return (
    <div className="w-full bg-white border border-neutral-200 rounded-xl p-5">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-3">
        <div>
          <h4 className="font-semibold text-black text-xs uppercase tracking-wider">
            Selected Files ({files.length})
          </h4>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            Total size: {formatBytes(totalBytes)}
          </p>
        </div>
        <button
          onClick={onClearAll}
          className="text-xs text-neutral-600 hover:text-black font-medium px-2 py-1 transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {files.map((file, idx) => (
          <div
            key={`${file.name}-${idx}`}
            className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 bg-white hover:border-black transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0 pr-3">
              <div className="w-8 h-8 rounded border border-neutral-200 flex items-center justify-center flex-shrink-0 bg-neutral-50">
                {getIcon(file.name)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-black truncate">
                  {file.name}
                </p>
                <p className="text-[11px] text-neutral-500">
                  {formatBytes(file.size)}
                  {showOrderControls && ` • #${idx + 1}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              {showOrderControls && (
                <>
                  <button
                    disabled={idx === 0}
                    onClick={() => onMoveUp && onMoveUp(idx)}
                    title="Move up"
                    className="p-1 text-neutral-400 hover:text-black disabled:opacity-20 transition-colors"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    disabled={idx === files.length - 1}
                    onClick={() => onMoveDown && onMoveDown(idx)}
                    title="Move down"
                    className="p-1 text-neutral-400 hover:text-black disabled:opacity-20 transition-colors"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </>
              )}

              <button
                onClick={() => onRemove(idx)}
                title="Remove file"
                className="p-1 text-neutral-400 hover:text-black transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
