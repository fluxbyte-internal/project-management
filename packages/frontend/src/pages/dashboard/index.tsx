import PieChart, { ChartProps } from "@/components/charts/PieChart";
import Table, { ColumeDef } from "@/components/shared/Table";

function Dasboard() {
const chartProp1:ChartProps = { 
    chartData : [{value: 45,name: 'Project Data'}, {value: 45,name: 'Local Data'},{value: 45,name: 'Universal Data'}]  
    ,color: [
      '#FFD04A',
      '#FFB819',
      '#B74E06',
  ],
  title:"Projects per Status"
  
 }
 const chartProp2:ChartProps = { 
   chartData : [{value: 145,name: 'Project Data'}, {value: 45,name: 'Local Data'},{value: 45,name: 'Universal Data'}]
    ,color: [
    '#FFD04A',
    '#FFB819',
    '#B74E06',
  ],
  title: 'Project with Delays'
 }

 const chartProp3:ChartProps = { 
    chartData : [{value: 75,name: 'Project Data'}, {value: 45,name: 'Local Data'},{value: 45,name: 'Universal Data'}]
    ,color: [
    '#FFD04A',
    '#FFB819',
    '#B74E06',
  ],
 title: 'Projects per Overall Situation' 
 }
 
 const chartProp4:ChartProps = { 
    chartData : [{value: 58,name: 'Project Data'}, {value: 45,name: 'Local Data'},{value: 45,name: 'Universal Data'}]
    ,color: [
    '#FFD04A',
    '#FFB819',
    '#B74E06',
  ]
  ,title: 'Projects per Severity'
 }



  const columnDef: ColumeDef[] = [
    { key: "projectName", header: "Project Name"},
    // {
    //   key: "createdByUser",
    //   header: "Manager",
    //   onCellRender: (item: Project) => (
    //     <>
    //       <UserAvatar user={item.createdByUser}/>
    //     </>
    //   ),
    // },
    // {
    //   key: "status",
    //   header: "Status",
    //   onCellRender: (item: Project) => (
    //     <>
    //       <div className="w-32 h-8 px-3 py-1.5 bg-cyan-100 rounded justify-center items-center gap-px inline-flex">
    //         <div className="text-cyan-700 text-xs font-medium leading-tight">
    //           {item.status}
    //         </div>
    //       </div>
    //     </>
    //   ),
    // },
    // {
    //   key: "startDate",
    //   header: "Start Date",
    //   sorting: true,
    //   onCellRender: (item: Project) => (
    //     <>{dateFormatter(new Date(item.startDate))}</>
    //   ),
    // },
    // {
    //   key: "actualEndDate",
    //   header: "End Date",
    //   onCellRender: (item: Project) => (
    //     <>{item.estimatedEndDate && dateFormatter(new Date(item.estimatedEndDate))}</>
    //   ),
    // },
    // {
    //   key: "progress",
    //   header: "Progress",
    //   onCellRender: (item: Project) => (
    //     <PercentageCircle percentage={item.progressionPercentage} />
    //   ),
    // },
    {
      key: "estimatedBudget",
      header: "Status",
     
    },
    {
      key: "estimatedBudget",
      header: "Budget",
     
    },
    {
      key: "estimatedBudget",
      header: "Joining Date",
     
    },
    // {
    //   key: "Action",
    //   header: "Action",

    // },
  ];

    return(
      <>
      <div className="overflow-auto w-full py-2 mt-10 px-2 lg:px-14 flex flex-col gap-10"> 
  
    <div className=" w-full h-full flex flex-col lg:flex-row justify-center items-center gap-6 py-2 ">
      <div className="bg-gradient-to-r from-gray-500 to-gray-400  rounded-2xl   w-full h-full justify-center items-center flex gap-2 backdrop-filter backdrop-blur-md bg-opacity-60 border border-gray-300  "> 
     <PieChart chartProps={chartProp1}/>
      </div>
    
      <div className="bg-gradient-to-r from-gray-400 to-gray-300  rounded-2xl  w-full h-full justify-center items-center  flex gap-2 backdrop-filter backdrop-blur-md bg-opacity-60 border border-gray-300"> 
     <PieChart chartProps={chartProp2} />
      </div>
      <div className="bg-gradient-to-r from-gray-300 to-gray-200  rounded-2xl  w-full h-full justify-center items-center  flex gap-2 backdrop-filter backdrop-blur-md bg-opacity-60 border border-gray-200"> 
     <PieChart chartProps={chartProp3}/>
      </div>
      <div className="bg-gradient-to-r from-gray-100 to-gray-50  rounded-2xl  w-full h-full justify-center items-center  flex gap-2 backdrop-filter backdrop-blur-md bg-opacity-60 border border-gray-100"> 
     <PieChart chartProps={chartProp4}/>
      </div>  
      
      
         </div>

<div className="w-full h-full">
  <Table 
        key="ProjectList view"
        columnDef={columnDef}
        data={[]}
  />
</div>
      </div>
      </>
    );
}
export default Dasboard;