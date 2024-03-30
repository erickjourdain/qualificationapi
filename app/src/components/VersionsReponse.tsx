import React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

type VersionReponseType = {
  versions: string[];
  initialVersion: string;
  onVersionChange: (ver: string) => void;
};

const VersionReponse = ({ versions, initialVersion, onVersionChange }: VersionReponseType) => {
  // State: version
  const [version, setVersion] = useState<string>(initialVersion);

  return (
    <Box display="flex" justifyContent="flex-end">
      <FormControl sx={{ minWidth: 100 }} size="small">
        <InputLabel id="reponse-versions-select-label">Version</InputLabel>
        <Select
          labelId="reponse-versions-select-label"
          id="reponse-versions-select"
          value={version}
          label="Version"
          onChange={(evt: SelectChangeEvent) => {
            setVersion(evt.target.value);
            onVersionChange(evt.target.value);
          }}
        >
          {versions.map((ver) => (
            <MenuItem value={ver} key={ver}>
              {ver}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default VersionReponse;
