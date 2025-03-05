"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "../../components/ui/button";
import { College } from "../../app/type";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  college: College;
  onApprove?: () => void;
  onReject?: (remark: string) => void;
};

export function CollegeDetailsModal({ isOpen, onClose, college, onApprove, onReject }: Props) {
  const [rejectRemark, setRejectRemark] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="College Details">
      <div className="p-4 flex flex-col justify-between h-full">
        <div>
          <h3 className="text-lg font-semibold text-indigo-700">{college.institutionName}</h3>
          <p className="text-gray-600"><span className="font-medium">Email:</span> {college.email}</p>
          <p className="text-gray-600"><span className="font-medium">Affiliated University:</span> {college.affiliatedUniversity}</p>
          <p className="text-gray-600"><span className="font-medium">Recognition Status:</span> {college.recognitionStatus}</p>
          <p className="text-gray-600"><span className="font-medium">Institution Code:</span> {college.institutionCode || "N/A"}</p>
          <p className="text-gray-600"><span className="font-medium">Council:</span> {college.council}</p>
          <p className="text-gray-600"><span className="font-medium">Issuing Code:</span> {college.issuingCode}</p>
        </div>

        {showRejectInput ? (
          <div className="mt-4">
            <label className="block text-gray-700 font-medium">Reason for Rejection:</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-lg mt-2"
              value={rejectRemark}
              onChange={(e) => setRejectRemark(e.target.value)}
              placeholder="Enter rejection reason..."
            ></textarea>
            <div className="flex justify-center space-x-3 mt-4">
              <Button
                onClick={() => setShowRejectInput(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (rejectRemark.trim()) {
                    onReject?.(rejectRemark);
                    setShowRejectInput(false);
                    setRejectRemark("");
                  }
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center space-x-3 mt-6 border-t pt-4">
            {onApprove && (
              <Button onClick={onApprove} className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105">
                Approve
              </Button>
            )}
            {onReject && (
              <Button onClick={() => setShowRejectInput(true)} className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105">
                Reject
              </Button>
            )}
            <Button onClick={onClose} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105">
              Close
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}