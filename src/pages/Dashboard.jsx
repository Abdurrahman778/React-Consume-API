import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

const API_URL = 'http://45.64.100.26:88/API-Lumen/public';

export default function Dashboard() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totals, setTotals] = useState({ totalStock: 0, totalInbound: 0 });

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                const [stuffRes, inboundRes] = await Promise.all([
                    axios.get(`${API_URL}/stuffs`, { headers }),
                    axios.get(`${API_URL}/inbound-stuffs`, { headers })
                ]);

                const stuffs = stuffRes.data?.data || [];
                const inbounds = inboundRes.data?.data || [];

                // Aggregate inbound totals by stuff_id
                const inboundCounts = {};
                inbounds.forEach(item => {
                    const stuffId = item.stuff_id;
                    const total = parseInt(item.total, 10) || 0;
                    if (inboundCounts[stuffId]) {
                        inboundCounts[stuffId] += total;
                    } else {
                        inboundCounts[stuffId] = total;
                    }
                });

                let totalStock = 0;
                let totalInbound = 0;

                const chartData = stuffs.map(stuff => {
                    const stock = parseInt(stuff.stuff_stock?.total_available, 10) || 0;
                    const inbound = inboundCounts[stuff.id] || 0;

                    totalStock += stock;
                    totalInbound += inbound;

                    return {
                        name: stuff.name,
                        stock,
                        inbound
                    };
                });

                setData(chartData);
                setTotals({ totalStock, totalInbound });
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.response?.data?.message || 'Failed to fetch data');
            } finally {
                setIsLoading(false);
            }
        };

        if (user?.role === 'admin') {
            fetchData();
        }
    }, [user?.role]);

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">
                    Error loading data: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="card border-0 shadow-lg rounded-4">
                <div className="card-header bg-white py-3 border-0">
                    <h5 className="mb-0 fw-bold text-dark">Inventory Analytics</h5>
                </div>
                <div className="card-body">
                    <div style={{ width: '100%', height: 400 }}>
                        <ResponsiveContainer>
                            <BarChart
                                data={data}
                                margin={{ top: 20, right: 30, bottom: 60, left: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 12 }}
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                />
                                <YAxis />
                                <Tooltip />
                                <Legend verticalAlign="top" height={36} />
                                <Bar
                                    dataKey="stock"
                                    fill="#AEC6CF" // pastel blue
                                    name="Current Stock"
                                    radius={[4, 4, 0, 0]}
                                />
                                <Bar
                                    dataKey="inbound"
                                    fill="#B0E0A8" // pastel green
                                    name="Total Inbound"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Totals */}
                    <div className="mt-4 text-center">
                        <div className="row">
                            <div className="col-md-6 mb-2">
                                <div className="bg-light p-3 rounded-3 shadow-sm">
                                    <h6 className="text-muted">Total Stock</h6>
                                    <h4 className="text-primary fw-bold">{totals.totalStock}</h4>
                                </div>
                            </div>
                            <div className="col-md-6 mb-2">
                                <div className="bg-light p-3 rounded-3 shadow-sm">
                                    <h6 className="text-muted">Total Inbound</h6>
                                    <h4 className="text-success fw-bold">{totals.totalInbound}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
