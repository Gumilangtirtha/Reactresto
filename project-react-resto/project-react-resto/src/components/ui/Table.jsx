import React from 'react';
import PropTypes from 'prop-types';

/**
 * Table Component
 * 
 * A reusable table component for displaying data in rows and columns.
 */
const Table = ({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data available',
  className = '',
  ...props
}) => {
  // Check if data is empty
  const isEmpty = !data || data.length === 0;
  
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-gray-200 ${className}`} {...props}>
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={column.width ? { width: column.width } : {}}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center">
                <div className="flex justify-center items-center">
                  <svg className="animate-spin h-5 w-5 text-gray-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Loading...</span>
                </div>
              </td>
            </tr>
          ) : isEmpty ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {column.render ? column.render(row, rowIndex) : row[column.dataIndex]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.node.isRequired,
      dataIndex: PropTypes.string,
      render: PropTypes.func,
      width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ).isRequired,
  data: PropTypes.array,
  loading: PropTypes.bool,
  emptyMessage: PropTypes.node,
  className: PropTypes.string
};

export default Table;
