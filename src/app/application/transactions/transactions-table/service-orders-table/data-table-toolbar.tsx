"use client";
import React from "react";
import { CiExport } from "react-icons/ci";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { progress, status } from "./columns";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import AddOrderButton from "./add-service-order/add-order-dialog";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import DatePickerWithRange from "./date-picker";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  partsData?: any[];
  productsData?: any[];
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const branchesSlice = useSelector((state: any) => state.branches);
  const currentSession = useSelector((state: any) => state.currentSession);

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-1 items-center space-x-2 flex-wrap gap-y-2">
        <Input
          className="w-[200px] 2xl:w-[250px] h-10 border-none bg-lightComponentBg rounded-lg text-white placeholder:text-white/40"
          placeholder="Tracking ID"
          value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("id")?.setFilterValue(event.target.value)
          }
        />

        {table.getColumn("branch") &&
        currentSession.roles?.role === "Administrator" ? (
          <DataTableFacetedFilter
            column={table.getColumn("branch")}
            title="Branch"
            options={branchesSlice}
          />
        ) : null}
        {table.getColumn("progress_entries") && (
          <DataTableFacetedFilter
            column={table.getColumn("progress_entries")}
            title="Progress"
            options={progress}
          />
        )}
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Payment"
            options={status}
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
        <DatePickerWithRange />
        {currentSession.roles?.role !== "Cashier" && <AddOrderButton />}
      </div>
    </div>
  );
}
