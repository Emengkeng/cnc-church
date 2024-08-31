import { useRef, useState } from "react";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { storage } from "@/lib/firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export default function AddMember({ data, onClose }: { data: any; onClose: () => void }) {
  let edit: boolean;

  if (data.lastName) {
    edit = true;
  } else {
    edit = false;
  }

  console.log(edit);
  console.log("edit data", data);

  const [profile, setProfile] = useState<File | null>(null);  
  const [previewUrl, setPreviewUrl] = useState<string | null>(data.imageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [welfare, setWelfare] = useState(data.welfare);
  const [lastName, setLastName] = useState(data.lastName);
  const [otherNames, setOtherNames] = useState(data.otherNames);
  const [address, setAddress] = useState(data.address);
  const [sex, setSex] = useState(data.sex);
  const [dateOfBirth, setDateOfBirth] = useState(data.dateOfBirth);
  const [nationality, setNationality] = useState(data.nationality);
  const [occupation, setOccupation] = useState(data.occupation);
  const [phone, setPhone] = useState(data.phone);
  const [imageUrl, setImageUrl] = useState(data.imageUrl);
  const [hometown, setHometown] = useState(data.hometown);
  const [region, setRegion] = useState(data.region);
  const [residence, setResidence] = useState(data.residence);
  const [maritalStatus, setMaritalStatus] = useState(data.maritalStatus);
  const [department, setDepartment] = useState(data.department);
  const [spouseName, setSpouseName] = useState(data.spouseName);
  const [fatherName, setFatherName] = useState(data.fatherName);
  const [motherName, setMotherName] = useState(data.motherName);
  const [childrenName, setChildrenName] = useState(data.childrenName);
  const [nextOfKin, setNextOfKin] = useState(data.nextOfKin);
  const [nextOfKinPhone, setNextOfKinPhone] = useState(
    data.nextOfKinPhone
  );
  const [declaration, setDeclaration] = useState(data.declaration);
  const [dateOfFirstVisit, setDateOfFirstVisit] = useState(
    data.dateOfFirstVisit
  );
  const [dateOfBaptism, setDateOfBaptism] = useState(data.dateOfBaptism);
  const [membership, setMembership] = useState(data.membership);
  const [dateOfTransfer, setDateOfTransfer] = useState(
    data.dateOfTransfer
  );
  const [officerInCharge, setOfficerInCharge] = useState(
    data.officerInCharge
  );
  const [officerSignatureDate, setOfficerSignatureDate] = useState(
    data.officerSignatureDate
  );
  const [headPastorSignatureDate, setHeadPastorSignatureDate] = useState(
    data.headPastorSignatureDate
  );
  const [status, setStatus] = useState(data.status);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setProfile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function setFiles(e: any) {
    setProfile(e.target.files[0]);
  }

  async function submitHandler(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const memberData = {
      welfare: welfare,
      lastName: lastName,
      otherNames: otherNames,
      address: address,
      sex: sex,
      imageUrl: imageUrl,
      dateOfBirth: dateOfBirth,
      nationality: nationality,
      occupation: occupation,
      phone: phone,
      hometown: hometown,
      region: region,
      residence: residence,
      maritalStatus: maritalStatus,
      department: department,
      spouseName: spouseName,
      fatherName: fatherName,
      motherName: motherName,
      childrenName: childrenName,
      nextOfKin: nextOfKin,
      nextOfKinPhone: nextOfKinPhone,
      declaration: declaration,
      dateOfFirstVisit: dateOfFirstVisit,
      dateOfBaptism: dateOfBaptism,
      membership: membership,
      dateOfTransfer: dateOfTransfer,
      officerInCharge: officerInCharge,
      officerSignatureDate: officerSignatureDate,
      headPastorSignatureDate: headPastorSignatureDate,
      status: status,
      dateAdded: new Date(),
    };

    console.log(memberData);

    try {
      let imageUrl = data.imageUrl;

      if (profile) {
        const imageRef = ref(storage, `images/${welfare}-${lastName}-${otherNames}-${Date.now()}`);
        await uploadBytes(imageRef, profile);
        imageUrl = await getDownloadURL(imageRef);

        if (data.imageUrl) {
          const oldImageRef = ref(storage, data.imageUrl);
          await deleteObject(oldImageRef);
        }
      }

      memberData.imageUrl = imageUrl;

      if (data.id) {
        await setDoc(doc(db, "members", data.id), memberData);
      } else {
        await addDoc(collection(db, "members"), memberData);
      }

      setSuccess("Member successfully saved");
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error(error);
      setError("An error occurred while saving the member");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    // <div className="w-[50%] rounded border p-5 h-[100vh] overflow-auto text-sm">
    <form className="flex flex-col space-y-4 p-4 max-w-lg mx-auto" onSubmit={submitHandler}>
      <div className="flex flex-col items-center mb-4">
        <div className="w-32 h-32 rounded-full overflow-hidden mb-2">
          {previewUrl ? (
            <img src={previewUrl} alt="Profile preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          {previewUrl ? "Change Image" : "Upload Image"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="mb-1">Welfare No.</label>
          <input
            className="border p-2 rounded"
            name="welfare"
            value={welfare}
            onChange={(e) => setWelfare(e.target.value)}
            type="text"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1">Last Name</label>
          <input
            className="border p-2 rounded"
            name="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1">Other Names</label>
          <input
            className="border p-2 rounded"
            name="otherNames"
            type="text"
            value={otherNames}
            onChange={(e) => setOtherNames(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1">Address</label>
          <input
            className="border p-2 rounded"
            name="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1">Sex</label>
          <select
            className="border p-2 rounded"
            name="sex"
            value={sex}
            onChange={(e) => setSex(e.target.value)}
            required
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mb-1">Date of Birth</label>
          <input
            className="border p-2 rounded"
            name="dateOfBirth"
            value={dateOfBirth}
            type="date"
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex flex-row justify-between my-5">
        <div className="flex flex-col">
          <label>Nationality</label>
          <input
            className="border p-2 rounded"
            name="nationality"
            type="text"
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label>Occupation</label>
          <input
            className="border p-2 rounded"
            name="occupation"
            type="text"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-row justify-between my-5">
        <div className="flex flex-col">
          <label>Phone Number</label>
          <input
            className="border p-2 rounded"
            name="phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col">
          <label>Hometown</label>
          <input
            className="border p-2 rounded"
            name="hometown"
            type="text"
            value={hometown}
            onChange={(e) => setHometown(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-row justify-between my-5">
        <div className="flex flex-col">
          <label>Region</label>
          <input
            className="border p-2 rounded"
            name="region"
            type="text"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label>Residence</label>
          <input
            className="border p-2 rounded"
            name="residence"
            type="text"
            value={residence}
            onChange={(e) => setResidence(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex flex-row justify-between my-5">
        <div className="flex flex-col">
          <label>Marital Status</label>
          <select
            className="border p-2 rounded w-[190px]"
            name="maritalStatus"
            value={maritalStatus}
            onChange={(e) => setMaritalStatus(e.target.value)}
          >
            <option value="Single">Single</option>
            <option value="Married">Married</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label>Department</label>
          <select
            className="border p-2 rounded w-[190px]"
            name="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          >
            <option value="Men Ministry">Men Ministry</option>
            <option value="Women Ministry">Women Ministry</option>
            <option value="Youth Ministry">Youth Ministry</option>
            <option value="Children Ministry">Children Ministry</option>
          </select>
        </div>
      </div>

      <div className="flex flex-row justify-between my-5">
        <div className="flex flex-col">
          <label>Spouse Name</label>
          <input
            className="border p-2 rounded"
            name="spouseName"
            type="text"
            value={spouseName}
            onChange={(e) => setSpouseName(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label>Fathers Name</label>
          <input
            className="border p-2 rounded"
            name="fatherName"
            type="text"
            value={fatherName}
            onChange={(e) => setFatherName(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-row justify-between my-5">
        <div className="flex flex-col">
          <label>Mothers Name</label>
          <input
            className="border p-2 rounded"
            name="motherName"
            type="text"
            value={motherName}
            onChange={(e) => setMotherName(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label>Children Name</label>
          <textarea
            className="border p-2 rounded"
            name="childrenName"
            value={childrenName}
            onChange={(e) => setChildrenName(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-row justify-between my-5">
        <div className="flex flex-col">
          <label>Next of Kin</label>
          <input
            className="border p-2 rounded"
            name="nextOfKin"
            type="text"
            value={nextOfKin}
            onChange={(e) => setNextOfKin(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label>Next of Kin Telephone</label>
          <input
            className="border p-2 rounded"
            name="nextOfKinPhone"
            type="text"
            value={nextOfKinPhone}
            onChange={(e) => setNextOfKinPhone(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-row justify-between my-5">
        <div className="flex flex-col">
          <label>Declaration</label>
          <select
            className="border p-2 rounded w-[190px]"
            name="declaration"
            value={declaration}
            onChange={(e) => setDeclaration(e.target.value)}
            required
          >
            <option value="Signed">Signed</option>
            <option value="Unsigned">Unsigned</option>
          </select>
        </div>
        <div className="flex flex-col w-[190px]">
          <label>Date of First Visit</label>
          <input
            className="border p-2 rounded"
            name="dateOfFirstVisit"
            type="date"
            value={dateOfFirstVisit}
            onChange={(e) => setDateOfFirstVisit(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex flex-row justify-between my-5">
        <div className="flex flex-col w-[190px]">
          <label>Date of Baptism</label>
          <input
            className="border p-2 rounded"
            name="dateOfBaptism"
            type="date"
            value={dateOfBaptism}
            onChange={(e) => setDateOfBaptism(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-[190px]">
          <label>Membership</label>
          <input
            className="border p-2 rounded"
            name="membership"
            type="text"
            value={membership}
            onChange={(e) => setMembership(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-row justify-between my-5">
        <div className="flex flex-col w-[190px]">
          <label>Date of Transfer</label>
          <input
            className="border p-2 rounded"
            name="dateOfTransfer"
            type="date"
            value={dateOfTransfer}
            onChange={(e) => setDateOfTransfer(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-[190px]">
          <label>Officer in Charge</label>
          <input
            className="border p-2 rounded"
            name="officerInCharge"
            type="text"
            value={officerInCharge}
            onChange={(e) => setOfficerInCharge(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-row justify-between my-5">
        <div className="flex flex-col w-[190px]">
          <label>Officer Signature Date</label>
          <input
            className="border p-2 rounded"
            name="officerSignatureDate"
            type="date"
            value={officerSignatureDate}
            onChange={(e) => setOfficerSignatureDate(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-[190px]">
          <label>Head Pastor Signature Date</label>
          <input
            className="border p-2 rounded"
            name="headPastorSignatureDate"
            type="date"
            value={headPastorSignatureDate}
            onChange={(e) => setHeadPastorSignatureDate(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-row justify-between my-5">
        <div className="flex flex-col">
          <label>Status</label>
          <select
            className="border p-2 rounded w-[190px]"
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {(error || success) && (
        <div
          className={`text-center text-white p-2 rounded ${
            error ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {error || success}
        </div>
      )}

      <div className="flex justify-end space-x-2 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
    // </div>
  );
}
