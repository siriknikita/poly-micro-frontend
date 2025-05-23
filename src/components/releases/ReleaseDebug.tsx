import React, { useState } from 'react';
import { db } from '../../db/db';
import { useLiveQuery } from 'dexie-react-hooks';

/**
 * Debug component to help troubleshoot release notification issues
 */
const ReleaseDebug: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Get all releases from the database
  const releases =
    useLiveQuery(async () => {
      return await db.releases.toArray();
    }) || [];

  // Get all user acknowledgments
  const acknowledgments =
    useLiveQuery(async () => {
      return await db.userAcknowledgments.toArray();
    }) || [];

  // Manually trigger database reset and seeding
  const handleReset = async () => {
    try {
      // Clear existing data
      await db.releases.clear();
      await db.userAcknowledgments.clear();

      // Add a test release
      await db.releases.add({
        version: '1.2.0',
        releaseDate: new Date(),
        title: 'Debug Release',
        description: 'This is a test release created from the debug panel',
        isLatest: 1,
        changes: [
          {
            type: 'feature',
            description: 'Added debug panel',
          },
        ],
      });

      alert('Database reset and test release added successfully!');
    } catch (error) {
      console.error('Error resetting database:', error);
      alert(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm"
      >
        {isVisible ? 'Hide Debug' : 'Show Debug'}
      </button>

      {isVisible && (
        <div className="mt-2 bg-white border border-gray-300 rounded-md shadow-lg p-4 max-w-md max-h-96 overflow-auto">
          <h3 className="font-bold text-lg mb-2">Release Debug Panel</h3>

          <div className="mb-4">
            <button
              onClick={handleReset}
              className="bg-red-600 text-white px-3 py-1 rounded-md text-sm"
            >
              Reset DB & Add Test Release
            </button>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold mb-1">Releases ({releases.length})</h4>
            {releases.length === 0 ? (
              <p className="text-red-500 text-sm">No releases found in database!</p>
            ) : (
              <ul className="text-sm space-y-2">
                {releases.map((release, index) => (
                  <li key={index} className="border-b pb-2">
                    <div>
                      <strong>Version:</strong> {release.version}
                    </div>
                    <div>
                      <strong>Title:</strong> {release.title}
                    </div>
                    <div>
                      <strong>isLatest:</strong> {release.isLatest === 1 ? 'Yes' : 'No'}
                    </div>
                    <div>
                      <strong>ID:</strong> {release.id ? String(release.id) : 'undefined'}
                    </div>
                    <div>
                      <strong>Date:</strong> {release.releaseDate.toLocaleString()}
                    </div>
                    <div>
                      <strong>Changes:</strong> {release.changes.length}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h4 className="font-semibold mb-1">Acknowledgments ({acknowledgments.length})</h4>
            {acknowledgments.length === 0 ? (
              <p className="text-gray-500 text-sm">No acknowledgments found.</p>
            ) : (
              <ul className="text-sm">
                {acknowledgments.map((ack, index) => (
                  <li key={index}>
                    User {String(ack.userId)} acknowledged release {String(ack.releaseId)} at{' '}
                    {ack.acknowledgedAt.toLocaleString()}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReleaseDebug;
