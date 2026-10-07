import React, { useRef, useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { formatBytes } from '../lib/utils';

interface FileUploaderProps {
  acceptedFormats: string[];
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
  onFilesSelected: (files: File[]) => void;
  title?: string;
  subtitle?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  acceptedFormats,
  multiple = false,
  maxFiles = 25,
  maxSizeMB = 500,
  onFilesSelected,
  title,
  subtitle,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndAddFiles = (fileList: FileList | null) => {
    setErrorMessage(null);
    if (!fileList || fileList.length === 0) return;

    const filesArray = Array.from(fileList);

    if (!multiple && filesArray.length > 1) {
      setErrorMessage('Please select only 1 file at a time.');
      return;
    }

    if (multiple && filesArray.length > maxFiles) {
      setErrorMessage(`Maximum ${maxFiles} files allowed at once.`);
      return;
    }

    const validFiles: File[] = [];

    for (const file of filesArray) {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      const isFormatAllowed = acceptedFormats.some((fmt) => fmt.toLowerCase() === ext);

      if (!isFormatAllowed) {
        setErrorMessage(
          `"${file.name}" has an unsupported format. Supported: ${acceptedFormats.join(', ')}`
        );
        return;
      }

      const sizeInMB = file.size / (1024 * 1024);
      if (sizeInMB > maxSizeMB) {
        setErrorMessage(
          `"${file.name}" (${formatBytes(file.size)}) exceeds the limit of ${maxSizeMB}MB.`
        );
        return;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    validateAndAddFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndAddFiles(e.target.files);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`group relative flex flex-col items-center justify-center p-10 sm:p-14 border border-dashed rounded-xl cursor-pointer transition-colors duration-150 select-none bg-white ${
          isDragOver
            ? 'border-black bg-neutral-50'
            : 'border-neutral-300 hover:border-black'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />

        <div className="w-12 h-12 rounded-lg border border-neutral-200 flex items-center justify-center mb-4 text-black group-hover:border-black transition-colors">
          <Upload className="w-5 h-5 text-black" strokeWidth={1.75} />
        </div>

        <h3 className="text-base font-semibold text-black mb-1 text-center">
          {title || (multiple ? 'Drop your files here' : 'Drop your file here')}
        </h3>

        <p className="text-xs text-neutral-500 text-center max-w-sm mb-5">
          {subtitle || `or click to browse from device (${acceptedFormats.join(', ')})`}
        </p>

        <button
          type="button"
          className="px-5 py-2.5 bg-black hover:bg-neutral-800 text-white font-medium text-xs tracking-wide rounded-md transition-colors"
        >
          Choose {multiple ? 'Files' : 'File'}
        </button>
      </div>

      {errorMessage && (
        <div className="mt-4 p-3.5 rounded-lg border border-neutral-300 bg-neutral-50 text-black text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-black mt-0.5" />
          <div>
            <p className="font-semibold text-black">Upload notice</p>
            <p className="text-neutral-600 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};
