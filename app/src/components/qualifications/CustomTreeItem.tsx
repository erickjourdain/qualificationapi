import React from "react";
import Chip from "@mui/material/Chip";
import { TreeItem2, TreeItem2Label, TreeItem2Props } from "@mui/x-tree-view/TreeItem2";
import Stack from "@mui/material/Stack";


interface CustomLabelProps {
  children: string;
}

function CustomLabel(props: CustomLabelProps) {
  const { children, ...other } = props;
  const question = children.split("|")[0];
  const reponse = children.split("|")[1];
  const refResponse = children.split("|")[2] || undefined;
  const rep = (reponse.trim() !== 'null' && reponse.trim() !== '')
    ? ((refResponse === undefined)
      ? <Chip label={reponse} color="primary" />
      : <>
        <Chip label={reponse} sx={{ mr: 2}} color="primary" />
        <Chip label={refResponse} color="warning" variant="outlined"/>
      </>
    )
    : "";

  return (
    <TreeItem2Label {...other}>
      {question} {rep}
    </TreeItem2Label>
  );
}

const CustomTreeItem = React.forwardRef((
  props: TreeItem2Props,
  ref: React.Ref<HTMLLIElement>) => {
  return (
    <TreeItem2
      ref={ref}
      {...props}
      slots={{
        label: CustomLabel,
      }}
    />
  );
});

export default CustomTreeItem;