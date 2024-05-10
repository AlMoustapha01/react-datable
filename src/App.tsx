import { users } from "./data/users";
import { Datatable } from "./components/Datatable";
import { CellContext } from "@tanstack/react-table";
import { Column } from "./components/Columns";
import moment from "moment";

const RenderRole = (text: string) => {
  if (text === "admin") {
    return (
      <span className="text-red-500 p-1 bg-red-200 rounded-md">{text}</span>
    );
  }

  if (text === "editor") {
    return (
      <span className="text-green-500 p-1 bg-green-200 rounded-md">{text}</span>
    );
  }
  if (text === "viewer") {
    return (
      <span className="text-yellow-500 p-1 bg-yellow-200 rounded-md">
        {text}
      </span>
    );
  }

  return (
    <span className="text-blue-500 p-1 bg-blue-200 rounded-md">Guest</span>
  );
};

const RenderDate = (text: string) => {
  const date = new Date(text);

  return <span>{moment(date).format("DD/MM/YYYY")}</span>;
};

const columnData: Column[] = [
  {
    key: "id",
    title: "ID",
  },
  {
    key: "name",
    title: "Name",
    sortable: true,
  },
  {
    key: "email",
    title: "Email",
    template: (info: CellContext<any, any>) => (
      <a className="text-blue-500" href="mailto:{{email}}">
        {info.getValue()}
      </a>
    ),
    sortable: true,
    meta: {
      filterVariant: "text",
      type: "string",
    },
  },
  {
    key: "phone",
    title: "Phone",
  },
  {
    key: "role",
    title: "Role",
    sortable: true,
    template: (info: CellContext<any, any>) => RenderRole(info.getValue()),
    meta: {
      filterVariant: "select",
      type: "enum",
      selectRowsData: [
        { value: "admin", label: "Admin" },
        { value: "editor", label: "Editor" },
        { value: "viewer", label: "Viewer" },
      ],
    },
  },
  {
    key: "createdDate",
    title: "Joint at",
    sortable: true,
    template: (info: CellContext<any, any>) => RenderDate(info.getValue()),
    meta: {
      filterVariant: "range",
      type: "date",
      format: "dd/MM/yyyy",
    },
  },
];

const pineableCol = columnData.map((col) => {
  return {
    ...col,
    pinnable: true,
    filterable: true,
  };
});

export default function App() {
  return <Datatable columnData={pineableCol} data={users} pinnable resizable enablePagination enableColumVisibility wrapperClassName="max-w-5xl mx-auto" />;
}
