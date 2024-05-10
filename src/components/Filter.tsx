import {
  DateRangePicker,
  DateValue,
  Input,
  RangeValue,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { rankItem } from "@tanstack/match-sorter-utils";
import { Column, FilterFn } from "@tanstack/react-table";
import clsx from "clsx";
import React from "react";

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};
export function Filter({ column }: Readonly<{ column: Column<any, unknown> }>) {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant, selectRowsData, type } = column.columnDef.meta ?? {};

  const { setFilterValue } = column;
  const [rangeDate, setRangeDate] =
    React.useState<RangeValue<DateValue> | null>(null);

  switch (filterVariant) {
    case "range":
      return (
        <div>
          {type === "date" && (
            <DateRangePicker
            className="min-w-xl"
              visibleMonths={2}
              showMonthAndYearPickers
              value={rangeDate}
              onChange={(value) => {
                setRangeDate(value);
                setFilterValue([value.start, value.end]);
              }}
            />
          )}
          {type === "number" && (
            <div className="flex space-x-2">
              {/* See faceted column filters example for min max values functionality */}
              <DebouncedInput
                type="number"
                value={(columnFilterValue as [number, number])?.[0] ?? ""}
                onChange={(value) =>
                  column.setFilterValue((old: [number, number]) => [
                    value,
                    old?.[1],
                  ])
                }
                placeholder={`Min`}
                className="w-24 border shadow rounded"
              />
              <DebouncedInput
                type="number"
                value={(columnFilterValue as [number, number])?.[1] ?? ""}
                onChange={(value) =>
                  setFilterValue((old: [number, number]) => [old?.[0], value])
                }
                placeholder={`Max`}
                className="w-24 border shadow rounded"
              />
            </div>
          )}
          <div className="h-1" />
        </div>
      );
    case "select":
      return (
        selectRowsData && (
          <Select
            selectionMode="multiple"
            selectedKeys={columnFilterValue as string[] | "all"}
            onSelectionChange={(value) => {
              console.log(Array.from(value));

              setFilterValue(Array.from(value));
            }}
            defaultSelectedKeys={"all"}
          >
            {/* See faceted column filters example for dynamic Select options */}
            {selectRowsData.map((option: any) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
        )
      );
    case "text":
      return (
        <DebouncedInput
          className="w-full"
          onChange={(value) => setFilterValue(value)}
          placeholder={`Search...`}
          type="text"
          value={(columnFilterValue ?? "") as string}
        />
        // See faceted column filters example for datalist search suggestions
      );
    default:
      return null;
  }
}

// A typical debounced input react component
export function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  className,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <Input
      {...props}
      value={value}
      className={
        clsx("rounded", className)
      }
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
