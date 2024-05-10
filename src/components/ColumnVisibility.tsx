import {
  Button,
  Checkbox,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { Table } from "@tanstack/react-table";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";

export function ColumnVisibility({
  table,
  className,
}: {
  table: Table<any>;
  className?: string;
}) {
  return (
    <Popover
      placement="bottom"
      showArrow={true}
      className={clsx("w-[200px]", className)}
    >
      <PopoverTrigger>
        <Button endContent={<ChevronDown size={16} />}>
          Toutes les colonnes
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2 flex flex-col items-start">
          {table.getAllLeafColumns().map((column) => {
            return (
              <div key={column.id} className="px-1">
                <label>
                  <Checkbox
                    isSelected={column.getIsVisible()}
                    onValueChange={column.toggleVisibility}
                  />{" "}
                  {column.id}
                </label>
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
