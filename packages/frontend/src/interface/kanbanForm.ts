import { KanbanDataSource } from "smart-webcomponents-react"
import { Column } from "./customeEvent"

export interface KanbanForm{
    purpose:string | undefined
    FormData:KanbanDataSource |undefined
    column:Column |undefined

}