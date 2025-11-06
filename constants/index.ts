import {FaTelegramPlane, FaYoutube, FaInstagram, FaLinkedinIn, FaGithub} from "react-icons/fa";
import XIcon from "@/components/icons/XIcon";
import {Dark, Light, System, FundsInvested, PolsStaked, IDOParticipated, completedMissions, ProjectCoinEthereum,  Sei, BNB, Ethereum, Arbitrum, ProjectCoinBase, FundedProjectIcons, UniqueParticipants, RaisedCapitals} from "@/components/icons/icons"
import { fetchPolsPrice, fetchMarketCap } from "@/lib/fetchpolsprice";
import {Bitavo, Revolut, polsPowerTier, lotteryProbability, idoCooldown, lockupPeriod, totalStaked, polsPowerGain} from "@/components/icons/icons"
import {PolkaRow, CoinIcon, FAQProps} from "@/types";


export const headerLinks = [
     { 
          label: "Home", 
          route: "/" 
     },

     { 
          label: "Projects",
           route: "/projects" 
     },

     { 
          label: "Dashboard", 
          route: "/dashboard" 
     },

     { label: "Portfolio",
       route: "/portfolio" 
     },

     { label: "Staking", 
       route: "/staking" 
     },

     { label: "Missions",
       route: "/missions" 
     },
];

export const popoverSections = [
     {
       title: 'Company',
       links: [
         { label: 'Launch on Polkastarter' },
         { label: 'Blog' },
       ],
     },
     {
       title: 'Need help?',
       links: [
         { label: 'Support' },
         { label: 'Telegram' },
       ],
     },
];

export const footerLinks = [
     {
          title: 'Company',
          Links: [
               {label:'About us'},
               {label: 'Blog'},
               {label:'Council'},
               {label: 'Press kit'},
               {label: 'POLS Dashboard'}
          ] 
     },
     {
          title:'Help',
          Links: [
               {label: 'Support'},
               {label:'Terms & Conditions'},
               {label: 'Privacy Policy'}
          ]
     },
     {
          title:'Developers',
          Links:[
               {label:'Documentation'},
               {label:'Polkastarter.js'},
          ]
     },
     {
          title:'Information',
               Links:[
               {label:'Apply for IDO'},    
          ]
     },
     {
          title:'Products',
          Links:[
               {label:'Gaming'},
               {label:'Poolside Podcast'},
               {label: 'Poolside Accelerator'},
               {label:'Poolside Hub'}
          ]
     },
     {
          title:'Resources',
          Links:[
               {label:'Projects'},
               {label:'Dashboard'},
               {label:' Portfolio'},
               {label: 'Staking'},
               {label:'Missions'}
          ]
     }
]
export const socialLinks = [
     {
       label: "X",
       icon: XIcon,
       href: "https://twitter.com/Polkastarter" 
     },
     {
       label: "Telegram",
       icon: FaTelegramPlane,
       href: "https://t.me/polkastarter"
     },
     {
       label: "Youtube",
       icon: FaYoutube,
       href: "https://www.youtube.com/c/PolkastarterOfficial"
     },
     {
       label: "Instagram",
       icon: FaInstagram,
       href: "https://www.instagram.com/polkastarter/"
     },
     {
       label: "LinkedIn",
       icon: FaLinkedinIn,
       href: "https://www.linkedin.com/company/polkastarter/"
     },
     {
       label: "Github",
       icon: FaGithub,
       href: "https://github.com/Polkastarter"
     }
   ];

export const themes = [
     {
          label:'system', icon: System,
     },
     {
          label:'dark', icon: Dark,
     },
     {
          label:'light', icon: Light,
     }
] as const;

export type ThemeType = typeof themes[number]['label'];



export const coinIcons: CoinIcon[] = [
     {
       title: "Coinbase",
       light: "/assets/images/Coinbase.png",
       dark: "/assets/images/Coinbase.png",
     },
     {
       title: "kraken",
       light: "/assets/images/Kraken.png",
       dark: "/assets/images/Kraken.png",
     },
     {
       title: "Kucoin",
       light: "/assets/images/Kucoin.png",
       dark: "/assets/images/Kucoin.png",
     },
     {
       title: "Gate.io",
       light: "/assets/images/Gate.png",
       dark: "/assets/images/Gate-dark.png",
     },
     {
       title: "Mexc Global",
       light: "/assets/images/MEXC.png",
       dark: "/assets/images/MEXC-dark.svg",
     },
     {
       title: "HTX",
       light: "/assets/images/HTX.png",
       dark: "/assets/images/HTX-dark.svg",
     },
];

export const councilLogo = [
     {
          title:"OKX",
          imgPath:"/assets/images/OKX.png"
     },
     {
          title:"Alchemy",
          imgPath:"/assets/images/Alchemy.svg"
     },
     {
          title:"polygon",
          imgPath:"/assets/images/Polygon.svg"
     },
     { 
          title:"HTX",
          imgPath:"/assets/images/HTX.svg"
     }

];

export  const polstat = [
     {
          value: "49,559",
          title:"ON-CHAIN HOLDERS",   
     },
     {
          value:"17.02%",
          title:"LEFT ON EXCHANGES"
     }

];

export const polsStatement = [


     {
          title:"Evergreen Asset",
          content:"POLS is one of the few assets in the industry with constant utility, independent of fleeting narratives.",
          otherContent:"Projects of all narratives ultimately make their way to Polkastarter.",
          imgPath:"/assets/images/sphere.jpg"
     },

     {
          title:"Available on the Largest Fiat Market",
          content:"POLS is the only launchpad token accessible to the retail masses.",
          otherContent: "It is one of the lowest market cap tokens listed on Revolut, the world's largest fiat platform serving users across 198 countries.",
          imgPath:"/assets/images/revolut-credit-cards.png"
     },
     {
          title:"Low Market Cap Token Listed on Leading Markets",
          content:"POLS is one of the lowest market cap tokens listed on world-leading markets like Coinbase, Revolut, and Bitvavo.",
          otherContent:"",
          imgPath:"/assets/images/pols-on-leadings.svg"
     }

];

export const polsEvent = [ 
     "Native Solana Support",

     "Korean and European Market Expansion",

     "Switch to v3 Liquidity to Create Token Burns",

     "Fiat Onramp",

     "Exchange Listings",

     "Switching Liquidity to cbETH: Creating Native Buy Power for POLS",

     "Hackathons",

     "New Staking Incentives",

     "Growth Campaign",

     "Exchange Marketing Campaign",

     "Region-Specific Physical Event"

];



export const getMarketCap = async () => {
     const cap = await fetchMarketCap();
     
     return [
       {
         title: "Total Market Cap",
         value: cap ? `${cap}` : "N/A",
                 
       },
       {
         title: "DEX Liquidity",
         value: "$400,000",           
       },
       {
         title: "Account Holding Pols",
         value: 49559,            
       },
     ];
};

export const getPolsSupply = async () => {
     const currentPrice = await fetchPolsPrice(5);

     return [
          {
               title:"Current Price",
               value: currentPrice ? `$${currentPrice}` :"N/A",
              
          },
          {
               title:"Volume(24h)",
               value:"$774,177",
               
          }, 
          {
               title:"Circulating Supply",
               value:"99,209,631",
               
          }
     ];
};

export const fullCoinicon = [
     {
       title: "Coinbase",
       light: "/assets/images/Coinbase.png",
       dark: "/assets/images/Coinbase.png",
       link: "https://www.coinbase.com",
       type: "image",
     },
     {
       title: "Kraken",
       light: "/assets/images/Kraken.png",
       dark: "/assets/images/Kraken.png",
       link: "https://www.kraken.com",
       type: "image",
     },
     {
       title: "Revolut",
       light: Revolut,
       dark: Revolut,
       link: "https://www.revolut.com/crypto/price/pols/",
       type: "component",
     },
     {
       title: "HTX",
       light: "/assets/images/HTX.png",
       dark: "/assets/images/HTX-dark.svg",
       link: "https://www.htx.com",
       type: "image",
     },
     {
       title: "Kucoin",
       light: "/assets/images/Kucoin.png",
       dark: "/assets/images/Kucoin.png",
       link: "https://www.kucoin.com",
       type: "image",
     },
     {
       title: "Bitavo",
       light: Bitavo,
       dark: Bitavo,
       link: "https://bitvavo.com",
       type: "component",
     },
     {
       title: "Pancakeswap",
       light: "/assets/images/pancakeswap.png",
       dark: "/assets/images/pancakeswap-dark.png",
       link: "https://pancakeswap.finance/info/token/0x7e624FA0E1c4AbFD309cC15719b7E2580887f570",
       type: "component",
     },
     {
       title: "Gate.io",
       light: "/assets/images/Gate.png",
       dark: "/assets/images/Gate-dark.png",
       link: "https://www.gate.io",
       type: "image",
     },
     {
       title: "MEXC Global",
       light: "/assets/images/MEXC.png",
       dark: "/assets/images/MEXC-dark.svg",
       link: "https://www.mexc.com",
       type: "image",
     },
     {
       title: "Mercado Bitcoin",
       light: "/assets/images/mercado-bitcoin.png",
       dark: "/assets/images/mercado-bitcoin.png",
       link: "https://www.mercadobitcoin.com.br",
       type: "image",
     },
     {
       title: "Uniswap",
       light: "/assets/images/uniswap.png",
       dark: "/assets/images/uniswap.png",
       link: "https://app.uniswap.org/",
       type: "image",
     },
     {
       title: "CoinEx",
       light: "/assets/images/CoinEx.png",
       dark: "/assets/images/CoinEx.png",
       link: "https://www.coinex.com",
       type: "image",
     },
];

export const polkaQuestions = [ 
     {
          question:"How to Participate in a Polkastarter IDO?",
          imgPath:"/assets/images/featured@2x.png",
          content:" A good place to start is: what is Polkastarter? (We'll give you the brief version). Polkastarter is a platform that connects the young projects with early community members through initial decentralized offerings or IDOs. During an IDO, a project will distribute tokens to community members (aka IDO participants) in exchange for",
     },

     {
          question:"How to buy the Polkastarter $POLS token?",
          imgPath:"/assets/images/post-1@2x.png",
          content:""
     }, 
     {
          question:"What is an IDO (Initial Decentralized Offering)?",
          imgPath:"/assets/images/post-2@2x.png",
          content:"",
     }

];

export const faqQuestions  : FAQProps[] = [
     {
          question:"How can I Get POLS Power?",
         
     },
     {
          question:"On which Exchanges Can I Buy $POLS Token?",
     },

     {
          question:"How To Get Allowlisted for Polkastarter IDOs?",
          
     },
     {
          question:"What is the Cooldown Period in Polkastarter IDOs?",
          
     },
     
]


export const  polkaTableElements : PolkaRow [] = [
     {
          projects: {
               title:"AI Voice Agents",
               currency:"$AIVA",
               imgPath:"/assets/images/aiva.png"
          },
          TotalRaise:"$50,0000",

          Participants:"241",

          AllTimeHigh:"784%"
     },
     {
          projects: {
               title:"WELF",
               currency:"$WELF",
               imgPath:"/assets/images/welf.png"
          },
          TotalRaise:"$100,000",

          Participants:"318",
     
          AllTimeHigh:"1387%"
     },
     {
          projects: {
               title:"DeSci Agents",
               currency:"$DESCI",
               imgPath:"/assets/images/desci.png"
          },
          TotalRaise:"$100,0000",

          Participants:"524",
     
          AllTimeHigh:"1033%"
     },
     {
          projects: {
               title:"Casper AI",
               currency:"$AIAGENT",
               imgPath:"/assets/images/casperai.png"
          },
          TotalRaise:"$100,000",

          Participants:"442",
     
          AllTimeHigh:"950%"
     },
     {
          projects: {
               title:"SUI Agents",
               currency:"$SUIAI",
               imgPath:"/assets/images/suiai.png"
          },
          TotalRaise:"$150,000",

          Participants:"412",
     
          AllTimeHigh:"1007%"
     }
];

 export const stakingSummary = [
     {
          title: "POLS Power tier",
          icon: polsPowerTier,
          value:"N/A",
          value2:"(<1000)"
     },
     {
          title: "Lottery Probability",
          icon:lotteryProbability,
          value:"Not Eligible",
          value2:"(<1000)"
     },
     {
          title:"IDO cooldown",
          icon:idoCooldown,
          value:"Not Eligible",
          value2:"(<1000)"
     },
     {
          title:"Lock-up Period",
          icon:lockupPeriod,
          value:"7 days",
          value2:""
     },
     {
          title:"Total Staked",
          icon:totalStaked,
          value:"0",
          value2:"POLS"
     },
     {
          title:"POLS Power Gain",
          icon:polsPowerGain,
          value:"0",
          value2:"POLS POWER"
     }
];

export const polsAssets = [
     {
          title:"POLS BRONZE",
           value:"1,000+",
          percentage:"14.88%"   
     },
     {
          title:"POLS SILVER",
          value:"3,000+",
          percentage:"29.79%"
     },
     {
          title:"POLS GOLD",
          value:"10,000+",
          percentage:"51.40%",
     },
     {
          title:"POLS PLATINUM",
          value:"30,000+",
          percentage:"71.54%"
     },
     {
          title:"POLS DIAMOND",
          value:"50,000+",
          percentage:""
     }
];

export const polsDashboard = [
     {
          title:"Funds Invested",
          value:"N/A",
          icon:FundsInvested

     },
     {
          title:"POLS Staked",
          value:"N/A",
          icon: PolsStaked,
     },
     {
          title:"IDO Participated",
          value:"N/A",
          icon:IDOParticipated
     },
     {
          title:"completed Missions",
          value:"N/A",
          icon:completedMissions 
         
     }
];

export const dashboardArchievements = [
     {
          name:"Badge-1k",
          path:"/assets/images/Badge1k.png",
          about :"Staked 1000 POLS"
     },
     {
          name:"Badge-1",
          path:"/assets/images/Badge_1.png",
          about :"Participated in 1 Missions"
     }
]
export const dashboardUpcomingAchievements = [
     {
          name:"Badge-10K",
          path:"/assets/images/achievement-badges/Badge10K.webp",
          info:"Staked 10000 POLS"
     },
     {
          name:"Badge-30K",
          path:"/assets/images/achievement-badges/Badge30K.webp",
          info:"Staked 30000 POLS"
     },
     {
          name:"Badge-50K",
          path:"/assets/images/achievement-badges/Badge50K.png",
          info:"Staked 50000 POLS"
     },
     {
          name:"Badge-1Year",
          path:"/assets/images/achievement-badges/Badge1Year.webp",
          info:"Staked for 1 Years"
     },
     {
          name:"Badge-2Year",
          path:"/assets/images/achievement-badges/Badge2Year.webp",
          info:"Staked for 2 Years"
     },
     {
          name:"Badge-3Year",
          path:"/assets/images/achievement-badges/Badge3Year.webp",
          info:"Staked for 3 Years"
     },
     {
          name:"Badge-Oat",
          path:"/assets/images/achievement-badges/BadgeOAT.webp",
          info:"OAT Holder"
     },
     {
          name:"Badge-IDO_1",
          path:"/assets/images/achievement-badges/BadgeIDO.webp",
          info:"Participated in 1 IDO"
     },
     {
          name:"Badge-IDO_3",
          path:"/assets/images/achievement-badges/BadgeIDO3.webp",
          info:"Participated in 3 IDO"
     },
     {
          name:"Badge-Mission_3",
          path:"/assets/images/achievement-badges/Badge3Mission.webp",
          info:"Participated in 3 Missions"
     },
     {
          name:"Badge-IDO_5",
          path:"/assets/images/achievement-badges/BadgeIDO5.webp",
          info:"Participated in 5 IDO"
     },
     {
          name:"Badge-Mission_5",
          path:"/assets/images/achievement-badges/Badge5Mission.webp",
          info:"Participated in 5 Missions"
     },
     {
          name:"Badge-Paulie",
          path:"/assets/images/achievement-badges/BadgePaulie.webp",
          info:"Paulie Holder"
     },
     {
          name:"Badge-KYC",
          path:"/assets/images/achievement-badges/BadgeKYC.webp",
          info:"Peformed KYC"
     },
     {
          name:"Badge-PolsClub",
          path:"/assets/images/achievement-badges/BadgePOLSClub.webp",
          info:"POLS Club"
     },
     {
          name:"Badge-Beta",
          path:"/assets/images/achievement-badges/BadgeBeta.webp",
          info:"Beta Tester"
     },
     
];



export const  dashboardAllowlistTable = [
     {
          "Project name": {
               title:"Friendly Giant AI",
               imgPath:"/assets/images/projects/friendly-giant-icon.webp"
          },
          "Sale Date":{
               date:"October 29th 2025",
               time:"4:00 PM UTC",
          },

          Status:"--",
     
         
     },

     {
          "Project name": {
               title:"MemeMarket",
               imgPath:"/assets/images/projects/meme-projvect-icon.webp"
          },
          "Sale Date": {
               date:"September 27th 2025",
               time:"8:45 PM UTC"
          },
               

          Status:"Applied",

         
     },
     {
          "Project name": {
               title:"Zcash Stablecoin Protocol",
               imgPath:"/assets/images/projects/zesh-stable-coin-icon.png"
          },
          "Sale Date": {
               date:"November 7th 2025",
               time:"8:45 PM UTC"
          },
               

          Status:"--",

         
     },
    
    
     {
          "Project name": {
               title:"KeetaAI",
               imgPath:"/assets/images/allowlisted-projects/keetai.webp"
          },
          "Sale Date": {
               date:"october 30th 2025",
               time:"4:00 AM UTC"
          },
               

          Status:"Not Applied",

         
     },
     {
          "Project name": {
               title:"Zesh AI Layer",
               imgPath:"/assets/images/allowlisted-projects/zesh.webp"
          },
          "Sale Date": {
               date:"TBA",
               time:""
          },

          Status:"--",
     
       
     },
    
     
     
];

export const dashboardHelpQuestions = [
     {
         question:" What is the POLS token?",
         answer:"The POLS token is an integral part of the Polkastarter ecosystem and IDO process in particular. Owning POLS tokens gives community members greater chances of being successfully selected to participate in an upcoming IDO. The more you own, the greater your",
         path:"/assets/images/what-is-pols-token.webp"
     },
     {
          question:"How to Participate",
          answer:" A good place to start is: what is Polkastarter? (We'll give you the brief version). Polkastarter is a platform that connects the young projects with early community members through initial decentralized offerings or IDOs. During an IDO, a project will distribute tokens to community members (aka IDO participants) in exchange for",
          path:"/assets/images/how-to-participate.webp"
      },
      {
          question:"How to get allowlisted",
          answer:"Each ticket equals 1000 POLS. For every 1000 more POLS you own, you'll receive 1 more ticket. So, if you have 750 POLS in your wallet, you'll have 3 tickets to your 'name' for when you submit for an allowlist. Allowlists cheose addresses at random, so if your address",
          path:"/assets/images/how-to-get-allowlisted.webp",
      },
      {
          question:"What is KYC",
          answer:"Time to dive deeper into the practical reality of what goes into conducting KYC for IDOs on Polkastarter and give you a brief on how some of our projects approach KYC.",
          path:"/assets/images/what-is-kyc.webp",
      },

];


export const UpcomingProjects = [

     {
          name: "Friendly Giant AI",
          backgroundImage: "/assets/images/projects/frindly-giant-cover.webp",
          icon: "/assets/images/projects/friendly-giant-icon.webp",
          cointypeIcon: "base", 
          about: "First sentient AI-Agent live on Roblox, Web2 and Web3. Built on Base and DeepSeek",
          FundRaiseValue: "$200,000",
          maxAllocation: "TBA",
          status: "ALLOWLIST OPEN",
          date: "november 9th 2025",
          time:"4:00 PM UTC",
          dateStatement: "Allowlist closes in",
          tokenPrice:"$0.00625",
          RaiseToken:"USDC on Ethereum",
          participants:12,
          salePercentage: "18%"
   
        },
     {
          name: "MemeMarket",
          backgroundImage: "/assets/images/projects/meme-cover.webp",
          icon: "/assets/images/projects/meme-projvect-icon.webp",
          cointypeIcon: "bnb", 
          about: "The First AI-Powered Prediction Market for Meme Coins on Solana",
          FundRaiseValue: "$250,000",
          maxAllocation: "TBA",
          status: "ALLOWLIST CLOSED",
          date: "November 2nd 2025",
          time:"8:45 PM UTC",
          dateStatement: "Allowlist closes in",
          tokenPrice:"$0.012",
          RaiseToken:"USDC on BNB",
          participants:12,
          salePercentage: "18%"
   
        },

        {
          name: "Zcash Stablecoin Protocol",
          backgroundImage: "/assets/images/projects/zesh-stablecoin-background.png",
          icon: "/assets/images/projects/zesh-stable-coin-icon.png",
          cointypeIcon: "ethereum", 
          about: "The first ZK privacy stablecoin protocol collateralized 1:1 by $ZEC.",
          FundRaiseValue: "$200,000",
          maxAllocation: "TBA",
          status: "ALLOWLIST OPEN",
          date: "November 7th 2025",
          time:"8:45 PM UTC",
          dateStatement: "Allowlist OPEN",
          tokenPrice:"$0.00175",
          RaiseToken:"USDC on Ethereum",
          participants:21,
          salePercentage: "28%"

   
        },
    
     {
          name: "KeetaAI",
          backgroundImage: "/assets/images/projects/keetaibg.webp",
          icon: "/assets/images/allowlisted-projects/keetai.webp",
          cointypeIcon: "base", 
          about: "KeetaAI is all-in-one AI stack on Keeta Network",
          FundRaiseValue: "$200,000",
          maxAllocation: "TBA",
          status: "ALLOWLIST OPEN",
          date: "August 26th 2025",
          time:"4:00 AM UTC",
          dateStatement: "Allowlist closed on",
          tokenPrice:"$0.00175",
          RaiseToken:"USDC on Ethereum",
          participants:18,
          salePercentage: "16%"

   
        },

     {
       name: "Zesh AI Layer",
       backgroundImage: "/assets/images/projects/zeshlayerbg.webp",
       icon: "/assets/images/allowlisted-projects/zesh.webp",
       cointypeIcon: "ethereum", // changed from ProjectCoinEthereum
       about: "Powering Web3 Evolution",
       FundRaiseValue: "$100,000",
       maxAllocation: "TBA",
       status: "ALLOWLIST CLOSED",
       date:"",
       time:"",
       tokenPrice:"$0.006",
       RaiseToken:"USDC on Ethereum",
       participants:22,
       salePercentage: "12%"
     }
   ];

export const FundedProjects = [
     {
          title:"Funded Projects",
          value: "137",
          icon: FundedProjectIcons
     },
     {
          title:"Unique Participants",
          value: "141,167",
          icon: UniqueParticipants,
     },
     {
          title:"Raised Capitals",
          value: "$45,472,502.04",
          icon: RaisedCapitals
     },
];


export const  projectTableElement = [
     
     {
          "Project name": {
               title:"Project Merlin ",
               currency:"$MRLN",
               imgPath:"/assets/images/allowlisted-projects/merlin.png"
          },
          Type:"Token Sale",

          Participants:"193",

          "Raising Goal":"$300,000",
          "ATH since IDO":"TBA",
          "Ended In": {
               date:"September 15th 2025",
               time:"1:38AM - UTC"
          },
          chains:Arbitrum

     },

     {
          "Project name": {
               title:"CHIPS Protocol",
               currency:"$CHIPS",
               imgPath:"/assets/images/allowlisted-projects/chipslogo.webp"
          },
          Type:"Token Sale",

          Participants:"115",

          "Raising Goal":"$500,000",
          "ATH since IDO":"+33%",
          "Ended In": {
               date:"August 12th 2025",
               time:"4:00PM - UTC"
          },
          chains:BNB

     },

     {
          "Project name": {
               title:"Grand Gangsta City",
               currency:"$GGC",
               imgPath:"/assets/images/projects/gangster-.webp"
          },
          Type:"Token Sale",

          Participants:"53",

          "Raising Goal":"$180,000",
          "ATH since IDO":"+163%",
          "Ended In": {
               date:"July 23rd 2025",
               time:"4:00PM - UTC"
          },
          chains:Sei

     },
     {
          "Project name": {
               title:"WAGMI HUB",
               currency:"$INFOFI",
               imgPath:"/assets/images/projects/Wagmilogo.svg"
          },
          Type:"Token Sale",

          Participants:"136",

          "Raising Goal":"$100,000",
          "ATH since IDO":"TBA",
          "Ended In": {
               date:"JUNE 22nd 2025",
               time:"3:44PM - UTC"
          },
          chains:BNB

     },
     {
          "Project name": {
               title:"AI Dev Agent",
               currency:"$AIDEV",
               imgPath:"/assets/images/projects/AI dev agent.webp"
          },
          Type:"Token Sale",

          Participants:"62",

          "Raising Goal":"$100,000",
          "ATH since IDO":"+65%",
          "Ended In": {
               date:"MAY 21st 2025",
               time:"4:00PM - UTC"
          },
          chains:ProjectCoinBase,

     },
     {
          "Project name": {
               title:"Hydro:The RWA DePIN Protocol",
               currency:"$SUIRWAPIN",
               imgPath:"/assets/images/projects/hydro-projects.webp"
          },
          Type:"Token Sale",

          Participants:"112",

          "Raising Goal":"$200,000",
          "ATH since IDO":"+14%",
          "Ended In": {
               date:"MAY 15th 2025",
               time:"10:00AM - UTC"
          },
          chains:Ethereum,

     },
     
     {
          "Project name": {
               title:"aiSUI",
               currency:"$SUIAGENT",
               imgPath:"/assets/images/projects/AI_SUI.webp"
          },
          Type:"Token Sale",

          Participants:"180",

          "Raising Goal":"$100,000",
          "ATH since IDO":"+66%",
          "Ended In": {
               date:"MAY 14th 2025",
               time:"11:00AM - UTC"
          },
          chains:Ethereum,

     },
     {
          "Project name": {
               title:"AgentWood",
               currency:"$AWS",
               imgPath:"/assets/images/projects/agent_wood.webp"
          },
          Type:"Token Sale",

          Participants:"192",

          "Raising Goal":"$150,000",
          "ATH since IDO":"+10%",
          "Ended In": {
               date:"March 4th 2025",
               time:"11:08AM - UTC"
          },
          chains:ProjectCoinBase,

     },
     {
          "Project name": {
               title:"XO",
               currency:"$XOXO",
               imgPath:"/assets/images/projects/xo-project.webp"
          },
          Type:"Token Sale",

          Participants:"313",

          "Raising Goal":"$100,000",
          "ATH since IDO":"+422%",
          "Ended In": {
               date:"February 17th 2025",
               time:"10:10AM - UTC"
          },
          chains:ProjectCoinBase,

     },
     {
          "Project name": {
               title:"Alvalanche DeFAI Agents",
               currency:"$AVAXAI",
               imgPath:"/assets/images/projects/avalnche-project.webp"
          },
          Type:"Token Sale",

          Participants:"452",

          "Raising Goal":"$100,000",
          "ATH since IDO":"+137%",
          "Ended In": {
               date:"January 25th 2025",
               time:"11:18PM - UTC"
          },
          chains:BNB

     },
     {
          "Project name": {
               title:"SocialGrowAI",
               currency:"$GrowAI",
               imgPath:"/assets/images/projects/social-growth-AI.webp"
          },
          Type:"Token Sale",

          Participants:"628",

          "Raising Goal":"$500,000",
          "ATH since IDO":"+19%",
          "Ended In": {
               date:"January 24th 2025",
               time:"10:28PM - UTC"
          },
          chains:Ethereum

     },
     {
          "Project name": {
               title:"Ondo DeFAI",
               currency:"$ONDOAI",
               imgPath:"/assets/images/projects/ondo-defi.webp"
          },
          Type:"Token Sale",

          Participants:"573",

          "Raising Goal":"$100,000",
          "ATH since IDO":"+129%",
          "Ended In": {
               date:"January 23rd 2025",
               time:"6:49PM - UTC"
          },
          chains:Ethereum

     },
     {
          "Project name": {
               title:"Lympid",
               currency:"$LYP",
               imgPath:"/assets/images/projects/Lympid.webp"
          },
          Type:"Token Sale",

          Participants:"720",

          "Raising Goal":"$250,000",
          "ATH since IDO":"+134%",
          "Ended In": {
               date:"January 22nd 2025",
               time:"2:05PM - UTC"
          },
          chains:ProjectCoinBase

     },
     {
          "Project name": {
               title:"BNB Agents",
               currency:"$BNBAI",
               imgPath:"/assets/images/projects/BNB AGENT.webp"
          },
          Type:"Token Sale",

          Participants:"430",

          "Raising Goal":"$400,000",
          "ATH since IDO":"+312%",
          "Ended In": {
               date:"January 20th 2025",
               time:"3:02PM - UTC"
          },
          chains:BNB

     },
     {
          "Project name": {
               title:"Henjin AI",
               currency:"$HENAI",
               imgPath:"/assets/images/projects/HEINJIN-Ai.webp"
          },
          Type:"Token Sale",

          Participants:"628",

          "Raising Goal":"$400,000",
          "ATH since IDO":"TBA",
          "Ended In": {
               date:"January 9th 2025",
               time:"2:02PM - UTC"
          },
          chains:ProjectCoinBase,

     },
];

export const Missions = [

     {
          title:"Polkastarter",
          iconImage:"/assets/images/Missions/polkastarter-mission.jpg",
          status:"No End Date",
          coverImage:"/assets/images/Missions/cover_quest_onboarding_1_1_a67c92ee4d.webp",
          toDo:"onboarding",
          functions: [
               "Pols power boost"
          ],   
     },

     {
          title:"Zoth",
          iconImage:"/assets/images/Missions/zoth-mission.png",
          status:"QUEST ENDED",
          coverImage:"/assets/images/Missions/zoth-missioncover.png",
          toDo:"Explore Zoth on testnet",
          functions: [
               "token",
               "pols power boost",
               "external",
          ],   
     },

     {
          title:"EARN'M",
          iconImage:"/assets/images/Missions/earn'm-mission.jpg",
          status:"QUEST ENDED",
          coverImage:"/assets/images/Missions/earn'm-missioncover.webp",
          toDo:"Explore EARN'M Reward Ecosystem",
          functions: [
               "Pols power boost",
               "Guaranteed Allocation"
          ],  

     }
];

export const polkastarterMissionPaticipants = [
     "/assets/images/Missions/avatar-user.png",
     "/assets/images/Missions/mission-user.png",
     "/assets/images/Missions/avatar-gradient-user.png",
]
