import { useState } from 'react';
import { Upload, Image, Navigation, Map, CheckCircle, X, FileText, AlertTriangle } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  type: 'photo' | 'gps' | 'drone';
  size: string;
  uploadedAt: Date;
}

export function ProofOfWorkUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      id: '1',
      name: 'site_excavation_zone_b2_20260320.jpg',
      type: 'photo',
      size: '4.2 MB',
      uploadedAt: new Date()
    },
    {
      id: '2',
      name: 'gps_telemetry_log_march_15_20.csv',
      type: 'gps',
      size: '1.8 MB',
      uploadedAt: new Date()
    }
  ]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    // In real app, handle file upload here
    console.log('Files dropped:', e.dataTransfer.files);
    
    // Mock file addition
    const newFile: UploadedFile = {
      id: Date.now().toString(),
      name: e.dataTransfer.files[0]?.name || 'new_file.jpg',
      type: 'photo',
      size: '3.5 MB',
      uploadedAt: new Date()
    };
    setUploadedFiles([...uploadedFiles, newFile]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFile: UploadedFile = {
        id: Date.now().toString(),
        name: e.target.files[0].name,
        type: 'photo',
        size: '2.1 MB',
        uploadedAt: new Date()
      };
      setUploadedFiles([...uploadedFiles, newFile]);
    }
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== id));
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'photo':
        return <Image className="w-5 h-5 text-primary" />;
      case 'gps':
        return <Navigation className="w-5 h-5 text-primary" />;
      case 'drone':
        return <Map className="w-5 h-5 text-primary" />;
      default:
        return <FileText className="w-5 h-5 text-primary" />;
    }
  };

  const requiredDocuments = [
    { type: 'photo', label: 'Site Photos', description: 'Before/after excavation imagery', required: true, count: uploadedFiles.filter(f => f.type === 'photo').length },
    { type: 'gps', label: 'GPS Telemetry Logs', description: 'Machine positioning data export', required: true, count: uploadedFiles.filter(f => f.type === 'gps').length },
    { type: 'drone', label: 'Drone Orthomosaic Maps', description: 'Aerial survey volumetric data', required: false, count: uploadedFiles.filter(f => f.type === 'drone').length }
  ];

  const allRequiredUploaded = requiredDocuments
    .filter(d => d.required)
    .every(d => d.count > 0);

  return (
    <div className="mt-8 p-8 bg-muted/30 rounded-[var(--radius-card)] border-4 border-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="min-w-[70px] min-h-[70px] rounded-full bg-foreground/10 flex items-center justify-center">
            <Upload className="w-8 h-8 text-foreground" />
          </div>
          <div>
            <h4 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-1" style={{ fontSize: 'var(--text-xl)' }}>
              Proof of Work Artifacts
            </h4>
            <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
              Mandatory documentation for invoice verification
            </p>
          </div>
        </div>

        {allRequiredUploaded ? (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-color-success/10 border-2 border-color-success">
            <CheckCircle className="w-5 h-5 text-color-success" />
            <span className="text-color-success font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
              Complete
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-color-warning/10 border-2 border-color-warning">
            <AlertTriangle className="w-5 h-5 text-color-warning" />
            <span className="text-color-warning font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
              Missing Required
            </span>
          </div>
        )}
      </div>

      {/* Required Documents Checklist */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        {requiredDocuments.map(doc => (
          <div
            key={doc.type}
            className={`p-4 rounded-[var(--radius-card)] border-2 ${
              doc.required && doc.count === 0
                ? 'bg-color-warning/10 border-color-warning'
                : doc.count > 0
                ? 'bg-color-success/10 border-color-success'
                : 'bg-background border-border'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {doc.count > 0 ? (
                <CheckCircle className="w-5 h-5 text-color-success" />
              ) : doc.required ? (
                <AlertTriangle className="w-5 h-5 text-color-warning" />
              ) : (
                getFileIcon(doc.type)
              )}
              <span className={`font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] ${
                doc.count > 0 ? 'text-color-success' : doc.required ? 'text-color-warning' : 'text-foreground'
              }`} style={{ fontSize: 'var(--text-base)' }}>
                {doc.label}
                {doc.required && <span className="text-destructive ml-1">*</span>}
              </span>
            </div>
            <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-2" style={{ fontSize: 'var(--text-xs)' }}>
              {doc.description}
            </p>
            <div className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-sm)' }}>
              {doc.count} {doc.count === 1 ? 'file' : 'files'} uploaded
            </div>
          </div>
        ))}
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`mb-6 p-12 border-4 border-dashed rounded-[var(--radius-card)] transition-all ${
          isDragging
            ? 'bg-primary/10 border-primary'
            : 'bg-background border-border hover:border-primary/50'
        }`}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className={`min-w-[100px] min-h-[100px] rounded-full mb-6 flex items-center justify-center ${
            isDragging ? 'bg-primary/20' : 'bg-muted'
          }`}>
            <Upload className={`w-12 h-12 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          
          <h5 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-2" style={{ fontSize: 'var(--text-lg)' }}>
            {isDragging ? 'Drop files here' : 'Drag and drop files here'}
          </h5>
          
          <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-6" style={{ fontSize: 'var(--text-base)' }}>
            or click to browse
          </p>

          <input
            type="file"
            id="file-upload"
            multiple
            onChange={handleFileInput}
            className="hidden"
            accept="image/*,.pdf,.csv,.kml,.kmz"
          />
          
          <label htmlFor="file-upload">
            <div className="min-w-[200px] min-h-[60px] px-8 rounded-[var(--radius-button)] bg-primary text-white hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2">
              <Upload className="w-5 h-5" />
              <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
                Browse Files
              </span>
            </div>
          </label>

          <p className="text-muted-foreground font-[family-name:var(--font-family)] mt-4" style={{ fontSize: 'var(--text-xs)' }}>
            Supported formats: JPG, PNG, PDF, CSV, KML, KMZ (Max 50 MB per file)
          </p>
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h5 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-3" style={{ fontSize: 'var(--text-base)' }}>
            Uploaded Files ({uploadedFiles.length})
          </h5>
          
          {uploadedFiles.map(file => (
            <div
              key={file.id}
              className="flex items-center justify-between p-4 bg-background rounded-[var(--radius-card)] border-2 border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="min-w-[50px] min-h-[50px] rounded-full bg-primary/10 flex items-center justify-center">
                  {getFileIcon(file.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground truncate" style={{ fontSize: 'var(--text-base)' }}>
                    {file.name}
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground font-[family-name:var(--font-family)] mt-1" style={{ fontSize: 'var(--text-xs)' }}>
                    <span>{file.size}</span>
                    <span>•</span>
                    <span>Uploaded {file.uploadedAt.toLocaleTimeString()}</span>
                    <span>•</span>
                    <span className="capitalize">{file.type === 'gps' ? 'GPS Log' : file.type === 'drone' ? 'Drone Map' : 'Photo'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <div className="px-3 py-1 bg-color-success/10 rounded-full">
                  <span className="text-color-success font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-xs)' }}>
                    VERIFIED
                  </span>
                </div>
                
                <button
                  onClick={() => handleRemoveFile(file.id)}
                  className="min-w-[44px] min-h-[44px] rounded-full hover:bg-destructive/10 transition-colors flex items-center justify-center"
                  title="Remove file"
                >
                  <X className="w-5 h-5 text-destructive" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Help Text */}
      <div className="mt-6 p-4 bg-primary/10 rounded-[var(--radius-card)] border-2 border-primary/30">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h6 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-1" style={{ fontSize: 'var(--text-sm)' }}>
              Documentation Requirements
            </h6>
            <ul className="space-y-1 text-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
              <li>• <span className="font-[var(--font-weight-semibold)]">Site Photos:</span> Before/after images showing excavation progress and material stockpiles</li>
              <li>• <span className="font-[var(--font-weight-semibold)]">GPS Logs:</span> RTK positioning data exported from asset telematics system (CSV/KML format)</li>
              <li>• <span className="font-[var(--font-weight-semibold)]">Drone Maps:</span> Orthomosaic imagery with volumetric calculations (optional but recommended)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
