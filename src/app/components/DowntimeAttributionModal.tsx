import { useState } from 'react';
import { 
  Clock, 
  FileText, 
  Search,
  TrendingUp,
  X,
  ChevronRight,
  DollarSign,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface IdleTimeSegment {
  id: string;
  startTime: string;
  endTime: string;
  duration: number; // minutes
  attributed: boolean;
  taskCode?: string;
  taskName?: string;
}

interface TaskCode {
  code: string;
  name: string;
  category: 'SPECIFIC_TASK' | 'PROJECT_OVERHEAD';
  description: string;
  costRate: number; // dollars per hour
  recentlyUsed?: boolean;
}

interface DowntimeAttributionModalProps {
  segment: IdleTimeSegment;
  onComplete: (taskCode: string, taskName: string, isOverhead: boolean) => void;
  onCancel: () => void;
}

export function DowntimeAttributionModal({ segment, onComplete, onCancel }: DowntimeAttributionModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<TaskCode | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Mock task codes
  const taskCodes: TaskCode[] = [
    {
      code: 'CC-4200',
      name: 'Rock Blasting Delay',
      category: 'SPECIFIC_TASK',
      description: 'Mandatory safety clearance during blasting operations',
      costRate: 285,
      recentlyUsed: true
    },
    {
      code: 'CC-1150',
      name: 'Mass Earthwork - Excavation',
      category: 'SPECIFIC_TASK',
      description: 'Primary excavation and grading activities',
      costRate: 320,
      recentlyUsed: true
    },
    {
      code: 'CC-8800',
      name: 'Weather Delay',
      category: 'SPECIFIC_TASK',
      description: 'Operations halted due to adverse weather conditions',
      costRate: 275
    },
    {
      code: 'CC-9100',
      name: 'Equipment Staging',
      category: 'SPECIFIC_TASK',
      description: 'Repositioning assets between work zones',
      costRate: 180
    },
    {
      code: 'CC-6300',
      name: 'Utility Conflict Resolution',
      category: 'SPECIFIC_TASK',
      description: 'Work stoppage for utility relocation or verification',
      costRate: 340
    },
    {
      code: 'OVERHEAD-GEN',
      name: 'General Project Overhead',
      category: 'PROJECT_OVERHEAD',
      description: 'Non-specific idle time allocated to general project overhead',
      costRate: 150,
      recentlyUsed: false
    },
    {
      code: 'OVERHEAD-WAIT',
      name: 'Waiting on Materials',
      category: 'PROJECT_OVERHEAD',
      description: 'Idle time due to material delivery delays',
      costRate: 200
    },
    {
      code: 'OVERHEAD-COORD',
      name: 'Coordination Delay',
      category: 'PROJECT_OVERHEAD',
      description: 'Delays due to cross-team coordination requirements',
      costRate: 165
    }
  ];

  const filteredTasks = taskCodes.filter(task => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      task.code.toLowerCase().includes(query) ||
      task.name.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query)
    );
  });

  const recentlyUsedTasks = filteredTasks.filter(task => task.recentlyUsed);
  const specificTasks = filteredTasks.filter(task => task.category === 'SPECIFIC_TASK' && !task.recentlyUsed);
  const overheadTasks = filteredTasks.filter(task => task.category === 'PROJECT_OVERHEAD');

  const handleSelectTask = (task: TaskCode) => {
    setSelectedTask(task);
  };

  const handleConfirmAttribution = () => {
    if (selectedTask) {
      setShowConfirmation(true);
      setTimeout(() => {
        onComplete(
          selectedTask.code,
          selectedTask.name,
          selectedTask.category === 'PROJECT_OVERHEAD'
        );
      }, 1200);
    }
  };

  const calculateCost = () => {
    if (!selectedTask) return 0;
    const hours = segment.duration / 60;
    return Math.round(hours * selectedTask.costRate);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (showConfirmation) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9998]">
        <div className="bg-card rounded-[var(--radius-card)] border-4 border-color-success shadow-[var(--elevation-xl)] p-12 max-w-2xl mx-8 text-center">
          <div className="w-32 h-32 rounded-full bg-color-success/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-20 h-20 text-color-success" />
          </div>
          <h2 className="font-[family-name:var(--font-family)] font-[var(--font-weight-bold)] text-foreground mb-4" style={{ fontSize: 'var(--text-3xl)' }}>
            Attribution Complete
          </h2>
          <p className="font-[family-name:var(--font-family)] text-foreground mb-6" style={{ fontSize: 'var(--text-lg)' }}>
            Idle time successfully assigned to cost code
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-3 text-foreground">
              <div className="w-3 h-3 rounded-full bg-color-success animate-pulse"></div>
              <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
                {selectedTask?.code}: {selectedTask?.name}
              </span>
            </div>
            <div className="flex items-center justify-center gap-3 text-foreground">
              <div className="w-3 h-3 rounded-full bg-color-success animate-pulse"></div>
              <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
                Duration: {formatDuration(segment.duration)}
              </span>
            </div>
            <div className="flex items-center justify-center gap-3 text-foreground">
              <div className="w-3 h-3 rounded-full bg-color-success animate-pulse"></div>
              <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
                Cost Impact: ${calculateCost().toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9998]">
      <div className="bg-card rounded-[var(--radius-card)] border-4 border-border shadow-[var(--elevation-xl)] max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col m-8">
        {/* Header */}
        <div className="bg-primary px-8 py-6 border-b-4 border-primary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="min-w-[70px] min-h-[70px] rounded-full bg-white/20 flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="font-[family-name:var(--font-family)] font-[var(--font-weight-bold)] text-white mb-2" style={{ fontSize: 'var(--text-2xl)' }}>
                  Downtime Cost Attribution
                </h2>
                <p className="font-[family-name:var(--font-family)] text-white/90" style={{ fontSize: 'var(--text-base)' }}>
                  Assign idle time to specific task or project overhead
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="min-w-[60px] min-h-[60px] rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Idle Time Summary */}
        <div className="px-8 py-6 bg-muted/50 border-b-2 border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <div className="text-muted-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] mb-1" style={{ fontSize: 'var(--text-sm)' }}>
                  Idle Period
                </div>
                <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-xl)' }}>
                  {segment.startTime} - {segment.endTime}
                </div>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div>
                <div className="text-muted-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] mb-1" style={{ fontSize: 'var(--text-sm)' }}>
                  Duration
                </div>
                <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-xl)' }}>
                  {formatDuration(segment.duration)}
                </div>
              </div>
            </div>
            {selectedTask && (
              <div className="text-right">
                <div className="text-muted-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] mb-1" style={{ fontSize: 'var(--text-sm)' }}>
                  Estimated Cost Impact
                </div>
                <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-bold)] text-foreground" style={{ fontSize: 'var(--text-2xl)' }}>
                  ${calculateCost().toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by code, name, or description..."
                  className="w-full min-h-[70px] pl-14 pr-6 bg-muted rounded-[var(--radius-button)] border-4 border-border focus:border-primary focus:outline-none font-[family-name:var(--font-family)] text-foreground placeholder:text-muted-foreground"
                  style={{ fontSize: 'var(--text-lg)' }}
                />
              </div>
            </div>

            {/* Warning Banner */}
            <div className="mb-6 p-4 bg-color-warning/10 rounded-[var(--radius-card)] border-2 border-color-warning">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-color-warning flex-shrink-0" />
                <p className="text-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                  <span className="font-[var(--font-weight-semibold)]">Project Controller Action Required:</span> Unattributed idle time distorts cost tracking and affects future bid accuracy. Assign to the most accurate cost code.
                </p>
              </div>
            </div>

            {/* Recently Used */}
            {recentlyUsedTasks.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-foreground" />
                  <h3 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                    Recently Used
                  </h3>
                </div>
                <div className="space-y-2">
                  {recentlyUsedTasks.map(task => (
                    <button
                      key={task.code}
                      onClick={() => handleSelectTask(task)}
                      className={`w-full min-h-[80px] p-4 rounded-[var(--radius-card)] border-4 transition-all text-left ${
                        selectedTask?.code === task.code
                          ? 'bg-primary/10 border-primary'
                          : 'bg-background border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-bold)] text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
                              {task.code}
                            </div>
                            <div className="px-2 py-1 bg-primary/20 rounded-full">
                              <span className="text-primary font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-xs)' }}>
                                RECENT
                              </span>
                            </div>
                          </div>
                          <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-1" style={{ fontSize: 'var(--text-base)' }}>
                            {task.name}
                          </div>
                          <div className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                            {task.description}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 ml-6">
                          <div className="text-right">
                            <div className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                              Rate
                            </div>
                            <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                              ${task.costRate}/hr
                            </div>
                          </div>
                          <ChevronRight className={`w-6 h-6 ${selectedTask?.code === task.code ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Specific Tasks */}
            {specificTasks.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-foreground" />
                  <h3 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                    Specific Task Codes
                  </h3>
                </div>
                <div className="space-y-2">
                  {specificTasks.map(task => (
                    <button
                      key={task.code}
                      onClick={() => handleSelectTask(task)}
                      className={`w-full min-h-[80px] p-4 rounded-[var(--radius-card)] border-4 transition-all text-left ${
                        selectedTask?.code === task.code
                          ? 'bg-primary/10 border-primary'
                          : 'bg-background border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-bold)] text-foreground mb-2" style={{ fontSize: 'var(--text-lg)' }}>
                            {task.code}
                          </div>
                          <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-1" style={{ fontSize: 'var(--text-base)' }}>
                            {task.name}
                          </div>
                          <div className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                            {task.description}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 ml-6">
                          <div className="text-right">
                            <div className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                              Rate
                            </div>
                            <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                              ${task.costRate}/hr
                            </div>
                          </div>
                          <ChevronRight className={`w-6 h-6 ${selectedTask?.code === task.code ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Project Overhead */}
            {overheadTasks.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-5 h-5 text-foreground" />
                  <h3 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                    Project Overhead
                  </h3>
                </div>
                <div className="space-y-2">
                  {overheadTasks.map(task => (
                    <button
                      key={task.code}
                      onClick={() => handleSelectTask(task)}
                      className={`w-full min-h-[80px] p-4 rounded-[var(--radius-card)] border-4 transition-all text-left ${
                        selectedTask?.code === task.code
                          ? 'bg-primary/10 border-primary'
                          : 'bg-muted/50 border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-bold)] text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
                              {task.code}
                            </div>
                            <div className="px-2 py-1 bg-muted rounded-full">
                              <span className="text-muted-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-xs)' }}>
                                OVERHEAD
                              </span>
                            </div>
                          </div>
                          <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-1" style={{ fontSize: 'var(--text-base)' }}>
                            {task.name}
                          </div>
                          <div className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                            {task.description}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 ml-6">
                          <div className="text-right">
                            <div className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                              Rate
                            </div>
                            <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                              ${task.costRate}/hr
                            </div>
                          </div>
                          <ChevronRight className={`w-6 h-6 ${selectedTask?.code === task.code ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-muted border-t-4 border-border px-8 py-6">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div>
              {selectedTask ? (
                <>
                  <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-bold)] text-foreground mb-1" style={{ fontSize: 'var(--text-lg)' }}>
                    {selectedTask.code}: {selectedTask.name}
                  </div>
                  <div className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                    Cost Impact: ${calculateCost().toLocaleString()} ({formatDuration(segment.duration)} @ ${selectedTask.costRate}/hr)
                  </div>
                </>
              ) : (
                <>
                  <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-1" style={{ fontSize: 'var(--text-lg)' }}>
                    Select a Cost Code
                  </div>
                  <div className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                    Choose the most accurate attribution for this idle time
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="min-w-[140px] min-h-[70px] px-6 rounded-[var(--radius-button)] bg-muted text-foreground hover:opacity-90 transition-opacity border-2 border-border"
              >
                <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
                  Cancel
                </span>
              </button>
              <button
                onClick={handleConfirmAttribution}
                disabled={!selectedTask}
                className="min-w-[220px] min-h-[70px] px-8 rounded-[var(--radius-button)] bg-primary text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                <CheckCircle className="w-6 h-6" />
                <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
                  Confirm Attribution
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
