import React, { useState, useEffect } from 'react';
import useFetch from '../Hook/useFetch';
import Modal from 'react-modal';
import { useForm } from 'react-hook-form';
import { formatCurrency } from '../utils/formatters';
import axios from 'axios';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '500px',
    width: '90%'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)'
  }
};

const Order = () => {
  const [tanggalAwal, setTanggalAwal] = useState('');
  const [tanggalAkhir, setTanggalAkhir] = useState('');
  const [url, setUrl] = useState('/api/orders');
  const [message, setMessage] = useState('');
  const { data: orders, loading, error, refetch } = useFetch(url);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { register, handleSubmit, setValue, reset, watch } = useForm();

  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };

    setTanggalAwal(formatDate(thirtyDaysAgo));
    setTanggalAkhir(formatDate(today));
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!tanggalAwal || !tanggalAkhir) {
      setMessage('Please select both start and end dates');
      return;
    }

    setUrl(`/api/orders?start_date=${tanggalAwal}&end_date=${tanggalAkhir}`);
    refetch();
    setMessage('');
  };

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setValue('total_order', order.total);
    setValue('bayar', '');
    setValue('kembali', '');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    reset();
  };

  const processPayment = async (data) => {
    if (!selectedOrder) return;

    if (data.bayar < data.total_order) {
      setMessage("Payment amount must be greater than or equal to total order!");
      return;
    }

    try {
      const paymentData = {
        bayar: parseFloat(data.bayar),
        kembali: data.bayar - data.total_order,
        status: 1 // paid
      };

      const response = await axios.put(
        `/api/orders/${selectedOrder.id_order}`, 
        paymentData
      );

      setMessage(response.data.message || 'Payment successful!');
      handleCloseModal();
      refetch(); // Refresh order list
    } catch (error) {
      setMessage(error.response?.data?.message || 'Payment processing failed');
    }
  };

  const renderModalContent = () => {
    if (!selectedOrder) return null;

    const totalOrder = selectedOrder.total;
    const bayar = watch('bayar') || 0;
    const kembali = Math.max(0, bayar - totalOrder);

    return (
      <form onSubmit={handleSubmit(processPayment)}>
        <div className="mb-3">
          <label className="form-label">Total Order</label>
          <input
            type="number"
            className="form-control"
            {...register('total_order')}
            value={totalOrder}
            readOnly
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Payment Amount</label>
          <input
            type="number"
            className="form-control"
            {...register('bayar', {
              required: 'Payment amount is required',
              min: {
                value: totalOrder,
                message: 'Payment must cover the total amount'
              }
            })}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Change</label>
          <input
            type="number"
            className="form-control"
            value={kembali}
            readOnly
          />
        </div>

        <div className="modal-footer">
          <button type="submit" className="btn btn-primary">
            Process Payment
          </button>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={handleCloseModal}
          >
            Close
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="container mt-4">
      {message && (
        <div className={`alert ${message.includes('failed') ? 'alert-danger' : 'alert-success'}`}>
          {message}
        </div>
      )}

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Filter Orders by Date</h5>
          <form onSubmit={handleSearch}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={tanggalAwal}
                  onChange={(e) => setTanggalAwal(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={tanggalAkhir}
                  onChange={(e) => setTanggalAkhir(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-4 d-flex align-items-end">
                <button type="submit" className="btn btn-primary">
                  Search Orders
                </button>
              </div>
            </div>
          </form>
          
          {message && (
            <div className="alert alert-warning mt-3">
              {message}
            </div>
          )}
        </div>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders && orders.map((order) => (
            <tr key={order.id_order}>
              <td>{order.id_order}</td>
              <td>{order.pelanggan}</td>
              <td>{formatCurrency(order.total)}</td>
              <td>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => handleOpenModal(order)}
                >
                  Pay
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        style={customStyles}
        contentLabel="Payment Modal"
      >
        <div className="modal-header">
          <h5 className="modal-title">
            Process Payment for Order #{selectedOrder?.id_order}
          </h5>
          <button 
            type="button"
            className="btn-close"
            onClick={handleCloseModal}
          />
        </div>
        
        <div className="modal-body">
          {renderModalContent()}
        </div>
      </Modal>
    </div>
  );
};

export default Order;
