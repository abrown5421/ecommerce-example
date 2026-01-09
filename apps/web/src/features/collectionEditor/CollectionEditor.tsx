import React, { useState, useMemo } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import SearchBar from '../searchBar/SearchBar';
import Pagination from '../pagination/Pagination';
import { openModal } from '../modal/modalSlice';
import { useAppDispatch } from '../../app/store/hooks';

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface CollectionEditorProps<T> {
  data: T[];
  columns: Column<T>[];
  searchKeys: (keyof T)[];
  itemsPerPage?: number;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

function CollectionEditor<T extends { _id: string }>({
  data,
  columns,
  searchKeys,
  itemsPerPage = 10,
  onEdit,
  onDelete,
}: CollectionEditorProps<T>) {
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter((item) =>
      searchKeys.some((key) => {
        const value = item[key];
        return value
          ? String(value).toLowerCase().includes(searchTerm.toLowerCase())
          : false;
      })
    );
  }, [data, searchTerm, searchKeys]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);
  
  return (
    <div className="flex flex-col w-full space-y-4">
      <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search..." />
      <div className="overflow-x-auto bg-neutral3 rounded-md">
        <table className="w-full text-left">
          <thead className="bg-neutral-700 text-white">
            <tr>
              {columns.map((col) => (
                <th key={String(col.key)} className="px-4 py-2">
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete) && <th className="px-4 py-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-2 text-center text-gray-500">
                  No records found.
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr key={item._id} className="border-b border-neutral-400">
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-2">
                      {col.render ? col.render(item) : String(item[col.key])}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-4 py-2 flex space-x-2 justify-end">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1 text-blue-600 hover:text-blue-800 rounded cursor-pointer"
                          title="Edit"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item)}
                          className="p-1 text-red-600 hover:text-red-800 rounded cursor-pointer"
                          title="Delete"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </div>
  );
}

export default CollectionEditor;
