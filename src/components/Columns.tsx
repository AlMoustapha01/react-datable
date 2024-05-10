import {
  CellContext,
  createColumnHelper,
  FilterFn,
  RowData,
} from "@tanstack/react-table";
import { RankingInfo } from "@tanstack/match-sorter-utils";
import { Checkbox } from "@nextui-org/react";

declare module "@tanstack/react-table" {
  //allows us to define custom properties for our columns
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "range" | "text" | "select";
    type: "date" | "number" | "string" | "enum" | "boolean";
    selectRowsData?: {
      label: string;
      value: any;
    }[];
    format?: string;
  }
  interface FilterFns {
    inDateRange?: FilterFn<unknown>;
    fuzzy?: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

export interface Column {
  key: string;
  title: string;
  sortable?: boolean;
  pinnable?: boolean;
  resizable?: boolean;
  filterable?: boolean;
  template?: (info: CellContext<any, any>) => JSX.Element;
  meta?: {
    filterVariant: "range" | "text" | "select";
    type: "date" | "number" | "string" | "enum" | "boolean";
    selectRowsData?: {
      label: string;
      value: any;
    }[];
    format?: string;
  };
}

const DefaultCellRender = (content: CellContext<any, any>) => (
  <span>{content.getValue()}</span>
);

const DefaultHeaderRender = (content: string) => <span>{content}</span>;

export function Columns({
  keys,
  pinnable,
  resizable,
}: {
  keys: Column[];
  pinnable?: boolean;
  resizable?: boolean;
}) {
  const columnHelper = createColumnHelper<any>();

  const getFilterFn = (meta: Column["meta"]) => {
    if (!meta) return undefined;
    switch (meta.filterVariant) {
      case "range":
        if (meta.type === "date") {
          return "inDateRange";
        }
        return "inNumberRange";
      case "select":
        return "arrIncludesSome";
      default:
        return "includesString";
    }
  };

  const columns = keys.map((key) =>
    columnHelper.accessor(key.key, {
      cell: (info) =>
        key.template ? key.template(info) : DefaultCellRender(info),
      header: () => DefaultHeaderRender(key.title),
      enableSorting: key.sortable ?? false,
      meta: {
        filterVariant: key.meta?.filterVariant ?? "text",
        type: key.meta?.type ?? "string",
        selectRowsData: key.meta?.selectRowsData ?? [],
      },
      filterFn: getFilterFn(key.meta),
      enableColumnFilter: key.filterable ?? false,
      enablePinning: pinnable ?? false,
      enableResizing: resizable ?? false,
    })
  );

  columns.unshift(
    columnHelper.accessor("select", {
      header: ({ table }) => (
        <Checkbox
          className="p-1 rounded-sms"
          isSelected={table.getIsAllRowsSelected()}
          isIndeterminate={table.getIsSomeRowsSelected()}
          onValueChange={table.toggleAllRowsSelected}
        />
      ),
      cell: ({ row }) => (
        <div className="px-1">
          <Checkbox
            isSelected={row.getIsSelected()}
            isDisabled={!row.getCanSelect()}
            isIndeterminate={row.getIsSomeSelected()}
            onValueChange={row.toggleSelected}
          />
        </div>
      ),
      enableSorting: false,
      enableColumnFilter: false,
      enablePinning: false,
      filterFn: undefined,
    })
  );

  return columns;
}
