import React from "react";
import { Column, Columns } from "./Columns";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { isDateInRange } from "../utils/date";
import { HeaderContent } from "./HeaderContent";
import { motion } from "framer-motion";
import { Pagination } from "./Pagination";
import { DebouncedInput, fuzzyFilter } from "./Filter";
import "./table.css";
import { getCommonPinningStyles } from "../utils/column";
import { ColumnVisibility } from "./ColumnVisibility";
import clsx from "clsx";
interface DatatableProps {
  columnData: Column[];
  data: any[];
  pinnable?: boolean;
  resizable?: boolean;
  enablePagination?: boolean;
  enableColumVisibility?: boolean;
  wrapperClassName?: string;
}

export function Datatable({
  columnData,
  data,
  pinnable,
  resizable,
  enablePagination,
  enableColumVisibility,
  wrapperClassName,
}: Readonly<DatatableProps>) {
  const [rowDatas] = React.useState(() => [...data]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [rowSelection, setRowSelection] = React.useState({});

  const [globalFilter, setGlobalFilter] = React.useState("");

  const [columnVisibility, setColumnVisibility] = React.useState({});

  const [columnPinning, setColumnPinning] = React.useState({});

  const columns = Columns({
    keys: columnData,
    pinnable,
    resizable,
  });

  const table = useReactTable({
    data: rowDatas,
    filterFns: {
      inDateRange: (rows, columnId, filterValue) => {
        const filtered = filterValue as string[];
        const value = rows.getValue(columnId) as string;
        return isDateInRange(value, filtered[0], filtered[1]);
      },
      fuzzy: fuzzyFilter,
    },
    columns: columns,
    enableRowSelection: true,
    globalFilterFn: "fuzzy",
    defaultColumn: {
      minSize: 60,
      maxSize: 800,
    },
    columnResizeMode: "onChange",
    state: {
      sorting,
      columnFilters,
      pagination,
      rowSelection,
      globalFilter,
      columnVisibility,
      columnPinning,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
  });

  return (
    <motion.div className={clsx("mx-auto w-full", wrapperClassName)}>
      <div  style={{
          width: table.getCenterTotalSize(),
        }} className="py-4 relative flex items-center justify-between w-full bg-red-50">
        <div>{enableColumVisibility && <ColumnVisibility table={table} />}</div>

        <div className="">
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            className="p-2 font-lg max-w-xl w-[250px]"
            placeholder="Search all columns..."
          />
        </div>
      </div>
      <motion.table
        style={{
          width: table.getCenterTotalSize(),
        }}
        className="my-auto border relative overflow-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.thead className="bg-white z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <motion.tr
              key={headerGroup.id}
              className="border-b text-gray-800 uppercase"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              {headerGroup.headers.map((header) => (
                <motion.th
                  colSpan={header.colSpan}
                  style={{
                    ...getCommonPinningStyles(header.column),
                    width: header.getSize(),
                  }}
                  key={header.id}
                  className="px-4 pr-2 py-4 font-medium text-left"
                >
                  {header.isPlaceholder
                    ? null
                    : HeaderContent({
                        header,
                        setColumnPinning,
                      })}
                  <div
                    {...{
                      onDoubleClick: () => header.column.resetSize(),
                      onMouseDown: header.getResizeHandler(),
                      onTouchStart: header.getResizeHandler(),
                      className: `resizer ${
                        table.options.columnResizeDirection
                      } ${header.column.getIsResizing() ? "isResizing" : ""}`,
                    }}
                  />
                </motion.th>
              ))}
            </motion.tr>
          ))}
        </motion.thead>

        <motion.tbody className="min-h-[400px] max-h-[600px] max-w-5xl mx-auto overflow-auto">
          {table.getRowModel().rows.map((row) => (
            <motion.tr
              key={row.id}
              className="border-b"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-2 py-2"
                  style={{
                    ...getCommonPinningStyles(cell.column),
                    width: cell.column.getSize(),
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </motion.tr>
          ))}
        </motion.tbody>
      </motion.table>
      {enablePagination && <Pagination table={table} />}
    </motion.div>
  );
}
