import { FiTrash2, FiDownload, FiEye } from "react-icons/fi";
import { useState } from "react";

const ManageDocs = () => {
  const [documents, setDocuments] = useState([
    { id: 1, name: "Annual_Report.pdf", type: "PDF", date: "2023-10-15", size: "2.4 MB" },
    { id: 2, name: "Meeting_Notes.docx", type: "DOCX", date: "2023-11-02", size: "1.1 MB" },
    { id: 3, name: "Scan001.jpg", type: "Image", date: "2023-11-10", size: "3.7 MB" },
  ]);

  const handleDelete = (id) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold">Manage Documents</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Document
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {doc.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {doc.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {doc.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {doc.size}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex space-x-2">
                  <button
                    title="View"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FiEye />
                  </button>
                  <button
                    title="Download"
                    className="text-green-600 hover:text-green-800"
                  >
                    <FiDownload />
                  </button>
                  <button
                    title="Delete"
                    onClick={() => handleDelete(doc.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageDocs;