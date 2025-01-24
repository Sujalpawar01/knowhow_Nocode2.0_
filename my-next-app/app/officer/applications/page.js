'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [registerid, setRegisterId] = useState('');
  const [formData, setFormData] = useState({
    service: '',
    doneDate: '',
    status: '',
    registerid: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/verify-token');
        if (!res.ok) {
          router.push('/login');
        } else {
          const data = await res.json();
          setRegisterId(data.user.id);
        }
      } catch {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!registerid) return;

    const fetchApplications = async () => {
      try {
        const response = await fetch(`/api/auth/get-applications?id=${registerid}`);
        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [registerid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/auth/update-application/${selectedApplication._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Application updated successfully!');
        setApplications((prev) =>
          prev.map((app) =>
            app._id === selectedApplication._id ? { ...app, ...formData } : app
          )
        );
        setIsModalOpen(false);
        setSelectedApplication(null);
        setFormData({
          service: '',
          doneDate: '',
          status: '',
          registerid: '',
        });
      } else {
        alert('Failed to update application');
      }
    } catch {
      alert('Error updating application');
    }
  };

  return (
    <>
    <Navbar/>
    <div className="container mx-auto p-6 space-y-6 max-w-[80%]">
      <h1 className="text-4xl font-bold text-center text-blue-600">Applications</h1>
      {loading ? (
        <div className="text-center text-gray-500">Loading applications...</div>
      ) : error ? (
        <div className="text-center text-red-500">Error: {error}</div>
      ) : applications.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>No applications available.</p>
          <img src="/no-data.svg" alt="No data" className="w-48 h-48 mx-auto mt-4" />
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full table-auto text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Service</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Done Date</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{application.service}</td>
                  <td className="px-6 py-4">
                    {new Date(application.doneDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full ${
                        application.status === 'Completed'
                          ? 'bg-green-500 text-white'
                          : 'bg-yellow-500 text-white'
                      }`}
                    >
                      {application.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      onClick={() => {
                        setSelectedApplication(application);
                        setFormData({
                          service: application.service,
                          doneDate: application.doneDate,
                          status: application.status,
                          registerid: application.registerid,
                        });
                        setIsModalOpen(true);
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold text-center">Edit Application</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium">Service</label>
                <input
                  type="text"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Done Date</label>
                <input
                  type="date"
                  name="doneDate"
                  value={formData.doneDate}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded"
                >
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default ApplicationsPage;
