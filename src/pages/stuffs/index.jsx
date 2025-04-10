import axios from 'axios';
import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {API_URL} from '../../constant.js';

export default function StuffIndex() {
    const [stuffs, setStuffs] = useState([]);
    const [error,setError] = useState([null]);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get( API_URL + "/stuffs", {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('access_token'),
            }
        })
        .then(res => {
            setStuffs(res.data.data);
        })
        .catch(err => {
            setError(err.data);
        });
    }, []);

    return (
        <table className="table table-bordered m-5">
            <thead>
                <tr>
                    <td rowSpan={2}>#</td>
                    <td rowSpan={2}>Name</td>
                    <td colSpan={2}>stock</td>
                    <td rowSpan={2}></td>
                </tr>
                <tr>
                    <td>available</td>
                    <td>defec</td>
                </tr>
            </thead>
            <tbody>
                {
                    Object.entries(stuffs).map(([key, value], index) => (
                      <tr key={value}>
                        <td></td>
                        <td>{value.name}</td>
                        <td>{value.stuff_stock ? value.stuff_stock.total_available : ''}</td>
                        <td>{value.stuff_stock ? value.stuff_stock.total_defec : ''}</td>
                        <td></td>
                      </tr>                    
                    ))
                }
            </tbody>
        </table>
    );
}