import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const DebugUser = () => {
    const { user } = useContext(AppContext);

    if (!user) {
        return <div className="text-red-500">No user logged in</div>;
    }

    return (
        <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg mb-4">
            <h3 className="font-bold mb-2">Debug User Data:</h3>
            <pre className="text-sm overflow-auto">
                {JSON.stringify(user, null, 2)}
            </pre>
            <div className="mt-2">
                <strong>Role:</strong> {user.role || 'undefined'} <br/>
                <strong>Is Admin:</strong> {user.role === 'admin' ? 'Yes' : 'No'}
            </div>
        </div>
    );
};

export default DebugUser; 