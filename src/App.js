import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/solid';

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
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const filteredFiles = metadata.files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = filteredFiles.slice(indexOfFirstFile, indexOfLastFile);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">{metadata.metadata.title}</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search files..."
            className="p-2 border rounded w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search files"
          />
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute right-3 top-3" />
        </div>
        <div className="mb-4">
          <p className="text-lg mb-2"><strong>Creator:</strong> {metadata.metadata.creator}</p>
          <p className="text-lg mb-2"><strong>Year:</strong> {metadata.metadata.year}</p>
          <p className="text-lg mb-2"><strong>Publisher:</strong> {metadata.metadata.publisher}</p>
          <p className="text-lg mb-2"><strong>Language:</strong> {metadata.metadata.language}</p>
          <p className="text-lg mb-4"><strong>Description:</strong> {metadata.metadata.description}</p>
        </div>
        <h3 className="text-xl font-semibold mb-2">Files</h3>
        <ul className="list-disc pl-5">
          {currentFiles.map((file, index) => (
            <li
              key={index}
              className="mb-2 transition duration-300 ease-in-out transform hover:scale-105"
            >
              <a
                href={`https://archive.org/download/${metadata.metadata.identifier}/${file.name}`}
                className="text-blue-500 hover:underline flex items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ChevronRightIcon className="w-4 h-4 mr-2" />
                {file.name}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex justify-center mt-4">
          <nav aria-label="File Pagination">
            <ul className="flex space-x-2">
              {currentPage > 1 && (
                <li>
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    className="px-3 py-1 border rounded bg-white text-blue-500 hover:bg-blue-500 hover:text-white transition duration-300"
                    aria-label="Previous Page"
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                  </button>
                </li>
              )}
              {Array.from({ length: Math.ceil(filteredFiles.length / filesPerPage) }, (_, index) => (
                <li key={index}>
                  <button
                    onClick={() => paginate(index + 1)}
                    className={`px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 hover:bg-blue-500 hover:text-white transition duration-300'}`}
                    aria-current={currentPage === index + 1 ? 'page' : undefined}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              {currentPage < Math.ceil(filteredFiles.length / filesPerPage) && (
                <li>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    className="px-3 py-1 border rounded bg-white text-blue-500 hover:bg-blue-500 hover:text-white transition duration-300"
                    aria-label="Next Page"
                  >
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default MetadataFetcher;
