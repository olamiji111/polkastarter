import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { AllowlistRow, DashboardProject } from '@/types';




export const dashboardAllowlistColumns : ColumnDef<AllowlistRow>[] = [
  {
    accessorKey: "Project name",
    header: "Project name",
    cell: ({ getValue }) => {
      const project = getValue() as DashboardProject;
      return (
        <div className="flex items-center gap-3 p-2 ">
          {project.imgPath && (
            <Image
              src={project.imgPath}
              alt={project.title}
              width={40}
              height={40}
              className="w-7 h-7 rounded-full object-cover"
            />
          )}
         
            <span className="font-[600] text-sm whitespace-normal">
              {project.title}
            </span>
            <div className="px-2 bg-[linear-gradient(200deg,rgba(0,187,255,0.09)_0%,rgba(0,187,255,0.08)_100%)] rounded-[7px] py-1">
              <span className="text-[14px] font-[400] text-[var(--type-6)]">Token Sale</span>
          </div>

         
        </div>
      );
    },
  },
  {
    accessorKey: "Sale Date",
    header: "Sale Date",
    cell: ({ getValue }) => {
        const saledate = getValue() as AllowlistRow["Sale Date"];
      return (
        <div className="flex flex-col gap-0.5">
           <span className="text-sm  font-[400] text-primary ">{saledate.date}</span>
           <span className="text-sm  font-[400] text-[var(--type-3)]">{saledate.time}</span>
        </div>
      )
    }
     
    
  },

  {
    accessorKey: "Status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue() as string;
  
    
      let showPresale = false;
  
      if (status.toLowerCase() === "allowlisted") {
        showPresale = true;
      } 

      return (
        <>
        {!showPresale ? (
          <div className=" w-fit  relative px-3 flex  bg-gray-500 items-center  text-center justify-center py-1 rounded-sm">
            <span className={` uppercase text-xs font-[400]  text-background `}>
              {status}
            </span>
          </div>
        ):(
          <div className="relative flex items-center gap-1.5 ">
              <div className="px-1 bg-gray-500 items-center justify-center py-1 rounded">
                  <span className={`text-xs font-[600]   text-background `}>
                    {status}
                  </span>
              </div>
              <div className="relative flex items-center gap-1">
                  <span className="animate-ping absolute inline-flex h-3 w-3 -translate-x-[0.12rem]  rounded-full bg-green-800 opacity-75"></span>
                  <span className="inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                  <span className="ml-1 text-xs font-[600] text-[var(--type-2)]">presale is Live</span>
              </div>
              
            </div>
        )

      }
       </>
         
      );
    },
  }
];