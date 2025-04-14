import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  FiTrash2,
  FiDownload,
  FiEye,
  FiUpload,
  FiLock,
  FiUnlock,
  FiSearch,
} from "react-icons/fi";
import { useDropzone } from "react-dropzone";
import API from "../../services/Api";
import Loading from "../common/Loading";

const DocumentViewerModal = ({ show, doc, onClose, password = "" }) => {
  if (!show || !doc) return null;

  const getDocumentUrl = () => {
    const baseUrl = `${API.defaults.baseURL}api/documents/${
      doc._id
    }/view?email=${encodeURIComponent(doc.userId)}`;
    return password
      ? `${baseUrl}&password=${encodeURIComponent(password)}`
      : baseUrl;
  };

  const renderContent = () => {
    if (doc.mimetype.includes("pdf")) {
      return (
        <iframe
          src={getDocumentUrl()}
          type="application/pdf"
          width="100%"
          height="500px"
          title={doc.originalname}
        />
      );
    } else if (doc.mimetype.includes("image")) {
      return (
        <img
          src={getDocumentUrl()}
          alt={doc.originalname}
          className="max-w-full max-h-[80vh]"
        />
      );
    } else if (
      doc.mimetype.includes("word") ||
      doc.mimetype.includes("document")
    ) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">
            Word documents can't be previewed. Please download to view.
          </p>
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">
            This file type cannot be previewed. Please download to view.
          </p>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-medium">{doc.originalname}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-4 overflow-auto max-h-[80vh]">{renderContent()}</div>
      </div>
    </div>
  );
};

const DocumentTable = ({
  documents,
  onDelete,
  onView,
  onDownload,
  onToggleProtect,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handleDeleteClick = (id) => {
    onDelete(id);
  };
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Filename
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Size
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Uploaded
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Protected
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {documents.map((doc) => (
            <tr key={doc._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {doc.originalname}
                </div>
                <div className="text-sm text-gray-500">
                  {doc.tags?.join(", ")}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {doc.mimetype}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {(doc.size / 1024).toFixed(2)} KB
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(doc.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  onClick={() => onToggleProtect(doc._id, !doc.protected)}
                  className="text-gray-600 hover:text-blue-600"
                  title={
                    doc.protected ? "Unprotect document" : "Protect document"
                  }
                >
                  {doc.protected ? <FiLock /> : <FiUnlock />}
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-3">
                  <button
                    onClick={() => onView(doc)}
                    className="text-blue-600 hover:text-blue-900"
                    title="View document"
                  >
                    <FiEye />
                  </button>
                  <button
                    onClick={() => onDownload(doc._id)}
                    className="text-green-600 hover:text-green-900"
                    title="Download document"
                  >
                    <FiDownload />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(doc._id)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete document"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * 10 + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(
                    currentPage * 10,
                    documents.length + (currentPage - 1) * 10
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium">
                  {documents.length + (currentPage - 1) * 10}
                </span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => onPageChange(1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">First</span>
                  &laquo;
                </button>
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  &lsaquo;
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => onPageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === page
                          ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  &rsaquo;
                </button>
                <button
                  onClick={() => onPageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Last</span>
                  &raquo;
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FileUpload = ({ onUpload }) => {
  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      accept: {
        "application/pdf": [".pdf"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          [".docx"],
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
      },
      maxFiles: 5,
      onDrop: (acceptedFiles) => onUpload(acceptedFiles),
    });

  useEffect(() => {
    if (fileRejections.length > 0) {
      const rejectedNames = fileRejections.map((f) => f.file.name).join(", ");
      alert(
        `Unsupported file(s): ${rejectedNames}. Allowed: PDF, DOCX, JPG, PNG`
      );
    }
  }, [fileRejections]);

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
        isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
    >
      <input {...getInputProps()} />
      <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        {isDragActive
          ? "Drop the files here"
          : "Drag & drop files here, or click to select files"}
      </p>
      <p className="mt-1 text-xs text-gray-500">
        PDF, DOCX, JPG, PNG up to 10MB
      </p>
    </div>
  );
};

const PasswordModal = ({ show, doc, onClose, action, onVerified }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!password) {
      setError("Password is required");
      return;
    }

    setIsLoading(true);
    try {
      const response = await API.post(`api/documents/${doc._id}/verify`, {
        email: doc.userId,
        password,
      });

      if (response.data.valid) {
        onVerified(password);
        onClose();
      } else {
        setError("Incorrect password");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Verification failed");
    } finally {
      setPassword("");
      setIsLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-lg font-medium mb-4">
          Enter Password for {doc.originalname}
        </h3>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          className="w-full p-2 border rounded mb-2"
          placeholder="Document password"
          autoFocus
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ManageDocs = () => {
  const { user } = useAuth0();
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewerModal, setViewerModal] = useState({
    show: false,
    doc: null,
    password: "",
  });
  const [passwordModal, setPasswordModal] = useState({
    show: false,
    doc: null,
    action: "",
  });
  const [protectModal, setProtectModal] = useState({
    show: false,
    docId: null,
    protect: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const docsPerPage = 10;

  useEffect(() => {
    if (user?.email) {
      fetchDocuments();
    }
  }, [user?.email]);

  useEffect(() => {
    const filtered = documents.filter(
      (doc) =>
        doc.originalname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.tags &&
          doc.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          ))
    );
    setFilteredDocuments(filtered);
    setCurrentPage(1);
  }, [searchTerm, documents]);

  const fetchDocuments = async () => {
    try {
      const response = await API.get("api/documents", {
        params: { email: user.email },
      });
      setDocuments(response.data);
      setFilteredDocuments(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const indexOfLastDoc = currentPage * docsPerPage;
  const indexOfFirstDoc = indexOfLastDoc - docsPerPage;
  const currentDocs = filteredDocuments.slice(indexOfFirstDoc, indexOfLastDoc);
  const totalPages = Math.ceil(filteredDocuments.length / docsPerPage);

  const handleDelete = async (id) => {
    try {
      const doc = documents.find((d) => d._id === id);

      const deleteDocument = async () => {
        await API.delete(`api/documents/${id}`, {
          params: { email: user.email },
        });
        setDocuments(documents.filter((doc) => doc._id !== id));
      };

      if (doc.protected) {
        setPasswordModal({
          show: true,
          doc,
          action: "delete",
          onVerified: deleteDocument,
        });
      } else {
        if (window.confirm("Are you sure you want to delete this document?")) {
          await deleteDocument();
        }
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete document");
    }
  };

  const onView = async (doc) => {
    try {
      if (doc.protected) {
        setPasswordModal({
          show: true,
          doc,
          action: "view",
          onVerified: (password) => {
            setViewerModal({ show: true, doc, password });
          },
        });
        return;
      }
      setViewerModal({ show: true, doc, password: "" });
    } catch (error) {
      console.error("View error:", error);
      alert("Failed to open document");
    }
  };

  const onDownload = async (id) => {
    try {
      const doc = documents.find((d) => d._id === id);
      if (doc?.protected) {
        setPasswordModal({
          show: true,
          doc,
          action: "download",
          onVerified: (password) => {
            window.open(
              `${
                API.defaults.baseURL
              }api/documents/${id}/download?email=${encodeURIComponent(
                user.email
              )}&password=${encodeURIComponent(password)}`,
              "_blank"
            );
          },
        });
        return;
      }
      window.open(
        `${
          API.defaults.baseURL
        }api/documents/${id}/download?email=${encodeURIComponent(user.email)}`,
        "_blank"
      );
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download document");
    }
  };

  const toggleDocumentProtection = async (id, protect) => {
    try {
      const doc = documents.find((d) => d._id === id);

      if (protect) {
        setProtectModal({
          show: true,
          docId: id,
          protect: true,
          currentProtected: doc.protected,
        });
      } else {
        // For unprotecting, show password modal first
        setPasswordModal({
          show: true,
          doc,
          action: "unprotect",
          onVerified: async () => {
            const response = await API.patch(`api/documents/${id}/protect`, {
              email: user.email,
              protect: false,
            });

            setDocuments(
              documents.map((doc) =>
                doc._id === id ? { ...doc, protected: false } : doc
              )
            );
          },
        });
      }
    } catch (error) {
      console.error("Protection toggle failed:", error);
      alert("Failed to update document protection");
    }
  };

  const handleSetPassword = async (password) => {
    try {
      const response = await API.patch(
        `api/documents/${protectModal.docId}/protect`,
        {
          email: user.email,
          protect: protectModal.protect,
          password,
        }
      );

      setDocuments(
        documents.map((doc) =>
          doc._id === protectModal.docId ? response.data : doc
        )
      );
      setProtectModal({ show: false, docId: null, protect: false });
    } catch (error) {
      console.error("Password set failed:", error);
      alert("Failed to set document password");
    }
  };

  const handleUpload = async (files) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("documents", file);
      });
      formData.append("email", user.email);

      // Get AI-generated tags
      const tagsResponse = await API.post("api/documents/tag-documents", {
        filenames: files.map((f) => f.name),
      });

      // Apply tags to each file
      files.forEach((file, index) => {
        formData.append(
          `tags[${index}]`,
          JSON.stringify(tagsResponse.data[index])
        );
      });

      const response = await API.post("api/documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setDocuments([...documents, ...response.data]);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload documents");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6 p-4">
      <DocumentViewerModal
        show={viewerModal.show}
        doc={viewerModal.doc}
        password={viewerModal.password}
        onClose={() => setViewerModal({ show: false, doc: null, password: "" })}
      />
      <h1 className="text-2xl font-bold">Document Manager</h1>

      <FileUpload onUpload={handleUpload} />

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search documents..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        {isLoading ? (
          <Loading />
        ) : currentDocs.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchTerm
              ? "No documents match your search."
              : "No documents found. Upload some files to get started."}
          </div>
        ) : (
          <DocumentTable
            documents={currentDocs}
            onDelete={handleDelete}
            onView={onView}
            onDownload={onDownload}
            onToggleProtect={toggleDocumentProtection}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <PasswordModal
        show={passwordModal.show}
        doc={passwordModal.doc}
        action={passwordModal.action}
        onClose={() => setPasswordModal({ show: false, doc: null })}
        onVerified={passwordModal.onVerified}
      />

      {protectModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-medium mb-4">
              {protectModal.currentProtected
                ? "Change Document Password"
                : "Set Document Password"}
            </h3>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full p-2 border rounded mb-4"
              id="passwordInput"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() =>
                  setProtectModal({ show: false, docId: null, protect: false })
                }
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const password =
                    document.getElementById("passwordInput").value;
                  if (!password) {
                    alert("Password cannot be empty");
                    return;
                  }
                  try {
                    const response = await API.patch(
                      `api/documents/${protectModal.docId}/protect`,
                      {
                        email: user.email,
                        protect: protectModal.protect,
                        password: password, // Make sure to include the password
                      }
                    );

                    setDocuments(
                      documents.map((doc) =>
                        doc._id === protectModal.docId ? response.data : doc
                      )
                    );
                    setProtectModal({
                      show: false,
                      docId: null,
                      protect: false,
                    });
                  } catch (error) {
                    console.error("Password set failed:", error);
                    alert(
                      error.response?.data?.error ||
                        "Failed to set document password"
                    );
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {protectModal.currentProtected ? "Update" : "Protect"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDocs;
