import React, {useEffect, useState} from 'react';
import {Container} from "@mui/material";
import {Table} from "../UI/Table";
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import axios from '../app/api';

export const JobTitlePages = () => {
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
                    <DeleteForeverTwoToneIcon onClick={() => deleteJobTitle(params.row.id)}/> : <></>
            },
        },
    ]

    useEffect(() => {
        getAll()
    }, [])

    const getAll = () => {
        axios.get(`/dictionary/job-title`).then(res => {
            res.forEach(item => {
                return {...item, isNew: false}
            })

            res.sort((a, b) => a.id - b.id)

            const tempId = res.at(res.length - 1);
            res.push({id: tempId ? (tempId.id + 1) : 1, name: '', isNew: true})

            setRows(res)
        });
    }

    const save = React.useCallback(
        async (newRow) => {
            const checkDuplicate = !!rows.filter(item => item.name === newRow.name).length

            if (!checkDuplicate) {
                if (newRow.isNew) {
                    axios.post(`/dictionary/job-title?name=${newRow.name}`)
                        .then(() => {
                            getAll();
                        })
                } else {
                    axios.post(`/dictionary/job-title?name=${newRow.name}&id=${newRow.id}`)
                        .then(() => {
                            getAll();
                        })
                }

                return newRow
            }
        },
        [rows],
    );

    const deleteJobTitle = (id) => {
        axios.delete(`/dictionary/job-title?id=${id}`)
            .then(() => {
                getAll();
            })
    }

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
