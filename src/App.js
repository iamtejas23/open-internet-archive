import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  MusicalNoteIcon ,
} from '@heroicons/react/24/solid';
import { ClipLoader } from 'react-spinners'; // Install react-spinners


function MetadataFetcher() {
  const [metadata, setMetadata] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 10; // Number of files per page

  useEffect(() => {
    fetch("https://archive.org/metadata/principleofrelat00eins")
      .then((response) => response.json())
      .then((data) => setMetadata(data))
      .catch((error) => console.error('Error fetching metadata:', error));
  }, []);

  if (!metadata) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={50} color="#3498db" />
      </div>
    );
  }

  const filteredFiles = metadata.files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = filteredFiles.slice(indexOfFirstFile, indexOfLastFile);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getFileTypeIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    if (['pdf', 'txt', 'doc', 'docx'].includes(extension)) return <DocumentTextIcon className="w-5 h-5 text-green-500" />;
    if (['mp4', 'mov', 'avi'].includes(extension)) return <VideoCameraIcon className="w-5 h-5 text-red-500" />;
    if (['mp3', 'wav', 'ogg'].includes(extension)) return <MusicalNoteIcon  className="w-5 h-5 text-purple-500" />;
    return <ChevronRightIcon className="w-4 h-4" />;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">{metadata.metadata.title}</h1>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search files..."
            className="p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search files"
          />
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute right-3 top-3" />
        </div>
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <p className="text-lg"><strong>Creator:</strong> {metadata.metadata.creator}</p>
          <p className="text-lg"><strong>Year:</strong> {metadata.metadata.year}</p>
          <p className="text-lg"><strong>Publisher:</strong> {metadata.metadata.publisher}</p>
          <p className="text-lg"><strong>Language:</strong> {metadata.metadata.language}</p>
        </div>
        <p className="text-md mb-6"><strong>Description:</strong> {metadata.metadata.description}</p>

        <h3 className="text-xl font-semibold mb-4">Files</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentFiles.map((file, index) => (
            <li
              key={index}
              className="flex items-center space-x-2 transition duration-300 ease-in-out transform hover:scale-105"
            >
              {getFileTypeIcon(file.name)}
              <a
                href={`https://archive.org/download/${metadata.metadata.identifier}/${file.name}`}
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
                title={`Download ${file.name}`}
              >
                {file.name}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex justify-center mt-6">
          <nav aria-label="File Pagination" className="flex space-x-2">
            {currentPage > 1 && (
              <button
                onClick={() => paginate(currentPage - 1)}
                className="px-3 py-1 border rounded bg-white text-blue-500 hover:bg-blue-500 hover:text-white transition duration-300"
                aria-label="Previous Page"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
            )}
            {Array.from({ length: Math.ceil(filteredFiles.length / filesPerPage) }, (_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 hover:bg-blue-500 hover:text-white transition duration-300'}`}
                aria-current={currentPage === index + 1 ? 'page' : undefined}
              >
                {index + 1}
              </button>
            ))}
            {currentPage < Math.ceil(filteredFiles.length / filesPerPage) && (
              <button
                onClick={() => paginate(currentPage + 1)}
                className="px-3 py-1 border rounded bg-white text-blue-500 hover:bg-blue-500 hover:text-white transition duration-300"
                aria-label="Next Page"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}

export default MetadataFetcher;
