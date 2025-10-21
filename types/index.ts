import { ComponentType, SVGProps } from "react";

export type ChainIcon = ComponentType<SVGProps<SVGSVGElement>>;

export interface Project {
     title: string;
     currency: string;
     imgPath: string;
}

export interface DashboardProject {
     title: string;
     img:string;
}
   
export interface PolkaRow {
     projects: Project;
     TotalRaise: string;
     Participants: string;
     AllTimeHigh: string;
};

export type CoinIcon = {
     title: string,
     light:string,
     dark: string,
};

export type FAQProps  = {
     question: string;
}
  
export type AllowlistRow = {
     "Project name": DashboardProject;
     "Sale Date": {
          date:string;
          time:string;
     }
     Status: string
};

export type EndedIn = {
     date: string;
     time: string;
}

export type ProjectTableRow = {
     "Project name": Project;
     Type: string;
     Participants: string;
     "Raising Goal": string;
     "ATH since IDO": string;
     "Ended In": EndedIn;
     chains: ChainIcon;
};

export type UpcomingProject = {
     name: string;
     backgroundImage: string;
     icon: string;
     cointypeIcon?: "base" | "ethereum" | string ;
     about: string;
     FundRaiseValue: string;
     maxAllocation: string;
     status: string;
     date?: string ;
     time?:string;
     dateStatement?: string;
     tokenPrice?:string;
     RaiseToken?: string;
     participants?: number;
     salePercentage: string;
};