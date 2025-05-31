import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { link } from '../../Axios/link';
import axios from 'axios';
import useSkit from '../../Hook/useSkit';

const Kategori = () => {
    const [pesan, setPesan] = useState('');
    const [idkategori, setIdkategori] = useState(0);
    const [pilihan, setPilihan] = useState(true);
    
    const { register, handleSubmit, reset, setValue } = useForm();
    const { data: kategoriList, loading, error, refreshData } = useSkit(`${link}/kategori`);

    async function simpan(data) {
        try {
            if (pilihan) {
                const response = await axios.post(`${link}/kategori`, data);
                setPesan(response.data.pesan);
            } else {
                const response = await axios.put(`${link}/kategori/${idkategori}`, data);
                setPesan(response.data.pesan);
                setPilihan(true);
            }
            
            reset();
            setIdkategori(0);
            refreshData();
        } catch (error) {
            setPesan('Error processing request');
        }
    }

    async function hapus(id) {
        if (window.confirm('Yakin akan menghapus data ini?')) {
            const res = await axios.delete(`${link}/kategori/${id}`);
            setPesan(res.data.pesan);
            refreshData();
        }
    }

    async function showData(id) {
        try {
            const response = await axios.get(`${link}/kategori/${id}`);
            const data = response.data[0];

            setValue('kategori', data.kategori);
            setValue('keterangan', data.keterangan);

            setIdkategori(data.idkategori);
            setPilihan(false);
        } catch (error) {
            setPesan('Error fetching data');
        }
    }

    return (
        <div>
            <div className="row">
                <div>
                    <h2>Data Kategori</h2>
                </div>
                {pesan && (
                    <div className="alert alert-success">
                        {pesan}
                    </div>
                )}
                <div className="col-4">
                    <form onSubmit={handleSubmit(simpan)}>
                        <div className="mb-3">
                            <label htmlFor="kategori" className="form-label">Kategori</label>
                            <input
                                type="text"
                                className="form-control"
                                id="kategori"
                                {...register('kategori', { required: true })}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="keterangan" className="form-label">Keterangan</label>
                            <input
                                type="text"
                                className="form-control"
                                id="keterangan"
                                {...register('keterangan', { required: true })}
                            />
                        </div>
                        <div className="mb-3">
                            <input 
                                type="submit" 
                                className="btn btn-primary" 
                                value={pilihan ? "Simpan" : "Ubah"} 
                            />
                        </div>
                    </form>
                </div>

                <div className="col-8">
                    {loading && <p>Loading...</p>}
                    {error && <p>Error: {error}</p>}
                    {!loading && !error && (
                        <table className="table mt-4">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Kategori</th>
                                    <th>Keterangan</th>
                                    <th>Hapus</th>
                                    <th>Ubah</th>
                                </tr>
                            </thead>
                            <tbody>
                                {kategoriList.map((val, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{val.kategori}</td>
                                        <td>{val.keterangan}</td>
                                        <td>
                                            <button 
                                                className="btn btn-danger"
                                                onClick={() => hapus(val.idkategori)}
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                        <td>
                                            <button 
                                                className="btn btn-warning"
                                                onClick={() => showData(val.idkategori)}
                                            >
                                                Ubah
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Kategori;