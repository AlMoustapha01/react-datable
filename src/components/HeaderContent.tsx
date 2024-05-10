import {
  Button,
  Checkbox,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { flexRender, Header } from "@tanstack/react-table";
import clsx from "clsx";
import {
  ArrowDownWideNarrow,
  ArrowUpDown,
  ArrowUpNarrowWide,
  CircleCheckBigIcon,
  ListFilter,
  X,
} from "lucide-react";
import { Filter } from "./Filter";

export const HeaderContent = ({
  header,
  setColumnPinning,
}: {
  header: Header<any, unknown>;
  setColumnPinning: React.Dispatch<React.SetStateAction<{}>>;
}) => {
  return (
    <div className="flex items-center space-x-1">
      {!header.isPlaceholder && header.column.getCanPin() && (
        <div className="flex gap-1 justify-center">
          <Checkbox
            color="danger"
            isSelected={header.column.getIsPinned() === "left"}
            onValueChange={(check) => {
              if (check) {
                setColumnPinning({})
                header.column.pin("left");
              } else {
                header.column.pin(false);
              }
            }}
          />
        </div>
      )}
      <button
        type="button"
        {...{
          className: clsx(
            "flex items-center space-x-1 w-full transition-all duration-200 ease-in-out",
            header.column.getCanSort() &&
              "cursor-pointer select-none flex min-w-[36px]"
          ),
          onClick: header.column.getToggleSortingHandler(),
        }}
      >
        {flexRender(header.column.columnDef.header, header.getContext())}
        {{
          asc: (
            <ArrowUpNarrowWide
              className="transition-all duration-200 ease-in-out"
              size={15}
            />
          ),
          desc: (
            <ArrowDownWideNarrow
              className="transition-all duration-200 ease-in-out"
              size={15}
            />
          ),
          none: <ArrowUpDown size={15} />,
        }[header.column.getIsSorted() as string] ??
          (header.column.getCanSort() && <ArrowUpDown size={15} />)}
      </button>
      {header.column.getCanFilter() ? (
        <Popover className="w-[300px]" placement="bottom" showArrow={true}>
          <PopoverTrigger>
            <Button variant="light" isIconOnly>
              <ListFilter size={15} />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="w-64 text-sm text-gray-500 dark:text-gray-400 p-4">
              <Filter column={header.column} />
            </div>
          </PopoverContent>
        </Popover>
      ) : null}
    </div>
  );
};
