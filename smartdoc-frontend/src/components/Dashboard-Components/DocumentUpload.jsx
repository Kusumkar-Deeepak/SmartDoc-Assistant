import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload, FiFile, FiX } from "react-icons/fi";
import "./InsightVisualizations.css";

const DocumentUpload = ({ onFileUpload, isLoading, progress }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles[0]);
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      accept: {
        "application/pdf": [".pdf"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          [".docx"],
        "text/plain": [".txt"],
        "image/*": [".png", ".jpg", ".jpeg"],
      },
      maxFiles: 1,
      disabled: isLoading,
    });

  const removeFile = () => {
    acceptedFiles.length = 0;
  };

  return (
    <div className="document-upload-container">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "active" : ""} ${
          isLoading ? "disabled" : ""
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <div className="dropzone-content">
            <FiUpload size={24} />
            <p>Drop the document here...</p>
          </div>
        ) : (
          <div className="dropzone-content">
            <FiUpload size={24} />
            <p>Drag & drop a document here, or click to select</p>
            <small>Supports: PDF, DOCX, TXT, Images</small>
          </div>
        )}
      </div>

      {acceptedFiles.length > 0 && (
        <div className="file-preview">
          <div className="file-info">
            <FiFile size={18} />
            <span>{acceptedFiles[0].name}</span>
            {!isLoading && (
              <button onClick={removeFile} className="remove-file-btn">
                <FiX size={16} />
              </button>
            )}
          </div>
          {isLoading && (
            <div className="upload-progress">
              <div
                className="progress-bar"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
