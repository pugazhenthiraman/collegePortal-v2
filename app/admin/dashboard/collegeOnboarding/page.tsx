"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/Tabs";
import { useCollegeApprovals } from "@/hooks/useCollegeApprovals"; // Custom hook for fetching colleges
import { Button } from "@/components/ui/button";
import { CollegeDetailsModal } from "../../../../components/approvals/collegeDetailsModel"; // Modal for college details
import { useState, useEffect } from "react";
import { College } from "../../../type"; // Define College Type

export default function SuperAdminDashboard() {
  const { data, loading, handleApproval } = useCollegeApprovals();
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [rejectRemark, setRejectRemark] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  useEffect(() => {
    console.log("Super Admin Dashboard - All Data:", data);
  }, [data]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">College Approval Management</h2>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending Colleges</TabsTrigger>
          <TabsTrigger value="approved">Approved Colleges</TabsTrigger>
        </TabsList>

        {/* Pending Colleges */}
        <TabsContent value="pending">
          {data.pendingColleges?.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No pending college approvals</div>
          ) : (
            <div className="space-y-4">
              {data.pendingColleges?.map((college) => (
                <div key={college.id} className="flex justify-between p-4 bg-white shadow rounded-lg">
                  <div>
                    <h3 className="font-medium text-lg text-indigo-700">{college.institutionName}</h3>
                    <p className="text-sm text-gray-500">{college.email}</p>
                  </div>
                  <div className="space-x-2 flex items-center">
                    {/* View Details Button */}
                    <Button
                      variant="outline"
                      className="text-white bg-blue-500 border-blue-600 hover:bg-blue-600 px-4 py-2 rounded-lg shadow-md transition-transform transform "
                      onClick={() => {
                        setSelectedCollege(college);
                        setModalOpen(true);
                      }}
                    >
                      View Details
                    </Button>
                    {/* Approve Button */}
                    <Button
                      onClick={() => handleApproval(college.id, true)}
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
                    >
                      Approve
                    </Button>
                    {/* Reject Button */}
                    <Button
                      onClick={() => {
                        setSelectedCollege(college);
                        setShowRejectInput(true);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Approved Colleges */}
        <TabsContent value="approved">
          {data.approvedColleges?.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No approved colleges</div>
          ) : (
            <div className="space-y-4">
              {data.approvedColleges?.map((college) => (
                <div key={college.id} className="flex justify-between p-4 bg-white shadow rounded-lg">
                  <div>
                    <h3 className="font-medium text-lg text-indigo-700">{college.institutionName}</h3>
                    <p className="text-sm text-gray-500">{college.email}</p>
                  </div>
                  <div className="space-x-2 flex items-center">
                    {/* View Details Button */}
                    <Button
                      variant="outline"
                      className="text-white bg-blue-500 border-blue-600 hover:bg-blue-600 px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
                      onClick={() => {
                        setSelectedCollege(college);
                        setModalOpen(true);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Reject Reason Input */}
      {showRejectInput && selectedCollege && (
        <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded-lg">
          <label className="block text-gray-700 font-medium">Reason for Rejection:</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-lg mt-2"
            value={rejectRemark}
            onChange={(e) => setRejectRemark(e.target.value)}
            placeholder="Enter rejection reason..."
          ></textarea>
          <div className="flex justify-end space-x-3 mt-4">
            <Button onClick={() => setShowRejectInput(false)} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg">
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (rejectRemark.trim()) {
                  handleApproval(selectedCollege.id, false, rejectRemark);
                  setShowRejectInput(false);
                  setRejectRemark("");
                }
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Confirm Rejection
            </Button>
          </div>
        </div>
      )}

      {/* College Details Modal */}
      {selectedCollege && (
        <CollegeDetailsModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          college={selectedCollege}
          onApprove={() => {
            handleApproval(selectedCollege.id, true);
            setModalOpen(false);
          }}
          onReject={() => {
            handleApproval(selectedCollege.id, false, rejectRemark);
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
