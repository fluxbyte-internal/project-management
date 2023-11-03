import { Table, TableProps } from 'smart-webcomponents-react/table';

function ListView(props:TableProps) {
  return (
    <div>
      <Table
        id="table"
        dataSource={props.dataSource}
        dataSourceSettings={props.dataSourceSettings}
        editing={props.editing}
        keyboardNavigation={props.keyboardNavigation}
        sortMode={props.sortMode}
        columns={props.columns}
      ></Table>
    </div>
  );
}

export default ListView;
