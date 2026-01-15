import { CheckCircleIcon, NoSymbolIcon, TrashIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import Loader from "../Loader";
import Message from "../Message";
import Button from "../ui/Button";

export default function UserAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, user: currentUser } = useAuth();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const handleBanToggle = (user) => {
    const action = user.isBanned ? "unban" : "ban";
    toast(`Are you sure you want to ${action} this user?`, {
        action: {
            label: 'Confirm',
            onClick: async () => {
                try {
                    const { data } = await api.put(`/api/users/${user._id}/ban`, {}, {
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    
                    // Update local state without refetching
                    setUsers((prev) => prev.map(u => 
                        u._id === user._id ? { ...u, isBanned: data.isBanned } : u
                    ));
                    toast.success(`User ${action}ned successfully`);
                } catch (err) {
                    toast.error(err.response?.data?.message || err.message || "Action failed");
                }
            }
        },
        cancel: {
            label: 'Cancel'
        }
    });
  };

  const handleDelete = (userId) => {
    toast("Are you sure you want to delete this user? This action cannot be undone.", {
        action: {
            label: 'Delete',
            onClick: async () => {
                try {
                  await api.delete(`/api/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  setUsers((prev) => prev.filter((u) => u._id !== userId));
                  toast.success("User deleted successfully");
                } catch (err) {
                  toast.error(err.response?.data?.message || err.message || "Delete failed");
                }
            }
        },
        cancel: {
            label: 'Cancel'
        }
    });
  };

  if (loading) return <Loader className="min-h-[60vh]" />;
  if (error) return <Message type="error">{error}</Message>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Users</h1>
           <p className="mt-1 text-sm text-gray-500">Manage all registered users ({users.length})</p>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th scope="col" className=" py-3 pl-16 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>

              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.profileImage?.url || user.googlePhotoUrl ? (
                          <img className="h-10 w-10 rounded-full object-cover" src={user.profileImage?.url || user.googlePhotoUrl} alt="" />
                        ) : (
                           <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                             <UserCircleIcon className="w-6 h-6" />
                           </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name || 'No Name'}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                       {user.isAdmin ? 'Admin' : 'Customer'}
                     </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     {user.isBanned ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Banned
                        </span>
                     ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                        </span>
                     )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {user.email !== currentUser?.email && (
                       <div className="flex justify-end space-x-2">
                         <Button
                           variant="ghost"
                           size="sm"
                           className={`${user.isBanned ? 'text-green-600 hover:text-green-900 hover:bg-green-50' : 'text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50'}`}
                           onClick={() => handleBanToggle(user)}
                           title={user.isBanned ? "Unban User" : "Ban User"}
                         >
                           {user.isBanned ? <CheckCircleIcon className="h-5 w-5" /> : <NoSymbolIcon className="h-5 w-5" />}
                         </Button>
                         <Button
                           variant="ghost"
                           size="sm"
                           className="text-red-600 hover:text-red-900 hover:bg-red-50"
                           onClick={() => handleDelete(user._id)}
                           title="Delete User"
                         >
                           <TrashIcon className="h-5 w-5" />
                         </Button>
                       </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && (
            <div className="text-center py-12">
               <UserCircleIcon className="mx-auto h-12 w-12 text-gray-300" />
               <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            </div>
        )}
      </div>
    </div>
  );
}
