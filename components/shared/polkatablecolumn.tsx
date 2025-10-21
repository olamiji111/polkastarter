import { ColumnDef } from "@tanstack/react-table";
import Image from 'next/image';
import { PolkaRow, Project } from "@/types";


export const polkaColumns: ColumnDef<PolkaRow>[] = [
  {
    accessorKey: "projects",
    header: "Projects",
    cell: ({ getValue }) => {
      const project = getValue() as Project;
      return (
        <div className="flex items-center gap-3 p-2 min-w-[200px]">
          {project.imgPath && (
            <Image
              src={project.imgPath}
              alt={project.title}
              width={100}
              height={100}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          <div className="flex flex-col">
            <span className="font-[600] text-[19px] whitespace-normal">{project.title}</span>
            <span className="__className_a17902 text-[15px] text-[#71717A]  font-[600] flex items-baseline">
                   {project.currency} 
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "TotalRaise",
    header: "Total Raise",
    cell: ({ getValue }) => (
      <span className="text-[19px] min-w-[160px]  font-[600] __className_a17902">
         {getValue() as string}  
      </span>
    ),
  },
  {
    accessorKey: "Participants",
    header: "Participants",
    cell: ({ getValue }) => (
      <span className="px-2 text-lg min-w-[160px] font-[600] ">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "AllTimeHigh",
    header: "All Time High",
    cell: ({ getValue }) => (
      <span className="px-2 py-4 text-lg text-[#00BBFF] min-w-[160px] font-[600]">{getValue() as string}</span>
    ),
  },
];