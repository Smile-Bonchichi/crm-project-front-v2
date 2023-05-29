import React, {useEffect, useState} from 'react';
import {Container} from "@mui/material";
import {Table} from "../UI/Table";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";
import axios from '../app/api';

export const UnitPage = () => {
    const [rows, setRows] = useState([]);

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            type: 'number',
            width: 180,
            editable: true,
        },
        {
            field: 'name',
            headerName: 'Наименование должности',
            type: 'string',
            width: 500,
            editable: true,
        },
        {
            field: 'delete',
            headerName: 'Удалить',
            width: 100,
            align: 'center',
            renderCell: (params) => {
                return params.row.name ?
                    <DeleteForeverTwoToneIcon onClick={() => deleteUnit(params.row.id)}/> : <></>
            },
        },
    ]

    useEffect(() => {
        getAll()
    }, [])

    const deleteUnit = (id) => {
        axios.delete(`/dictionary/unit?id=${ id }`).then(() => {
            getAll();
        });
    };

    const save = React.useCallback(
        async (newRow) => {
            const checkDuplicate = !!rows.filter(item => item.name === newRow.name).length

            if (!checkDuplicate) {
                if (newRow.isNew) {
                    axios.post(`/dictionary/unit?name=${newRow.name}`)
                        .then(() => {
                            getAll();
                        })
                } else {
                    axios.post(`/dictionary/unit?name=${newRow.name}&id=${newRow.id}`)
                        .then(() => {
                            getAll();
                        })
                }

                return newRow
            }
        },
        [rows],
    );

    const getAll = () => {
        axios.get(`/dictionary/unit`).then(res => {
            res.forEach(item => {
                return {...item, isNew: false}
            })

            res.sort((a, b) => a.id - b.id)

            const tempId = res.at(res.length - 1);
            res.push({id: tempId ? (tempId.id + 1) : 1, name: '', isNew: true})

            setRows(res);
        });
    };

    return (
        <Container>
            <Table
                columns={columns}
                rows={rows}
                saveOrUpdate={save}
            />
        </Container>
    );
};
