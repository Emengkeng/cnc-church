import Link from "next/link";
import Image from "next/image";

export default function ViewMember(props: any) {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <form className="flex flex-col space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Link href={props.data.imageUrl}>
            <Image
              className="h-24 w-24 rounded-full"
              src={props.data.imageUrl}
              alt="Profile picture"
              width={96}
              height={96}
            />
          </Link>
          <h2 className="text-xl font-bold text-center">{`${props.data.lastName} ${props.data.otherNames}`}</h2>
        </div>

        {[
          { label: "Welfare No.", value: props.data.welfare },
          { label: "Last Name", value: props.data.lastName },
          { label: "Other Names", value: props.data.otherNames },
          { label: "Address", value: props.data.address },
          { label: "Sex", value: props.data.sex },
          { label: "Date of Birth", value: props.data.dateOfBirth },
          { label: "Nationality", value: props.data.nationality },
          { label: "Occupation", value: props.data.occupation },
          { label: "Phone Number", value: props.data.phone },
          { label: "Hometown", value: props.data.hometown },
          { label: "Region", value: props.data.region },
          { label: "Residence", value: props.data.residence },
          { label: "Marital Status", value: props.data.maritalStatus },
          { label: "Department", value: props.data.department },
          { label: "Spouse Name", value: props.data.spouseName },
          { label: "Father's Name", value: props.data.fatherName },
          { label: "Mother's Name", value: props.data.motherName },
          { label: "Children's Names", value: props.data.childrenName },
          { label: "Next of Kin", value: props.data.nextOfKin },
          { label: "Next of Kin Telephone", value: props.data.nextOfKinPhone },
          { label: "Declaration", value: props.data.declaration },
          { label: "Date of First Visit", value: props.data.dateOfFirstVisit },
          { label: "Date of Baptism", value: props.data.dateOfBaptism },
          { label: "Membership", value: props.data.membership },
          { label: "Date of Transfer", value: props.data.dateOfTransfer },
          { label: "Officer in Charge", value: props.data.officerInCharge },
          { label: "Officer Signature Date", value: props.data.officerSignatureDate },
          { label: "Head Pastor Signature Date", value: props.data.headPastorSignatureDate },
          { label: "Status", value: props.data.status },
        ].map((item, index) => (
          <div key={index} className="flex flex-col sm:flex-row sm:justify-between">
            <label className="font-bold mb-1 sm:mb-0">{item.label}</label>
            <span className="text-gray-700">{item.value}</span>
          </div>
        ))}
      </form>
    </div>
  );
}