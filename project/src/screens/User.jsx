import { useState } from 'react';


function User() {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    role: 'user',
    status: 'active'
  });
  const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('user');
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
  

      setMessage({ type: 'success', text: 'User created successfully!' });
      setFormData({
        email: '',
        fullName: '',
        role: 'user',
        status: 'active'
      });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to create user' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      email: '',
      fullName: '',
      role: 'user',
      status: 'active'
    });
    setMessage({ type: '', text: '' });
  };


    const tabs = [
    { id: 'user', label: 'User List' },
       { id: 'create', label: 'Create New User' },
  ];

  return (
<>

  <div className="mb-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">


            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors
                      ${activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

     
            {/* <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-500" />
                  <span className="text-purple-600 font-medium">AI Analysis Active</span>
                </div> */}
          </div>
     
        </div>
      </div>


      {activeTab === 'user' && (
        <>
          {/* Business Metrics Cards */}
          <div className=" mb-8"> 


    <div className="create-user-container">
      <div className="create-user-card">
        <div className="card-header">
          <h2>Create New User</h2>
          <p>Add a new user to the system</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-secondary"
              disabled={loading}
            >
              Reset
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>

 </div>
 </>
      )}
    </>
  );
}

export default User;
