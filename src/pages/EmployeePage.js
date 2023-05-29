import React, {useEffect, useState} from 'react';
import {Container} from "@mui/material";
import {Table} from "../UI/Table";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";
import axios from '../app/api';

export const EmployeePage = () => {
    const [employee, setEmployee] = useState({});
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
            headerName: 'ФИО',
            type: 'string',
            width: 250,
            editable: true,
        },
        {
            field: 'jobTitleName',
            headerName: 'Должность',
            type: 'singleSelect',
            width: 200,
            editable: true,
            valueOptions: columnRows.map(item => item.name)
        },
        {
            field: 'salary',
            headerName: 'Зарплата',
            type: 'string',
            width: 100,
            editable: true,
        },
        {
            field: 'address',
            headerName: 'Адресс',
            type: 'string',
            width: 150,
            editable: true,
        },
        {
            field: 'phoneNumber',
            headerName: 'Номер телефона',
            type: 'string',
            width: 100,
            editable: true,
        },
        {
            field: 'delete',
            headerName: 'Удалить',
            width: 100,
            align: 'center',
            renderCell: (params) => {
                return params.row.name ?
                    <DeleteForeverTwoToneIcon onClick={() => deleteEmployee(params.row.id)}/> : <></>
            },
        },
    ]

    useEffect(() => {
        getAll()
    }, [])

    const getAll = () => {
        axios.get(`/user`).then(res => {
            res.forEach(item => {
                return {...item, isNew: false}
            })

            res.sort((a, b) => a.id - b.id)

            const tempId = res.at(res.length - 1);
            res.push({id: tempId ? (tempId.id + 1) : 1, name: '', isNew: true})

            setRows(res);

            axios.get(`/dictionary/job-title`).then(resJT => {
                setColumnRows(resJT);
            });
        });
    };

    const deleteEmployee = (id) => {
        axios.delete(`/user?id=${id}`).then(() => {
            getAll();
        });
    };

    const save = React.useCallback(
        async (newRow) => {
            if (newRow.isNew) {
                setEmployee({
                    name: !!newRow.name ? newRow.name : employee.name,
                    jobTitleId: !!newRow.jobTitleName ? columnRows.find(item => item.name === newRow.jobTitleName).id : employee.jobTitleId,
                    salary: !!newRow.salary ? newRow.salary : employee.salary,
                    address: !!newRow.address ? newRow.address : employee.address,
                    phoneNumber: !!newRow.phoneNumber ? newRow.phoneNumber : employee.phoneNumber
                })

                if (employee.name && employee.jobTitleId && employee.salary && employee.address && employee.phoneNumber) {
                    axios.post(`/user`, employee).then(() => {
                        getAll();

                        setEmployee({})
                    });

                    return newRow
                }
            } else {
                axios.post(`/user`, {
                    ...newRow,
                    jobTitleId: columnRows.find(item => item.name === newRow.jobTitleName).id
                }).then(() => {
                    getAll();

                    setEmployee({})
                });

                return newRow
            }
        },
        [columnRows, employee],
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
