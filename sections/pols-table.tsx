'use client';
import * as React from "react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"; // ShadCN Table
import { PolkaRow } from "@/types";
import { polkaColumns } from "@/components/shared/polkatablecolumn";
import { polkaTableElements } from "@/constants";
import {useRouter} from "next/navigation";

export default function PolkaTable() {
  const table = useReactTable({
    data: polkaTableElements as PolkaRow[],
    columns: polkaColumns,
    getCoreRowModel: getCoreRowModel(),
  });
  const router = useRouter();

  return (
    <div className="overflow-x-auto">
    <Table className="w-full text-lg   border-spacing-x-0 border-spacing-y-0">
      <TableHeader className="bg-[var(--table-header)]  hover:bg-contrast">
        {table.getHeaderGroups().map(headerGroup => (
          <TableRow key={headerGroup.id} className="hover:bg-contrast">
            {headerGroup.headers.map(header => (
              <TableHead key={header.id}  className={` px-3 py-6  font-bold text-[var( --type-1)] text-left  ${header.id === "projects" ? "pl-9" : ""}`}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map(row => (
          <TableRow
             key={row.id} 
            className="border border-[var(--table-border)] cursor-pointer hover:bg-[var(--table-hover)]"
            onClick={() => {
              setTimeout(() => {
                router.push("/")
              }, 1000)
             
            }}
          >
            {row.getVisibleCells().map((cell,index) => (
              <TableCell key={cell.id} className={`py-2 font-[500] min-w-[160px] ${index === 0 ? "pr-8" : "pr-4"} lg:py-3 `}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
  );
}