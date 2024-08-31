"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import AddMember from "@/components/addMember/AddMember";
import { Dialog, Transition } from "@headlessui/react";
import { useState, Fragment, useEffect } from "react";
import ViewMember from "@/components/viewMember/ViewMember";
import Image from "next/image";

// import { viewDataInterface } from '@/lib/interfaces'

import {
  getDocs,
  collection,
  query,
  orderBy,
  where,
  deleteDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "@/lib/firebase";

import ExportData from "@/components/exportData/ExportData";

export interface viewDataInterface {
  id: string;
  imageUrl: string;
  welfare: string;
  lastName: string;
  otherNames: string;
  address: string;
  sex: string;
  dateOfBirth: string;
  nationality: string;
  occupation: string;
  phone: string;
  hometown: string;
  region: string;
  residence: string;
  maritalStatus: string;
  department: string;
  spouseName: string;
  fatherName: string;
  motherName: string;
  childrenName: string;
  nextOfKin: string;
  nextOfKinPhone: string;
  declaration: string;
  dateOfFirstVisit: string;
  dateOfBaptism: string;
  membership: string;
  dateOfTransfer: string;
  officerInCharge: string;
  officerSignatureDate: string;
  headPastorSignatureDate: string;
  status: string;
}

import { Montserrat } from "@next/font/google";
import Link from "next/link";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export default function Members() {
  const emptyMemberData = {
    id: "",
    imageUrl: "",
    welfare: "",
    lastName: "",
    otherNames: "",
    address: "",
    sex: "Male",
    dateOfBirth: "",
    nationality: "",
    occupation: "",
    phone: "",
    hometown: "",
    region: "",
    residence: "",
    maritalStatus: "Single",
    department: "Men Ministry",
    spouseName: "",
    fatherName: "",
    motherName: "",
    childrenName: "",
    nextOfKin: "",
    nextOfKinPhone: "",
    declaration: "Unsigned",
    dateOfFirstVisit: "",
    dateOfBaptism: "",
    membership: "",
    dateOfTransfer: "",
    officerInCharge: "",
    officerSignatureDate: "",
    headPastorSignatureDate: "",
    status: "Active",
  };

  let [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  let [isViewMemberOpen, setIsViewMemberOpen] = useState(false);
  let [viewMemberData, setViewMemberData] =
    useState<viewDataInterface>(emptyMemberData);
  const [searchBy, setSearchBy] = useState("lastName");

  let [exportData, setExportData] = useState<any>(null);

  const [memberData, setMemberData] = useState<any>(null);
  const [search, setSearch] = useState("");

  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const fetchMemberData = async () => {
      let exportDataTmp = [
        [
          "Welfare No",
          "Last Name",
          "First Name",
          "Department",
          "Sex",
          "Date of Birth",
          "Date of First Visit",
          "Phone",
          "Status",
          "Address",
          "Nationality",
          "Occupation",
          "Hometown",
          "Region",
          "Residence",
          "Marital Status",
          "Spouse Name",
          "Father's Name",
          "Mother's Name",
          "Children Name",
          "Next of Kin",
          "Next of Kin Phone",
          "Declaration",
          "Date of Baptism",
          "Membership",
          "Date of Transfer",
          "Officer in Charge",
          "Officer Signature Date",
          "Head Pastor Signature Date",
        ],
      ];
      const memberRef = collection(db, "members");
      const memberRefQuery = query(memberRef, orderBy("dateAdded", "desc"));
      const snapshots = await getDocs(memberRefQuery).then((snapshots) => {
        const docs = snapshots.docs.map((doc) => {
          const data = doc.data();
          data.id = doc.id;
          exportDataTmp.push([
            data.welfare,
            data.lastName,
            data.firstName,
            data.department,
            data.sex,
            data.dateOfBirth,
            data.dateOfFirstVisit,
            data.phone,
            data.status,
            data.address,
            data.nationality,
            data.occupation,
            data.hometown,
            data.region,
            data.residence,
            data.maritalStatus,
            data.spouseName,
            data.fatherName,
            data.motherName,
            data.childrenName,
            data.nextOfKin,
            data.nextOfKinPhone,
            data.declaration,
            data.dateOfBaptism,
            data.membership,
            data.dateOfTransfer,
            data.officerInCharge,
            data.officerSignatureDate,
            data.headPastorSignatureDate,
          ]);
          return data;
        });
        console.log(docs);
        setMemberData(docs);
        setExportData(exportDataTmp);
      });
    };
    fetchMemberData();
  }, []);

  async function searchHandler() {
    if (search) {
      const memberRef = collection(db, "members");
      const memberRefQuery = query(memberRef, where(searchBy, "==", search));
      const snapshots = await getDocs(memberRefQuery);

      const docs = snapshots.docs.map((doc) => {
        const data = doc.data();
        data.id = doc.id;
        return data;
      });
      console.log(docs);
      setMemberData(docs);
    }
  }

  function uploadActivity() {
    try {
      const activityRef = collection(db, "activity");
      const owner: string | null = localStorage.getItem("userEmail");
      var date = new Date();
      var options: any = { hour: "numeric", minute: "2-digit" };
      let currTime = date.toLocaleTimeString("en-US", options);
      let activity = "Delete";
      addDoc(activityRef, {
        resource: "Member",
        activity: activity,
        owner: owner,
        date: new Date(),
        time: currTime,
      })
        .then(() => {
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
          setDeleteError("Could not delete");
        });
    } catch (error) {
      console.log(error);
      setDeleteError("Could not delete");
    }
  }

  function deleteHandler() {
    try {
      const docRef = doc(db, "members", viewMemberData.id);
      const oldImageRef = ref(storage, viewMemberData.imageUrl);
      deleteObject(oldImageRef)
        .then(() => {
          deleteDoc(docRef)
            .then(() => {
              uploadActivity();
            })
            .catch((err) => {
              console.log(err);
              setDeleteError("Could not delete");
            });
        })
        .catch((err) => {
          console.log(err);
          setDeleteError("Could not delete");
        });
    } catch (err) {
      console.log(err);
    }
  }

  function closeAddMemberModal() {
    setIsAddMemberOpen(false);
  }

  function openAddMemberModal() {
    setViewMemberData(emptyMemberData);
    setIsAddMemberOpen(true);
  }

  function closeViewMemberModal() {
    setIsViewMemberOpen(false);
  }

  function openViewMemberModal(data: viewDataInterface) {
    setViewMemberData(data);
    setIsViewMemberOpen(true);
  }

  function editHandler() {
    closeViewMemberModal();
    setIsAddMemberOpen(true);
    // openAddMemberModal()
  }

  return (
    <div className="flex flex-col justify-center py-10 md:px-40 lg:px-40 m-3 flex-wrap w-[100%]">
      {/* Add Member Modal */}
      <Transition appear show={isAddMemberOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10 text-sm"
          onClose={closeAddMemberModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-bold leading-6 text-gray-900 mb-4"
                  >
                    Membership Form
                  </Dialog.Title>
                  <AddMember data={viewMemberData} onClose={closeAddMemberModal} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* View Member Modal */}
      <Transition appear show={isViewMemberOpen} as={Fragment}>
        <Dialog
          as="div"
          className={`${montserrat.variable} font-sans relative z-10 text-sm`}
          onClose={closeViewMemberModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="transform w-[40%] overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-bold leading-6 text-gray-900"
                  >
                    <div className="flex flex-row justify-between">
                      <span>View Member</span>
                      <div>
                        <FontAwesomeIcon
                          icon={faEdit}
                          color="blue"
                          className="mr-5"
                          onClick={editHandler}
                        />
                        <FontAwesomeIcon
                          icon={faTrash}
                          color="red"
                          onClick={deleteHandler}
                        />
                      </div>
                    </div>
                    {deleteError && (
                      <div
                        className={`text-center text-sm font-regular text-white bg-red-400 border p-1 rounded my-5`}
                      >
                        <span>{deleteError}</span>
                      </div>
                    )}
                  </Dialog.Title>
                  <ViewMember data={viewMemberData} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <div className="flex flex-row justify-between flex-wrap mb-6">
        <div className="flex flex-row space-x-2">
          <div className="rounded border-2 h-10">
            <FontAwesomeIcon
              className="px-2 cursor-pointer"
              icon={faSearch}
              onClick={searchHandler}
            />
            <input
              className="h-full p-2"
              placeholder={`Search by ${searchBy}`}
              name="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
            />
          </div>
          <select
            className="p-2 rounded w-[auto] border-2"
            name="selectYear"
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
          >
            <option value="welfare">Search by Welfare Number</option>
            <option value="lastName">Search by Last Name</option>
            <option value="otherNames">Search by Other Names</option>
            <option value="department">Search by Department</option>
            <option value="sex">Search by Sex</option>
            <option value="dateOfBirth">Search by Date of Birth</option>
            <option value="phone">Search by Phone</option>
            <option value="status">Search by Status</option>
          </select>
        </div>

        <div className="flex flex-col items-center">
          <button
            className="bg-[#8B7E74] px-4 h-10 rounded w-40 md:my-0 lg:my-0 text-white hover:bg-[#7A6E64] transition-colors duration-300"
            onClick={() => openAddMemberModal()}
          >
            Add Member
          </button>
        </div>
      </div>
      {exportData && <ExportData data={exportData} />}
      
      <div className="overflow-x-auto">
        <table className="mt-6 w-full border-collapse table-auto text-sm">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="p-2">Profile</th>
              <th className="p-2">Welfare No.</th>
              <th className="p-2">Last Name</th>
              <th className="p-2">Other Names</th>
              <th className="p-2">Department</th>
              <th className="p-2">Sex</th>
              <th className="p-2">Date of Birth</th>
              <th className="p-2">Date of first visit</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          {memberData ? (
            <tbody>
              {memberData.map((data: any) => (
                <tr
                  className="hover:bg-gray-50 cursor-pointer border-b"
                  key={data.id}
                  onClick={() => openViewMemberModal(data)}
                >
                  <td className="p-2">
                    <Image
                      className="rounded-full h-10 w-10 object-cover"
                      src={data.imageUrl}
                      alt="profile"
                      width={40}
                      height={40}
                    />
                  </td>
                  <td className="p-2">{data.welfare}</td>
                  <td className="p-2">{data.lastName}</td>
                  <td className="p-2">{data.otherNames}</td>
                  <td className="p-2">{data.department}</td>
                  <td className="p-2">{data.sex}</td>
                  <td className="p-2">{data.dateOfBirth}</td>
                  <td className="p-2">{data.dateOfFirstVisit}</td>
                  <td className="p-2">{data.phone}</td>
                  <td className={`p-2 font-bold ${data.status === "Active" ? "text-green-600" : "text-red-600"}`}>
                    {data.status}
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan={10} className="text-center p-4 text-gray-500">
                  Loading member data...
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
