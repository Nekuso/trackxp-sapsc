"use client";
import { CiExport } from "react-icons/ci";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { branches, roles, statuses } from "./columns";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import AddEmployeeButton from "./add-employee/add-employee-dialog";
import { toast } from "sonner";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          className="w-[250px] h-10 border-none bg-lightComponentBg rounded-lg text-white placeholder:text-white/40"
          placeholder="Find Employee"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn("roles") && (
          <DataTableFacetedFilter
            column={table.getColumn("roles")}
            title="Role"
            options={roles}
          />
        )}
        {table.getColumn("branch") && (
          <DataTableFacetedFilter
            column={table.getColumn("branch")}
            title="Branch"
            options={branches}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3 hover:bg-applicationPrimary hover:text-white"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex gap-4">
        <Button
          className="text-xs text-black font-bold rounded-full flex gap-2 bg-white/90 hover:bg-white transition-all duration-300"
          onClick={() =>
            toast("Event has been created", {
              description: "Employee data exporting",
              action: {
                label: "Undo",
                onClick: () => console.log("Undo"),
              },
            })
          }
        >
          <CiExport />
          Export
        </Button>
        <AddEmployeeButton />
      </div>
    </div>
  );
}
