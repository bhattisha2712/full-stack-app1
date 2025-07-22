"use client";

import { useEffect, useState } from "react";

interface AtlasConnectionDetails {
  hostname?: string;
  port?: number | string;
  username?: string;
  hasPassword?: boolean;
  database?: string;
  protocol?: string;
}

interface AtlasConfig {
  connectionDetails?: AtlasConnectionDetails;
}

interface LocalTest {
  status?: string;
  message?: string;
  error?: string;
}

export default function DbTroubleshootPage() {

  const [atlasConfig, setAtlasConfig] = useState<AtlasConfig | null>(null);
  const [localTest, setLocalTest] = useState<LocalTest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/db-config").then(res => res.json()),
      fetch("/api/db-local").then(res => res.json())
    ]).then(([config, local]) => {
      setAtlasConfig(config);
      setLocalTest(local);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading database diagnostics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Database Connection Troubleshooting</h1>
      <ol className="list-decimal pl-5 space-y-3 text-blue-700 mb-8">
        <li>MongoDB will run on localhost:27017</li>
        <li>Update your .env.local with local connection</li>
      </ol>

      {/* Local MongoDB Test */}
      <div className={`rounded-lg p-6 mb-6 ${
        localTest?.status === "Success" 
          ? "bg-green-50 border border-green-200" 
          : "bg-red-50 border border-red-200"
      }`}>
        <h2 className="text-xl font-semibold mb-4">Local MongoDB Test</h2>
        <div className="space-y-2">
          <div><strong>Status:</strong> {localTest?.status}</div>
          <div><strong>Message:</strong> {localTest?.message}</div>
          {localTest?.error && (
            <div><strong>Error:</strong> {localTest.error}</div>
          )}
        </div>
      </div>

      {/* Atlas Troubleshooting */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-800">Atlas Troubleshooting Steps</h2>
        <ol className="list-decimal pl-5 space-y-3 text-blue-700">
          <li>
            <strong>Check Cluster Status:</strong>
            <div className="ml-4 mt-1">
              • Go to MongoDB Atlas → Clusters<br/>
              • Ensure cluster is not paused<br/>
              • Click "Resume" if needed
            </div>
          </li>
          <li>
            <strong>Verify Database User:</strong>
            <div className="ml-4 mt-1">
              • Go to Database Access<br/>
              • Check user "isha_db" exists<br/>
              • Verify password is correct<br/>
              • Ensure user has &quot;readWriteAnyDatabase&quot; role
            </div>
          </li>
          <li>
            <strong>Check Network:</strong>
            <div className="ml-4 mt-1">
              • Test from different network<br/>
              • Try mobile hotspot<br/>
              • Check corporate firewall
            </div>
          </li>
          <li>
            <strong>Create New Cluster:</strong>
            <div className="ml-4 mt-1">
              • Sometimes old clusters have issues<br/>
              • Create new M0 (free) cluster<br/>
              • Update connection string
            </div>
          </li>
        </ol>
      </div>

      {/* Immediate Solution */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-green-800">Immediate Solution</h2>
        <p className="text-green-700 mb-4">
          Let's set up a local MongoDB connection so you can continue development:
        </p>
        <button 
          onClick={() => {
            if (confirm("This will update your .env.local to use local MongoDB. Continue?")) {
              fetch("/api/setup-local-db", { method: "POST" })
                .then(res => res.json())
                .then(data => {
                  alert("Local MongoDB setup initiated. Please restart your dev server.");
                });
            }
          }}
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
        >
          Setup Local MongoDB
        </button>
      </div>
    </div>
  );
}
