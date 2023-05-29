import React from 'react';
import {DataGrid, GridCellModes, ruRU} from "@mui/x-data-grid";
import {Box, Button} from "@mui/material";

function EditToolbar(props) {
    const {selectedCellParams, cellMode, cellModesModel, setCellModesModel} = props;

    const handleSaveOrEdit = () => {
        if (!selectedCellParams) {
            return;
        }
        const {id, field} = selectedCellParams;

        if (cellMode === 'edit') {
            setCellModesModel({
                ...cellModesModel,
                [id]: {...cellModesModel[id], [field]: {mode: GridCellModes.View}},
            });
        } else {
            setCellModesModel({
                ...cellModesModel,
                [id]: {...cellModesModel[id], [field]: {mode: GridCellModes.Edit}},
            });
        }
    };

    const handleCancel = () => {
        if (!selectedCellParams) {
            return;
        }
        const {id, field} = selectedCellParams;
        setCellModesModel({
            ...cellModesModel,
            [id]: {
                ...cellModesModel[id],
                [field]: {mode: GridCellModes.View, ignoreModifications: true},
            },
        });
    };

    const handleMouseDown = (event) => {
        event.preventDefault();
    };

    return (
        <Box
            sx={{
                borderBottom: 1,
                borderColor: 'divider',
                p: 1,
            }}
        >
            <Button
                onClick={handleSaveOrEdit}
                onMouseDown={handleMouseDown}
                disabled={!selectedCellParams}
                variant="outlined"
            >
                {cellMode === 'edit' ? 'Сохранить' : 'Изменить'}
            </Button>
            <Button
                onClick={handleCancel}
                onMouseDown={handleMouseDown}
                disabled={cellMode === 'view'}
                variant="outlined"
                sx={{ml: 1}}
            >
                Отмена
            </Button>
        </Box>
    );
}

export const Table = ({columns, rows, saveOrUpdate}) => {
    const [selectedCellParams, setSelectedCellParams] = React.useState(null);
    const [cellModesModel, setCellModesModel] = React.useState({});

    const handleCellFocus = React.useCallback((event) => {
        const row = event.currentTarget.parentElement;
        const id = row.dataset.id;
        const field = event.currentTarget.dataset.field;
        setSelectedCellParams({id, field});
    }, []);

    const cellMode = React.useMemo(() => {
        if (!selectedCellParams) {
            return 'view';
        }
        const {id, field} = selectedCellParams;
        return cellModesModel[id]?.[field]?.mode || 'view';
    }, [cellModesModel, selectedCellParams]);

    const handleCellKeyDown = React.useCallback(
        (params, event) => {
            if (cellMode === 'edit') {
                event.defaultMuiPrevented = true;
            }
        },
        [cellMode],
    );

    return (
        <DataGrid
            rows={rows}
            columns={columns}

            localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}

            processRowUpdate={saveOrUpdate}
            onCellKeyDown={handleCellKeyDown}
            cellModesModel={cellModesModel}
            onCellModesModelChange={(model) => setCellModesModel(model)}
            slots={{
                toolbar: EditToolbar,
            }}
            slotProps={{
                toolbar: {
                    cellMode,
                    selectedCellParams,
                    setSelectedCellParams,
                    cellModesModel,
                    setCellModesModel
                },
                cell: {
                    onFocus: handleCellFocus,
                },
            }}

            sx={{
                height: '80vh',

                boxShadow: 2,
                border: 2,
                borderColor: 'primary.light',
                '& .MuiDataGrid-cell:hover': {
                    color: 'primary.main',
                },
                "& .MuiDataGrid-row": {
                    border: "1px solid lightgray",
                    borderRadius: "5px",
                    backgroundColor: "white",
                    width: "calc(100% - 2px)",
                    marginTop: 3
                },
            }}
        />
    );
};
