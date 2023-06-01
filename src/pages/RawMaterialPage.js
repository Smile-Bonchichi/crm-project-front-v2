import React, {useEffect, useState} from 'react';
import {Container} from "@mui/material";
import {Table} from "../UI/Table";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";
import axios from "../app/api";

export const RawMaterialPage = () => {
    const [rawMaterial, setRawMaterial] = useState({});
    const [rows, setRows] = useState([]);
    const [columnRows, setColumnRows] = useState([]);

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
            headerName: 'Наименование сырья',
            type: 'string',
            width: 180,
            editable: true,
        },
        {
            field: 'unitName',
            headerName: 'Наименование единицы измерения',
            type: 'singleSelect',
            width: 280,
            editable: true,
            valueOptions: columnRows.map(item => item.name)
        },
        {
            field: 'amount',
            headerName: 'Кол-во',
            type: 'string',
            width: 100,
            editable: true,
        },
        {
            field: 'sum',
            headerName: 'Сумма',
            type: 'string',
            width: 150,
            editable: true,
        },
        {
            field: 'delete',
            headerName: 'Удалить',
            width: 100,
            align: 'center',
            renderCell: (params) => {
                return params.row.name ?
                    <DeleteForeverTwoToneIcon onClick={() => deleteRawMaterial(params.row.id)}/> : <></>
            },
        },
    ]

    useEffect(() => {
        getAll()
    }, [])

    const getAll = () => {
        axios.get(`/material/raw`).then(res => {
            res.forEach(item => {
                return {...item, isNew: false}
            })

            res.sort((a, b) => a.id - b.id)

            const tempId = res.at(res.length - 1);
            res.push({id: tempId ? (tempId.id + 1) : 1, name: '', isNew: true})

            setRows(res);

            axios.get(`/dictionary/unit`).then(resJT => {
                setColumnRows(resJT);
            });
        });
    };

    const deleteRawMaterial = (id) => {
        axios.delete(`/material/raw?id=${id}`).then(() => {
            getAll();
        });
    };

    const save = React.useCallback(
        async (newRow) => {
            if (newRow.isNew) {
                setRawMaterial({
                    name: !!newRow.name ? newRow.name : rawMaterial.name,
                    unitId: !!newRow.unitName ? columnRows.find(item => item.name === newRow.unitName).id : rawMaterial.unitId,
                    amount: !!newRow.amount ? newRow.amount : rawMaterial.amount,
                    sum: !!newRow.sum ? newRow.sum : rawMaterial.sum,
                })

                if (rawMaterial.name && rawMaterial.unitId && rawMaterial.amount && rawMaterial.sum) {
                    axios.post(`/material/raw`, rawMaterial).then(() => {
                        getAll();

                        setRawMaterial({})
                    });

                    return newRow
                }
            } else {
                axios.post(`/material/raw`, {
                    ...newRow,
                    unitId: columnRows.find(item => item.name === newRow.unitName).id
                }).then(() => {
                    getAll();

                    setRawMaterial({})
                });

                return newRow
            }
        },
        [columnRows, rawMaterial],
    );

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
