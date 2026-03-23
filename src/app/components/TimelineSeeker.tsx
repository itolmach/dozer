import { useState, useRef } from 'react';
import { Play, Pause, Bookmark, Tag, StickyNote, SkipBack, SkipForward, Clock } from 'lucide-react';

interface TimelineBookmark {
  id: string;
  time: number;
  label?: string;
  note?: string;
  tags?: string[];
}

interface TimelineSeekerProps {
  duration: number;
  currentTime: number;
  onSeek: (time: number) => void;
  onPlayPause: () => void;
  isPlaying: boolean;
  bookmarks?: TimelineBookmark[];
  onAddBookmark?: (time: number) => void;
  onUpdateBookmark?: (id: string, data: Partial<TimelineBookmark>) => void;
}

export function TimelineSeeker({
  duration,
  currentTime,
  onSeek,
  onPlayPause,
  isPlaying,
  bookmarks = [],
  onAddBookmark,
  onUpdateBookmark,
}: TimelineSeekerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [selectedBookmark, setSelectedBookmark] = useState<TimelineBookmark | null>(null);
  const [bookmarkLabel, setBookmarkLabel] = useState('');
  const [bookmarkNote, setBookmarkNote] = useState('');
  const [bookmarkTags, setBookmarkTags] = useState('');
  const timelineRef = useRef<HTMLDivElement>(null);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    onSeek(Math.max(0, Math.min(duration, newTime)));
  };

  const handleAddBookmark = () => {
    if (onAddBookmark) {
      onAddBookmark(currentTime);
      setShowBookmarkModal(true);
      setSelectedBookmark({
        id: `bookmark-${Date.now()}`,
        time: currentTime,
      });
      setBookmarkLabel('');
      setBookmarkNote('');
      setBookmarkTags('');
    }
  };

  const handleSaveBookmark = () => {
    if (selectedBookmark && onUpdateBookmark) {
      onUpdateBookmark(selectedBookmark.id, {
        label: bookmarkLabel || undefined,
        note: bookmarkNote || undefined,
        tags: bookmarkTags ? bookmarkTags.split(',').map(t => t.trim()) : undefined,
      });
    }
    setShowBookmarkModal(false);
    setSelectedBookmark(null);
  };

  const handleSkip = (seconds: number) => {
    onSeek(Math.max(0, Math.min(duration, currentTime + seconds)));
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-card border-t-2 border-border">
      {/* Bookmark Modal */}
      {showBookmarkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border-2 border-border rounded-[var(--radius-card)] p-8 max-w-md w-full mx-4 shadow-[var(--elevation-lg)]">
            <h3 className="text-foreground mb-6">Add Bookmark Details</h3>
            
            <div className="space-y-6">
              {/* Label Input */}
              <div>
                <label className="block font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                  Label (Optional)
                </label>
                <input
                  type="text"
                  value={bookmarkLabel}
                  onChange={(e) => setBookmarkLabel(e.target.value)}
                  placeholder="e.g., Safety incident"
                  className="w-full px-4 py-3 bg-background border-2 border-border rounded-[var(--radius-button)] font-[family-name:var(--font-family)] text-foreground focus:outline-none focus:border-foreground"
                  style={{ fontSize: 'var(--text-base)', minHeight: '60px' }}
                />
              </div>

              {/* Note Input */}
              <div>
                <label className="block font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                  Note (Optional)
                </label>
                <textarea
                  value={bookmarkNote}
                  onChange={(e) => setBookmarkNote(e.target.value)}
                  placeholder="Add detailed notes..."
                  rows={4}
                  className="w-full px-4 py-3 bg-background border-2 border-border rounded-[var(--radius-button)] font-[family-name:var(--font-family)] text-foreground focus:outline-none focus:border-foreground resize-none"
                  style={{ fontSize: 'var(--text-base)' }}
                />
              </div>

              {/* Tags Input */}
              <div>
                <label className="block font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                  Tags (Optional, comma-separated)
                </label>
                <input
                  type="text"
                  value={bookmarkTags}
                  onChange={(e) => setBookmarkTags(e.target.value)}
                  placeholder="e.g., safety, proximity, operator"
                  className="w-full px-4 py-3 bg-background border-2 border-border rounded-[var(--radius-button)] font-[family-name:var(--font-family)] text-foreground focus:outline-none focus:border-foreground"
                  style={{ fontSize: 'var(--text-base)', minHeight: '60px' }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowBookmarkModal(false)}
                className="flex-1 min-h-[60px] px-6 rounded-[var(--radius-button)] border-2 border-border hover:bg-accent transition-colors font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground"
                style={{ fontSize: 'var(--text-base)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBookmark}
                className="flex-1 min-h-[60px] px-6 rounded-[var(--radius-button)] bg-foreground text-background hover:bg-foreground/90 transition-colors font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]"
                style={{ fontSize: 'var(--text-base)' }}
              >
                Save Bookmark
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Timeline Controls */}
      <div className="px-8 py-6">
        {/* Timeline Bar */}
        <div className="mb-6">
          <div
            ref={timelineRef}
            onClick={handleTimelineClick}
            className="relative h-[60px] bg-muted rounded-[var(--radius-button)] cursor-pointer border-2 border-border hover:border-foreground/30 transition-colors"
          >
            {/* Progress Fill */}
            <div
              className="absolute inset-y-0 left-0 bg-foreground/20 rounded-l-[var(--radius-button)]"
              style={{ width: `${progress}%` }}
            ></div>

            {/* Bookmarks on Timeline */}
            {bookmarks.map((bookmark) => {
              const bookmarkPos = (bookmark.time / duration) * 100;
              return (
                <div
                  key={bookmark.id}
                  className="absolute top-0 bottom-0 w-1 bg-foreground cursor-pointer group"
                  style={{ left: `${bookmarkPos}%` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSeek(bookmark.time);
                  }}
                >
                  {/* Bookmark Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-foreground text-background px-3 py-2 rounded whitespace-nowrap" style={{ fontSize: 'var(--text-sm)' }}>
                      <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]">
                        {bookmark.label || 'Bookmark'}
                      </div>
                      <div className="font-[family-name:var(--font-family)]">
                        {formatTime(bookmark.time)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Playhead */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-foreground"
              style={{ left: `${progress}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-foreground rounded-full border-4 border-background shadow-lg"></div>
            </div>
          </div>

          {/* Time Labels */}
          <div className="flex justify-between mt-2 px-2">
            <span className="font-[family-name:var(--font-family)] text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
              {formatTime(currentTime)}
            </span>
            <span className="font-[family-name:var(--font-family)] text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          {/* Playback Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSkip(-10)}
              className="min-w-[60px] min-h-[60px] flex items-center justify-center rounded-[var(--radius-button)] border-2 border-border hover:bg-accent transition-colors"
              aria-label="Skip back 10 seconds"
            >
              <SkipBack className="w-5 h-5 text-foreground" />
            </button>

            <button
              onClick={onPlayPause}
              className="min-w-[80px] min-h-[60px] flex items-center justify-center rounded-[var(--radius-button)] bg-foreground text-background hover:bg-foreground/90 transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" fill="currentColor" />
              ) : (
                <Play className="w-6 h-6" fill="currentColor" />
              )}
            </button>

            <button
              onClick={() => handleSkip(10)}
              className="min-w-[60px] min-h-[60px] flex items-center justify-center rounded-[var(--radius-button)] border-2 border-border hover:bg-accent transition-colors"
              aria-label="Skip forward 10 seconds"
            >
              <SkipForward className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Annotation Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleAddBookmark}
              className="min-w-[60px] min-h-[60px] flex items-center gap-3 px-6 rounded-[var(--radius-button)] border-2 border-border hover:bg-accent transition-colors"
              aria-label="Add bookmark"
            >
              <Bookmark className="w-5 h-5 text-foreground" />
              <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                Bookmark
              </span>
            </button>

            <div className="px-4 py-3 bg-muted rounded-[var(--radius-button)] border-2 border-border flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                {bookmarks.length} Bookmark{bookmarks.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
