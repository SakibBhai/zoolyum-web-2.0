"use client"

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type HeaderGroup,
  type Row,
  type Cell
} from '@tanstack/react-table';

export function DataTable<TData>({
  columns,
  data
}: {
  columns: ColumnDef<TData>[];
  data: TData[];
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <table className="w-full">
      <thead>
        {table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id} className="text-left p-2">
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row: Row<TData>) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell: Cell<TData, unknown>) => (
              <td key={cell.id} className="p-2">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}