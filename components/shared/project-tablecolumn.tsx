import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { Project, EndedIn, ProjectTableRow } from "@/types";

const clickableHeaders: (keyof ProjectTableRow)[] = [
  "Project name",
  "Participants",
  "Raising Goal",
  "ATH since IDO",
  "Ended In",
];

export const projectsTableColumn = (
  activeHeader: keyof ProjectTableRow | null,
  onHeaderClick: (header: keyof ProjectTableRow) => void
): ColumnDef<ProjectTableRow>[] => [
  {
    accessorKey: "Project name",
    header: () => {
      const isActive = activeHeader === "Project name";
      return (
        <button
          onClick={() => onHeaderClick("Project name")}
          className={`flex min-w-[200px] items-center cursor-pointer gap-1 text-[13px]  transition-colors hover:text-[#0095cc]
            ${isActive ? "text-[#0095cc]" : "text-[var(--type-2)]"} `}
        >
          Project name
          {isActive && <ChevronDown className="w-4 h-4 text-[#0095cc]" />}
        </button>
      );
    },
    cell: ({ getValue }) => {
      const project = getValue() as Project;
      return (
        <div className="flex items-center gap-3  ">
          {project.imgPath && (
            <Image
              src={project.imgPath}
              alt={project.title}
              width={40}
              height={40}
              priority
              className="w-7 h-7 rounded-full object-cover"
            />
          )}
          <div className="flex flex-col">
            <span className="font-[600] sm:text-[17px] text-sm break-words whitespace-normal ">{project.title}</span>
            <span className="text-[14px] text-[var(--type-3)] font-[600] __className_a17902">{project.currency}</span>
          </div>
        </div>
      );
    },
  },
  // Type column (not clickable)
  {
    accessorKey: "Type",
    header: "Type",
    cell: ({ getValue }) => (
      <div className="px-2 bg-[linear-gradient(200deg,rgba(0,187,255,0.09)_0%,rgba(0,187,255,0.08)_100%)] rounded-[7px] py-1">
        <span className="text-[14px] font-[400] text-[var(--type-6)]">{getValue() as string}</span>
      </div>
    ),
  },

  // Participants
  {
    accessorKey: "Participants",
    header: () => {
      const isActive = activeHeader === "Participants";
      return (
        <button
          onClick={() => onHeaderClick("Participants")}
          className={`text-[13px] hover:text-[#0095cc] min-w-[50px] cursor-pointer transition-all flex items-center 
            ${isActive ? "text-[#0095cc]" : "text-[var(--type-2)]"} `}
        >
          Participants
          {isActive && <ChevronDown className="w-4 h-4 text-[#0095cc] flex" />}
        </button>
      );
    },
    cell: ({ getValue }) => <span className="text-[17px] font-[600] px-8">{getValue() as string}</span>,
  },

  // Raising Goal
  {
    accessorKey: "Raising Goal",
    header: () => {
      const isActive = activeHeader === "Raising Goal";
      return (
        <button
          onClick={() => onHeaderClick("Raising Goal")}
          className={`text-[13px]  transition-colors  cursor-pointer min-w-[50px] flex items-center hover:text-[#0095cc]
            ${isActive ? "text-[#0095cc]" : "text-[var(--type-2)]"} `}
        >
          Raising Goal
          {isActive && <ChevronDown className="w-4 h-4 text-[#0095cc]" />}
        </button>
      );
    },
    cell: ({ getValue }) => <span className="text-[17px]   font-[600] __className_a17902">{getValue() as string}</span>,
  },

  // ATH since IDO
  {
    accessorKey: "ATH since IDO",
    header: () => {
      const isActive = activeHeader === "ATH since IDO";
      return (
        <button
          onClick={() => onHeaderClick("ATH since IDO")}
          className={`text-[13px] flex duration-200 transition-all cursor-pointer min-w-[50px] items-center hover:text-[#0095cc]
            ${isActive ? "text-[#0095cc]" : "text-[var(--type-2)]"} `}
        >
          ATH since IDO
          {isActive && <ChevronDown className="w-4 h-4 text-[#0095cc]" />}
        </button>
      );
    },
    cell: ({ getValue }) => {
      const ath = getValue() as ProjectTableRow["ATH since IDO"];
      if (ath === "TBA") return <span className="font-[600] text-[17px] px-10">{ath}</span>;
      return (
        <div className="px-1 ml-8 font-[600] bg-[rgb(52,211,153)] text-[var(--type-5)] text-[13px] py-[6px] rounded-[6px] inline-block">
          {ath}
        </div>
      );
    },
  },

  // Ended In
  {
    accessorKey: "Ended In",
    header: () => {
      const isActive = activeHeader === "Ended In";
      return (
        <button
          onClick={() => onHeaderClick("Ended In")}
          className={`text-[13px]  transition-colors flex hover:text-[#0095cc] cursor-pointer
            items-center min-w-[50px]
            ${isActive ? "text-[#0095cc]" : "text-[var(--type-2)]"} `}
        >
          Ended In
          {isActive && <ChevronDown className="w-4 h-4 text-[#0095cc]" />}
        </button>
      );
    },
    cell: ({ getValue }) => {
      const dateTime = getValue() as EndedIn;
      return (
        <div className="flex flex-col gap-1">
          <span className="text-[16px] font-[600] __className_a17902 tracking-[0.04rem]">{dateTime.date}</span>
          <span className="text-sm font-[600] text-[var(--type-3)] ">{dateTime.time}</span>
        </div>
      );
    },
  },

 
  {
    accessorKey: "chains",
    header: "Chains",
    cell: ({ getValue }) => {
      const Icon = getValue() as ProjectTableRow["chains"];
      return (
        <div className="items-center justify-center flex">
          <Icon className="w-7 h-7 shrink-0" />
        </div>
      );
    },
  },
];