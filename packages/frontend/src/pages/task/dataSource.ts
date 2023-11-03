import {
  GanttChartTaskColumn,
  KanbanColumn,
  KanbanDataSource,
  SchedulerEvent,
  TableColumn
} from "smart-webcomponents-react";
export const dataSource: KanbanDataSource  []  = [
  {
    id: 1,
    color: "red",
    text: "Task View",
    userId:1,
    comments: [{ text: "comment text", userId: 2, time: new Date(), },],
    startDate: new Date(),
    checklist: [{ completed: false, text: "completed", },],
    status: "toDo",
    picture:"https://upload.wikimedia.org/wikipedia/commons/8/83/Edgar_Degas_-_At_the_Races.jpg",
    paintings:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Edgar_Degas_-_The_Ballet_Class_-_Google_Art_Project.jpg/522px-Edgar_Degas_-_The_Ballet_Class_-_Google_Art_Project.jpg,https://upload.wikimedia.org/wikipedia/commons/8/83/Edgar_Degas_-_At_the_Races.jpg",
    Bio: 'Michelangelo di Lodovico Buonarroti Simoni or more commonly known by his first name Michelangelo was an Italian sculptor, painter',
  },
  {
    id: 3,
    color: "green",
    text: "Task View",
    comments: [{ text: "comment text", userId: 1, time: new Date(), },],
    startDate: new Date(),
    checklist: [{ completed: false, text: "completed", },],
    status: "inProgress",
  },
  {
    id: 2,
    color: "red",
    text: "Task View",
    comments: [{ text: "comment text", userId: 2, time: new Date(), },],
    startDate: new Date(),
    checklist: [{ completed: false, text: "completed", },],
    status: "inProgress",
    
  },
];
export const taskCustomFields = [
  {
    label: "Paintings",
    dataField: "paintings",
    image: true,
  },
  {
    label: "Picture",
    dataField: "picture",
    dataType:"",
    image: true,

  },
  {
    label: "Bio",
    dataField: "Bio",

  },
  {
    label: "Sub Task",
    dataField: "subtask",
  },
  {
    label: "Died",
    dataField: "Died",
  },
  {
    label: "Country",
    dataField: "Country",
  },
];

/* Sets the task custom fields displayed in the card. Each array item should have 'dataField', 'label' 'dataType' and optionally 'visible', 'image' and 'cover' properties. The 'dataField' determines the value, the label is displayed as title, 'dataType' is used for formatting and 'visible' determines whether the field will be displayed. If your string represents an image either URL or Base64, set image: true. If you want to display that image as a cover image, set cover:true, too.*/
export const kanbanColumn: KanbanColumn[] = [
  {
    label: "To do",
    dataField: "toDo",
  },
  {
    label: "In progress",
    dataField: "inProgress",
  },
  {
    label: "Testing",
    dataField: "testing",
  },
  {
    label: "Done",
    dataField: "done",
  },
];

export const ganntDataSource = [
  {
    label: "PRD & User-Stories",
    dateStart: "2021-01-10",
    dateEnd: "2021-03-10",
    class: "product-team",
    type: "task",
  },
  {
    label: "Persona & Journey",
    dateStart: "2021-03-01",
    dateEnd: "2021-04-30",
    class: "marketing-team",
    type: "task",
  },
  {
    label: "Architecture",
    dateStart: "2021-04-11",
    dateEnd: "2021-05-16",
    class: "product-team",
    type: "task",
  },
  {
    label: "Prototyping",
    dateStart: "2021-05-17",
    dateEnd: "2021-07-01",
    class: "dev-team",
    type: "task",
  },
  {
    label: "Design",
    dateStart: "2021-07-02",
    dateEnd: "2021-08-01",
    class: "design-team",
    type: "task",
  },
  {
    label: "Development",
    dateStart: "2021-08-01",
    dateEnd: "2021-09-10",
    class: "dev-team",
    type: "task",
  },
  {
    label: "Testing & QA",
    dateStart: "2021-09-11",
    dateEnd: "2021-10-10",
    class: "qa-team",
    type: "task",
  },
  {
    label: "UAT Test",
    dateStart: "2021-10-12",
    dateEnd: "2021-11-11",
    class: "product-team",
    type: "task",
  },
  {
    label: "Handover & Documentation",
    dateStart: "2021-10-17",
    dateEnd: "2021-11-31",
    class: "marketing-team",
    type: "task",
  },
  {
    label: "Release",
    dateStart: "2021-11-01",
    dateEnd: "2021-12-31",
    class: "release-team",
    type: "task",
  },
];

export const taskColumns: GanttChartTaskColumn[] = [
  {
    label: "Tasks",
    value: "label",
    size: "60%",
  },
  {
    label: "Duration (hours)",
    value: "duration",
  },
];

export const calendarDatasource: SchedulerEvent[] = [
  {
    label: "Brochure Design Review",
    dateStart: new Date(2023, 11, 10, 13, 15),
    dateEnd: new Date(2023, 11, 12, 16, 15),
    status: "tentative",
    class: "event",
  },
  {
    label: "Website Re-Design Plan",
    dateStart: new Date(2023, 11, 16, 16, 45),
    dateEnd: new Date(2023, 11, 18, 11, 15),
    class: "event",
  },
  {
    label: "Update Sales Strategy Documents",
    dateStart: new Date(2023, 11, 2, 12, 0),
    dateEnd: new Date(2023, 11, 2, 13, 45),
    class: "event",
    repeat: {
      repeatFreq: "daily",
      repeatInterval: 2,
      repeatEnd: 5,
      exceptions: [
        {
          Date: new Date(2023, 11, 4, 12, 0),
          DateStart: new Date(2023, 11, 5),
          DateEnd: new Date(2023, 11, 6),
          backgroundColor: "#F06292",
          color: "red",
          hidden: false,
        },
        {
          Date: new Date(2023, 11, 8, 12, 0),
          DateStart: new Date(2023, 11, 9),
          DateEnd: new Date(2023, 11, 10),
          color: "red",
          hidden: false,
          backgroundColor: "#FFA000",
        },
      ],
    },
  },
  {
    label: "Non-Compete Agreements",
    dateStart: new Date(2023, 11, 2 - 1, 8, 15),
    dateEnd: new Date(2023, 11, 2 - 1, 9, 0),
    status: "outOfOffice",
    class: "event",
  },
  {
    label: "Approve Hiring of John Jeffers",
    dateStart: new Date(2023, 11, 2 + 1, 10, 0),
    dateEnd: new Date(2023, 11, 2 + 1, 11, 15),
    notifications: [
      {
        interval: 1,
        type: "days",
        time: [1, 10,],
        message: "Approve Hiring of John Jeffers tomorrow",
        iconType: "success",
      },
    ],
    status: "busy",
    class: "event",
  },
  {
    label: "Update NDA Agreement",
    dateStart: new Date(2023, 11, 2 - 2, 11, 45),
    dateEnd: new Date(2023, 11, 2 - 2, 13, 45),
    class: "event",
  },
  {
    label: "Update Employee Files with New NDA",
    dateStart: new Date(2023, 11, 2 + 2, 14, 0),
    dateEnd: new Date(2023, 11, 2 + 2, 16, 45),
    class: "event",
  },
  {
    label: "Compete Agreements",
    dateStart: new Date(2023, 11, 2, 1, 10 + 15),
    dateEnd: new Date(2023, 11, 2, 1 + 1, 45),
    notifications: [
      {
        interval: 0,
        type: "days",
        time: [1, 10 + 1,],
        message: "Compete Agreements in 15 minutes",
        iconType: "time",
      },
      {
        interval: 0,
        type: "days",
        time: [1, 10 + 2,],
        message: "Compete Agreements in 14 minutes",
        iconType: "warning",
      },
    ],
    status: "outOfOffice",
    class: "event",
  },
  {
    label: "Approve Hiring of Mark Waterberg",
    dateStart: new Date(2023, 11, 2 + 3, 10, 0),
    dateEnd: new Date(2023, 11, 2 + 3, 11, 15),
    status: "busy",
    class: "event",
  },
  {
    label: "Update Employees Information",
    dateStart: new Date(2023, 11, 2, 14, 0),
    dateEnd: new Date(2023, 11, 2, 16, 45),
    class: "event",
    repeat: {
      repeatFreq: "weekly",
      repeatInterval: 2,
      repeatOn: [2, 4,],
      repeatEnd: new Date(2021, 5, 24),
    },
  },
  {
    label: "Prepare Shipping Cost Analysis Report",
    dateStart: new Date(2023, 11, 2 + 1, 12, 30),
    dateEnd: new Date(2023, 11, 2 + 1, 13, 30),
    class: "event",
    repeat: {
      repeatFreq: "monthly",
      repeatInterval: 1,
      repeatOn: [new Date(2023, 11, 2 + 1),],
    },
  },
  {
    label: "Provide Feedback on Shippers",
    dateStart: new Date(2023, 11, 2 + 1, 14, 15),
    dateEnd: new Date(2023, 11, 2 + 1, 16, 0),
    status: "tentative",
    class: "event",
  },
  {
    label: "Complete Shipper Selection Form",
    dateStart: new Date(2023, 11, 2 + 1, 8, 30),
    dateEnd: new Date(2023, 11, 2 + 1, 10, 0),
    class: "event",
  },
  {
    label: "Upgrade Server Hardware",
    dateStart: new Date(2023, 11, 2 + 1, 12, 0),
    dateEnd: new Date(2023, 11, 2 + 1, 14, 15),
    class: "event",
  },
  // {
  // 	label: 'Upgrade Apps to Windows RT or stay with WinForms',
  // 	dateStart: new Date(2023, 11, 2 + 2, 1, 10 + 5),
  // 	dateEnd: new Date(2023, 11, 2 + 2, 1 + 2),
  // 	status: 'tentative',
  // 	class: 'event',
  // 	repeat: {
  // 		repeatFreq: 'daily',
  // 		repeatInterval: 1,
  // 		repeatOn: 2 + 1,
  // 		repeatEnd: new Date(2023, 11, 2 + 7),
  // 		exceptions: [{
  // 			date: new Date(2023, 11, 2 + 4, 10, 30),
  // 			label: 'A day off work',
  // 			status: 'busy',
  // 			backgroundColor: '#64DD17'
  // 		}]
  // 	},
  // 	notifications: [{
  // 		interval: 2,
  // 		type: 'days',
  // 		time: [1, 10],
  // 		message: 'Upgrade Apps to Windows RT in 5 minutes',
  // 		iconType: 'time'
  // 	}],
  // },
  {
    label: "Peter's Birthday",
    dateStart: new Date(2023, 11, 5),
    dateEnd: new Date(2023, 11, 6),
    class: "birthday",
  },
  {
    label: "Michael's Brithday",
    dateStart: new Date(2023, 11, 10),
    dateEnd: new Date(2023, 11, 11),
    class: "birthday",
  },
  {
    label: "Christina's Birthday",
    dateStart: new Date(2023, 11, 20),
    dateEnd: new Date(2023, 11, 21),
    class: "birthday",
  },
  {
    label: "Halloween",
    dateStart: new Date(2023, 9, 31),
    dateEnd: new Date(2023, 9, 32),
    class: "holiday",
  },
  {
    label: "Marry Christmas",
    dateStart: new Date(2023, 11, 24),
    dateEnd: new Date(2023, 11, 26, 23, 59, 59),
    class: "holiday",
  },
  {
    label: "new Date()",
    dateStart: new Date(),
    dateEnd: new Date(2023, 10, new Date().getDate() + 1),
    class: "holiday",
  },
  {
    label: "Day after new Date()",
    dateStart: new Date(2023, 10, new Date().getDate() + 1),
    dateEnd: new Date(2023, 10, new Date().getDate() + 2),
    class: "holiday",
  },
  {
    label: "Indipendence Day",
    dateStart: new Date(2023, 6, 4),
    dateEnd: new Date(2023, 6, 5),
    class: "holiday",
  },
  {
    label: "New Year's Eve",
    dateStart: new Date(2023, 11, 31),
    dateEnd: new Date(2023 + 1, 0, 1),
    class: "holiday",
  },
];

export const TableColumnData: TableColumn[] = [
  {
    label: "id",
    dataField: "id",
    dataType: "number",
    allowEdit: false,
  },
  {
    label: "text",
    dataField: "text",
    dataType: "string",
  },
  {
    label: "startDate",
    dataField: "startDate",
    dataType: "date",
  },
  {
    label: "Quantity",
    dataField: "comments",
    dataType: "number",
  },
  {
    label: "Status",
    dataField: "status",
    dataType: "string",
  },
];
// {
//   id: 3,
//   color: "red",
//   text: "Task View",
//   comments: [{ text: "comment text", userId: 2, time: new Date() }],
//   startDate: new Date(),
//   checklist: [{ completed: false, text: "completed" }],
//   status: "inProgress",
// }
