import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { formatSize } from '../lib/utils'

interface FileUploaderProps {
    onFileSelect?: (files: File[]) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setSelectedFiles(acceptedFiles);
        onFileSelect?.(acceptedFiles);
    }, [onFileSelect]);

    const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: true,
        accept: { 'application/pdf': ['.pdf'] },
        maxSize: maxFileSize,
    })

    const removeFile = (indexToRemove: number) => {
        const updatedFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
        setSelectedFiles(updatedFiles);
        onFileSelect?.(updatedFiles);
    }

    return (
        <div className="w-full gradient-border">
            <div {...getRootProps()}>
                <input {...getInputProps()} />

                <div className="space-y-4 cursor-pointer">
                    {selectedFiles.length > 0 ? (
                        <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                            {selectedFiles.map((file, index) => (
                                <div key={index} className="uploader-selected-file">
                                    <img src="/images/pdf.png" alt="pdf" className="size-10" />
                                    <div className="flex items-center space-x-3 flex-1">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                                                {file.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {formatSize(file.size)}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        className="p-2 cursor-pointer hover:bg-gray-100 rounded-full"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFile(index);
                                        }}
                                    >
                                        <img src="/icons/cross.svg" alt="remove" className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            <div className="text-center pt-2 text-sm text-gray-500">
                                Click or drag to add more files (updates selection)
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">
                                <img src="/icons/info.svg" alt="upload" className="size-20" />
                            </div>
                            <p className="text-lg text-gray-500">
                                <span className="font-semibold">
                                    Click to upload
                                </span> or drag and drop
                            </p>
                            <p className="text-lg text-gray-500">PDFs (max {formatSize(maxFileSize)})</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default FileUploader
